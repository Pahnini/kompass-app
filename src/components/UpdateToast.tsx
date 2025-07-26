import { useSWUpdate } from '../hooks/useSWUpdate';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';

export default function UpdateToast() {
  const { newVersionAvailable, update } = useSWUpdate();

  return (
    <AnimatePresence>
      {newVersionAvailable && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3"
        >
          <RefreshCcw className="w-5 h-5 text-white animate-spin-slow" />
          <span>Neue Version verfügbar!</span>
          <button
            onClick={update}
            className="bg-white text-green-600 font-semibold px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Jetzt aktualisieren
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
