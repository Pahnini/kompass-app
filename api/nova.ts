import { createHash, randomUUID } from 'node:crypto';
import { type OpenAILanguageModelResponsesOptions, openai } from '@ai-sdk/openai';
import { createClient, type User } from '@supabase/supabase-js';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  safeValidateUIMessages,
  streamText,
  toUIMessageStream,
} from 'ai';
import { z } from 'zod';
import type { NovaUIMessage } from '../src/ai/novaTypes';
import { getLatestUserText, hasCrisisSignal, NOVA_SYSTEM_PROMPT } from './_lib/novaPolicy';
import { checkNovaRateLimit } from './_lib/rateLimit';
import { createNovaRuleReply, type NovaRuleReply, type NovaRuleToolName } from './_lib/novaRules';
import { novaDestinations, novaTools } from './_lib/novaTools';

const MAX_MESSAGES_PER_REQUEST = 40;
const MAX_MESSAGES_FOR_MODEL = 12;
const MAX_TEXT_LENGTH = 1_500;
const MAX_TOTAL_TEXT_LENGTH = 12_000;

const requestSchema = z.object({
  messages: z.array(z.unknown()).min(1).max(MAX_MESSAGES_PER_REQUEST),
});

type NovaMode = 'rules' | 'openai';

function jsonResponse(
  status: number,
  body: Record<string, string>,
  headers?: HeadersInit
): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return null;

  const token = authorization.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
}

function getSupabaseConfig(): { url: string; publishableKey: string } | null {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY;

  return url && publishableKey ? { url, publishableKey } : null;
}

