import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type ToolUIPart } from 'ai';
import { Bot, ExternalLink, Send, Settings, ShieldAlert, Square } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import novaAvatar from '../assets/nova-avatar.png';
import BackButton from '../components/ui/BackButton';
import type { NovaUIMessage, NovaUITools } from '../ai/novaTypes';
import { supabase } from '../utils/supabase';
import './ChatPage.css';

const quickPrompts = [
  'Ich möchte gerade etwas tun, um runterzukommen.',
  'Hilf mir, meine Gedanken kurz zu sortieren.',
  'Ich möchte einen kleinen nächsten Schritt planen.',
  'Ich brauche Hilfe oder einen Kontakt.',
];

type NovaToolPart = ToolUIPart<NovaUITools>;
type NovaMode = 'rules' | 'openai' | 'unknown';

function readNovaMode(value: unknown): NovaMode {
  if (typeof value !== 'object' || value === null || !('mode' in value)) return 'unknown';
  return value.mode === 'rules' || value.mode === 'openai' ? value.mode : 'unknown';
}

function NovaToolCard({
  part,
  onOpen,
}: {
  part: NovaToolPart;
  onOpen: (path: string) => void;
}): React.ReactElement {
  if (part.state === 'output-available') {
    return (
      <button type="button" className="nova-tool-card" onClick={() => onOpen(part.output.path)}>
        <span>
          <strong>{part.output.label}</strong>
          <small>{part.output.description}</small>
        </span>
        <ExternalLink aria-hidden="true" size={18} />
      </button>
    );
  }

  if (part.state === 'output-error' || part.state === 'output-denied') {
    return <div className="nova-tool-status">Diese App-Funktion ist gerade nicht verfügbar.</div>;
  }

  return <div className="nova-tool-status">Nova bereitet einen Vorschlag vor …</div>;
}

