import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeechAlternativeLike {
  transcript: string;
}

interface SpeechResultLike {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: SpeechAlternativeLike;
}

interface SpeechResultListLike {
  readonly length: number;
  readonly [index: number]: SpeechResultLike;
}

interface SpeechResultEventLike {
  readonly resultIndex: number;
  readonly results: SpeechResultListLike;
}

interface SpeechErrorEventLike {
  readonly error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechResultEventLike) => void) | null;
  onerror: ((event: SpeechErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface UseSpeechRecognitionOptions {
  language?: string;
  onTranscript: (transcript: string) => void;
}

interface SpeechRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  interimTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  clearError: () => void;
}

function getSpeechErrorMessage(error: string): string {
  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Der Mikrofonzugriff wurde nicht erlaubt. Du kannst den Gedanken weiterhin eintippen.';
    case 'no-speech':
      return 'Es wurde keine Sprache erkannt. Versuche es erneut oder tippe deinen Gedanken ein.';
    case 'audio-capture':
      return 'Es wurde kein verfügbares Mikrofon gefunden.';
    case 'network':
      return 'Die Spracherkennung konnte keine Verbindung herstellen.';
    case 'language-not-supported':
      return 'Deutsch wird von der Spracherkennung dieses Browsers nicht unterstützt.';
    default:
      return 'Die Spracherkennung konnte gerade nicht gestartet werden.';
  }
}

export function useSpeechRecognition({
  language = 'de-DE',
  onTranscript,
}: UseSpeechRecognitionOptions): SpeechRecognitionState {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const SpeechRecognitionApi =
    typeof window === 'undefined'
      ? undefined
      : (window.SpeechRecognition ?? window.webkitSpeechRecognition);
  const isSupported = Boolean(SpeechRecognitionApi);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(
    () => () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    },
    []
  );

  const startListening = useCallback((): void => {
    if (!SpeechRecognitionApi) {
      setError('Dieser Browser unterstützt Sprache-zu-Text nicht. Du kannst den Text eintippen.');
      return;
    }
    if (recognitionRef.current) return;

    setError(null);
    setInterimTranscript('');

    const recognition = new SpeechRecognitionApi();
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = event => {
      let finalText = '';
      let interimText = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result?.[0]?.transcript?.trim();
        if (!transcript) continue;
        if (result.isFinal) finalText += `${transcript} `;
        else interimText += `${transcript} `;
      }

      if (finalText.trim()) onTranscriptRef.current(finalText.trim());
      setInterimTranscript(interimText.trim());
    };
    recognition.onerror = event => {
      if (event.error !== 'aborted') setError(getSpeechErrorMessage(event.error));
    };
    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setError('Die Spracherkennung konnte gerade nicht gestartet werden.');
    }
  }, [SpeechRecognitionApi, language]);

  const stopListening = useCallback((): void => {
    recognitionRef.current?.stop();
  }, []);

  return {
    isSupported,
    isListening,
    interimTranscript,
    error,
    startListening,
    stopListening,
    clearError: () => setError(null),
  };
}
