import { JSX, useEffect, useState, useContext } from 'react';
import Loading from './Loading';
import { LanguageContext } from '../context/LanguageContext';

type SmartLoadingProps = {
  message?: string;
  delay?: number;
};

export default function SmartLoading({
  message,
  delay = 400, // Only show loading after 400ms
}: SmartLoadingProps): JSX.Element | null {
  const languageContext = useContext(LanguageContext);
  const [showLoading, setShowLoading] = useState(false);

  // Fallback to default message if no context available
  const loadingMessage = message || languageContext?.t('loading.page') || 'Loading page...';

  useEffect(() => {
    // Only show loading if it takes longer than the delay
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Don't show anything for the first 400ms
  if (!showLoading) {
    return null;
  }

  return <Loading message={loadingMessage} />;
}
