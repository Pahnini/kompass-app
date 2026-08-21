const READABLE_SELECTOR = [
  'h1',
  'h2',
  'h3',
  'h4',
  'p',
  'li',
  'label',
  'legend',
  'blockquote',
  '[data-speech-text]',
].join(',');

const MAX_SPEECH_LENGTH = 12_000;
const TERMINAL_PUNCTUATION = /[.!?…:]$/;

function isExcluded(element: Element): boolean {
  return Boolean(
    element.closest(
      '[hidden], [aria-hidden="true"], [data-speech-ignore="true"], .sr-only, .melforia-reading-toolbar'
    )
  );
}

export function collectReadableText(root: ParentNode): string {
  const passages: string[] = [];
  let totalLength = 0;

  for (const element of root.querySelectorAll<HTMLElement>(READABLE_SELECTOR)) {
    if (isExcluded(element)) continue;

    const text = (element.dataset.speechText || element.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text || passages.at(-1) === text) continue;

    passages.push(text);
    totalLength += text.length + 1;
    if (totalLength >= MAX_SPEECH_LENGTH) break;
  }

  return passages
    .map(text => (TERMINAL_PUNCTUATION.test(text) ? text : `${text}.`))
    .join(' ')
    .slice(0, MAX_SPEECH_LENGTH);
}
