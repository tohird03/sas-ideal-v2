// AI backend (ai-backend loyihasi) bilan SSE orqali gaplashadi.
// Manzil: .env da REACT_APP_AI_URL (Vite bo'lsa: import.meta.env.VITE_AI_URL ga almashtiring).

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type AiEvent =
  | { type: 'text'; text: string }
  | { type: 'tool'; name: string }
  | { type: 'error'; message: string }
  | { type: 'done' };

export class AiHttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const AI_URL: string = process.env.REACT_APP_AI_URL as string;

// SAS tokeni. Loyihangizda token qayerda saqlansa, shu yerni moslang
// (masalan: stores.authStore.token?.accessToken).
const getToken = (): string => {
  const raw = window.localStorage.getItem('accessToken') ?? '';
  try {
    const v = JSON.parse(raw);
    return typeof v === 'string' ? v : raw;
  } catch {
    return raw;
  }
};

export async function aiChatStream(
  messages: IChatMessage[],
  onEvent: (event: AiEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${AI_URL.replace(/\/+$/, '')}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ messages: messages.map(({ role, content }) => ({ role, content })) }),
    signal,
  });

  if (!res.ok || !res.body) {
    throw new AiHttpError(
      res.status,
      res.status === 401 ? 'Sessiya tugagan, qaytadan kiring.' : `AI xizmati xatosi (${res.status})`,
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  for (; ;) {
    // eslint-disable-next-line no-await-in-loop
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');

    let i: number;
    while ((i = buf.indexOf('\n\n')) >= 0) {
      const block = buf.slice(0, i);
      buf = buf.slice(i + 2);
      const data = block
        .split('\n')
        .filter((l) => l.startsWith('data:'))
        .map((l) => l.slice(5).trim())
        .join('');
      if (!data) continue;
      try {
        onEvent(JSON.parse(data) as AiEvent);
      } catch {
        /* buzilgan bo'lak — o'tkazib yuboriladi */
      }
    }
  }
}
