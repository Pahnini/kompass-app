import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import novaAvatar from '../assets/nova-avatar.png';

type NovaProps = {
  context: 'free' | 'welcome' | 'mood' | 'skill' | 'goal';
};

export function NovaAssistant({ context }: NovaProps) {
  const [visible, setVisible] = useState(true);
  const [disabled, setDisabled] = useState(false);

  // 🛑 Check if Nova is turned off
  useEffect(() => {
    const novaSetting = localStorage.getItem('nova-disabled');
    if (novaSetting === 'true') {
      setDisabled(true);
    }
  }, []);

  // 🕓 Auto-hide after 6s
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timeout);
  }, [context]);

  if (disabled) return null;

  const getMessage = () => {
    if (context === 'welcome') return 'Schön, dass du wieder da bist.';
    if (context === 'mood') return 'Wie fühlst du dich heute?';
    if (context === 'skill') return 'Probier mal einen Skill aus!';
    if (context === 'goal') return 'Was möchtest du heute schaffen?';
    return 'Ich bin hier, falls du mich brauchst.';
  };

  return (
    <div className="relative w-fit">
      {/* 🌀 Sprechblase mit Framer Motion */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-16 right-0 bg-white shadow-md rounded-lg px-4 py-2 text-sm text-gray-800 max-w-[200px] z-50 pointer-events-none"
          >
            {getMessage()}
            <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-white rotate-45 z-40" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar */}
      <Link to="/nova" aria-label="Nova-Chat öffnen">
        <img
          src={novaAvatar}
          alt="Nova"
          className="w-16 h-16 rounded-full shadow-xl border border-blue-400 bg-white p-1"
        />
      </Link>
    </div>
  );
}
