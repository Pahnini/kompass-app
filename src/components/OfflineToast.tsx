import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { AnimatePresence, motion } from 'framer-motion';

export default function OfflineToast() {
  const isOffline = useOfflineStatus();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg z-50 text-sm"
        >
          🔌 Keine Internetverbindung – du bist offline.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
