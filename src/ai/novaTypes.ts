import type { InferUITools, UIMessage } from 'ai';
import type { novaTools } from '../../api/_lib/novaTools';

export type NovaUITools = InferUITools<typeof novaTools>;
export type NovaUIMessage = UIMessage<unknown, never, NovaUITools>;