export default function ChatPage(): React.ReactElement {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [novaMode, setNovaMode] = useState<NovaMode>('unknown');
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport<NovaUIMessage>({
        api: '/api/nova',
        headers: async () => {
          const { data, error } = await supabase.auth.getSession();

          if (error || !data.session?.access_token) {
            throw new Error('Nova benötigt eine gültige Anmeldung.');
          }

          return { Authorization: `Bearer ${data.session.access_token}` };
        },
      }),
    []
  );

  const { messages, sendMessage, status, stop, error, clearError } = useChat<NovaUIMessage>({
    transport,
  });

  const isBusy = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    const controller = new AbortController();

    const loadNovaMode = async (): Promise<void> => {
      try {
        const response = await fetch('/api/nova', {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) return;

        setNovaMode(readNovaMode(await response.json()));
      } catch {
        // The chat itself will show a useful error if the local endpoint is unavailable.
      }
    };

    void loadNovaMode();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, status]);

  const sendText = (text: string): void => {
    const trimmedText = text.trim();
    if (!trimmedText || isBusy) return;

    clearError();
    void sendMessage({ text: trimmedText });
    setInput('');
  };

  return (
    <div className="nova-page">
      <header className="nova-header">
        <BackButton />
        <div className="nova-title-row">
          <img src={novaAvatar} alt="" className="nova-header-avatar" />
          <div>
            <p className="nova-eyebrow">Melforia-Begleitung</p>
            <h1>Nova</h1>
          </div>
          <Link to="/nova/settings" className="nova-settings-link" aria-label="Nova einstellen">
            <Settings aria-hidden="true" size={20} />
          </Link>
        </div>
        <p className="nova-boundary">
          Nova hilft dir, die App zu nutzen und Gedanken kurz zu sortieren. Sie ist keine
          Therapeutin und kein Notfalldienst.
        </p>
        {novaMode === 'rules' && (
          <p className="nova-mode-note">
            <strong>Kostenloser Testmodus</strong>
            <span>Nova verwendet feste, geprüfte Antworten statt einer generativen KI.</span>
          </p>
        )}
      </header>

      <section className="nova-crisis-banner" aria-label="Hinweis für akute Krisen">
        <ShieldAlert aria-hidden="true" size={20} />
        <p>
          Bei unmittelbarer Gefahr: <a href="tel:112">112 anrufen</a> oder eine Person in deiner
          Nähe ansprechen. Nova kann Krisen nicht zuverlässig erkennen.
        </p>
        <button type="button" onClick={() => void navigate('/notfall')}>
          Hilfe öffnen
        </button>
      </section>

      <section className="nova-conversation" aria-live="polite" aria-label="Unterhaltung mit Nova">
        <article className="nova-message nova-message-assistant">
          <div className="nova-message-label">
            <Bot aria-hidden="true" size={16} /> Nova
          </div>
          <p>
            Wie geht es dir gerade? Du kannst etwas auswählen oder in deinen eigenen Worten
            schreiben.
          </p>
        </article>

        {messages.map(message => (
          <article
            key={message.id}
            className={`nova-message ${
              message.role === 'user' ? 'nova-message-user' : 'nova-message-assistant'
            }`}
          >
            <div className="nova-message-label">
              {message.role === 'user' ? (
                'Du'
              ) : (
                <>
                  <Bot aria-hidden="true" size={16} /> Nova
                </>
              )}
            </div>
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <p key={`${message.id}-text-${index}`}>{part.text}</p>;
              }

              if (
                part.type === 'tool-openSkills' ||
                part.type === 'tool-openMoodCompass' ||
                part.type === 'tool-openGoals' ||
                part.type === 'tool-showHelpContacts'
              ) {
                return (
                  <NovaToolCard
                    key={part.toolCallId}
                    part={part}
                    onOpen={path => void navigate(path)}
                  />
                );
              }

              return null;
            })}
          </article>
        ))}

        {status === 'submitted' && (
          <div className="nova-thinking" role="status">
            Nova überlegt kurz …
          </div>
        )}

        {error && (
          <div className="nova-error" role="alert">
            <p>
              Nova konnte gerade nicht antworten. Prüfe deine Verbindung und versuche es erneut.
            </p>
            <button type="button" onClick={clearError}>
              Hinweis schließen
            </button>
          </div>
        )}
        <div ref={conversationEndRef} />
      </section>

      {messages.length === 0 && (
        <section className="nova-quick-prompts" aria-label="Gespräch beginnen">
          {quickPrompts.map(prompt => (
            <button key={prompt} type="button" onClick={() => sendText(prompt)} disabled={isBusy}>
              {prompt}
            </button>
          ))}
        </section>
      )}

      <form
        className="nova-composer"
        onSubmit={event => {
          event.preventDefault();
          sendText(input);
        }}
      >
        <label htmlFor="nova-message">Nachricht an Nova</label>
        <div className="nova-composer-row">
          <textarea
            id="nova-message"
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendText(input);
              }
            }}
            maxLength={1_500}
            rows={2}
            placeholder="Was ist gerade los?"
            disabled={isBusy}
          />
          {isBusy ? (
            <button type="button" className="nova-stop-button" onClick={() => void stop()}>
              <Square aria-hidden="true" size={18} />
              <span>Stoppen</span>
            </button>
          ) : (
            <button type="submit" disabled={!input.trim()}>
              <Send aria-hidden="true" size={18} />
              <span>Senden</span>
            </button>
          )}
        </div>
        {novaMode === 'rules' ? (
          <small>
            Der Chat wird in Nova 0.1 nicht gespeichert. Deine Nachrichten werden nur für die
            aktuelle, regelbasierte Antwort an den geschützten Nova-Endpunkt übertragen.
          </small>
        ) : (
          <small>
            Der Chat wird in Nova 0.1 nicht gespeichert. Für Antworten werden nur die letzten
            Nachrichten verschlüsselt an den geschützten Nova-Endpunkt übertragen.
          </small>
        )}
      </form>
    </div>
  );
}