async function authenticate(request: Request): Promise<User | null> {
  const token = getBearerToken(request);
  const config = getSupabaseConfig();

  if (!token || !config) return null;

  const supabase = createClient(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  const { data, error } = await supabase.auth.getUser(token);

  return error ? null : data.user;
}

function isAllowedConversation(messages: readonly NovaUIMessage[]): boolean {
  let totalTextLength = 0;

  for (const message of messages) {
    if (message.role !== 'user' && message.role !== 'assistant') return false;
    if (message.metadata !== undefined) return false;

    for (const part of message.parts) {
      if (part.type === 'text') {
        if (part.text.length > MAX_TEXT_LENGTH) return false;
        totalTextLength += part.text.length;
        continue;
      }

      if (message.role === 'assistant' && part.type === 'step-start') continue;
      if (
        message.role === 'assistant' &&
        (part.type === 'tool-openSkills' ||
          part.type === 'tool-openMoodCompass' ||
          part.type === 'tool-openGoals' ||
          part.type === 'tool-showHelpContacts')
      ) {
        continue;
      }

      return false;
    }
  }

  return totalTextLength <= MAX_TOTAL_TEXT_LENGTH;
}

function getRecentConversation(messages: NovaUIMessage[]): NovaUIMessage[] {
  const recentMessages = messages.slice(-MAX_MESSAGES_FOR_MODEL);
  const firstUserMessage = recentMessages.findIndex(message => message.role === 'user');
  return firstUserMessage >= 0 ? recentMessages.slice(firstUserMessage) : [];
}

function createSafetyIdentifier(userId: string): string {
  return createHash('sha256').update(`kompass-nova:${userId}`).digest('hex');
}

function getNovaMode(): NovaMode {
  const requestedMode = process.env.NOVA_MODE?.trim().toLocaleLowerCase('en-US');
  return requestedMode === 'openai' && process.env.OPENAI_API_KEY ? 'openai' : 'rules';
}

function createBoundedResponse(reply: NovaRuleReply, idPrefix: string): Response {
  const toolCallId = reply.toolName ? `${idPrefix}-${reply.toolName}-${randomUUID()}` : null;
  const textId = `${idPrefix}-text-${randomUUID()}`;

  return createUIMessageStreamResponse({
    headers: { 'Cache-Control': 'no-store' },
    stream: createUIMessageStream<NovaUIMessage>({
      execute({ writer }) {
        writer.write({ type: 'text-start', id: textId });
        writer.write({
          type: 'text-delta',
          id: textId,
          delta: reply.text,
        });
        writer.write({ type: 'text-end', id: textId });

        if (!reply.toolName || !toolCallId) return;

        writer.write({
          type: 'tool-input-available',
          toolCallId,
          toolName: reply.toolName,
          input: {},
        });
        writer.write({
          type: 'tool-output-available',
          toolCallId,
          output: novaDestinations[reply.toolName],
        });
      },
    }),
  });
}

function createCrisisResponse(): Response {
  return createBoundedResponse(
    {
      text: 'Das klingt gerade ernst. Bitte bleib damit nicht allein und hol jetzt eine reale Vertrauensperson dazu. Wenn du unmittelbar in Gefahr bist, ruf 112 an oder bitte jemanden neben dir, das zu tun.',
      toolName: 'showHelpContacts' satisfies NovaRuleToolName,
    },
    'crisis'
  );
}

function safeErrorName(error: unknown): string {
  return error instanceof Error ? error.name : 'UnknownError';
}

async function handlePost(request: Request): Promise<Response> {
  if (!getSupabaseConfig()) {
    return jsonResponse(503, { error: 'Die Anmeldung für Nova ist noch nicht eingerichtet.' });
  }

  const user = await authenticate(request);
  if (!user) {
    return jsonResponse(401, { error: 'Bitte melde dich erneut an.' });
  }

  const rateLimit = checkNovaRateLimit(user.id);
  if (!rateLimit.allowed) {
    return jsonResponse(
      429,
      { error: 'Bitte warte kurz, bevor du Nova erneut schreibst.' },
      { 'Retry-After': String(rateLimit.retryAfterSeconds) }
    );
  }

  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return jsonResponse(400, { error: 'Die Anfrage konnte nicht gelesen werden.' });
  }

  const parsedRequest = requestSchema.safeParse(requestBody);
  if (!parsedRequest.success) {
    return jsonResponse(400, { error: 'Die Unterhaltung ist zu lang oder ungültig.' });
  }

  const validation = await safeValidateUIMessages<NovaUIMessage>({
    messages: parsedRequest.data.messages,
    tools: novaTools,
  });
  if (!validation.success || !isAllowedConversation(validation.data)) {
    return jsonResponse(400, { error: 'Die Unterhaltung enthält ungültige Inhalte.' });
  }

  const recentConversation = getRecentConversation(validation.data);
  if (recentConversation.length === 0) {
    return jsonResponse(400, { error: 'Es fehlt eine Nachricht an Nova.' });
  }

  const latestUserText = getLatestUserText(recentConversation);
  if (hasCrisisSignal(latestUserText)) {
    return createCrisisResponse();
  }

  if (getNovaMode() === 'rules') {
    return createBoundedResponse(createNovaRuleReply(latestUserText), 'rules');
  }

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? 'gpt-5.6-luna'),
    instructions: NOVA_SYSTEM_PROMPT,
    messages: await convertToModelMessages(recentConversation, { tools: novaTools }),
    tools: novaTools,
    maxOutputTokens: 300,
    timeout: { totalMs: 25_000 },
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        parallelToolCalls: false,
        reasoningEffort: 'low',
        safetyIdentifier: createSafetyIdentifier(user.id),
        store: false,
        textVerbosity: 'low',
      } satisfies OpenAILanguageModelResponsesOptions,
    },
  });

  return createUIMessageStreamResponse({
    headers: { 'Cache-Control': 'no-store' },
    stream: toUIMessageStream<typeof novaTools, NovaUIMessage>({
      stream: result.stream,
      tools: novaTools,
      sendReasoning: false,
      onError: error => {
        console.error('Nova stream failed:', safeErrorName(error));
        return 'Nova konnte gerade nicht antworten. Bitte versuche es später noch einmal.';
      },
    }),
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'GET') {
      return jsonResponse(200, { mode: getNovaMode() });
    }

    if (request.method !== 'POST') {
      return jsonResponse(405, { error: 'Method not allowed.' }, { Allow: 'GET, POST' });
    }

    return handlePost(request);
  },
};
