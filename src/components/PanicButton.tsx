// components/PanicButton.tsx
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function PanicButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/panic')}
            aria-label="Panikhilfe starten"
            className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition"
        >
            <AlertTriangle className="w-6 h-6" />
        </button>
    );
}
