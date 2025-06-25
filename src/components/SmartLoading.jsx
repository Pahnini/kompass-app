import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function SmartLoading({
  message = "Seite wird geladen...",
  delay = 400, // Only show loading after 200ms
}) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Only show loading if it takes longer than the delay
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Don't show anything for the first 200ms
  if (!showLoading) {
    return null;
  }

  return <Loading message={message} />;
}
