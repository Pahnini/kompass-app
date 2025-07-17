import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PanicScreen() {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<'ein' | 'aus'>('ein');
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase(p => (p === 'ein' ? 'aus' : 'ein'));
            setCycle(c => c + 1);

            // Vibration: 500ms bei jeder Phase
            if (navigator.vibrate) {
                navigator.vibrate(phase === 'ein' ? [500] : [300]);
            }
        }, 5000); // alle 5 Sekunden wechseln

        return () => clearInterval(interval);
    }, [phase]);

    const color = phase === 'ein' ? '#58d68d' : '#5dade2';
    const text = phase === 'ein' ? 'Atme tief ein …' : '… und aus';

    return (
        <div
            className="flex flex-col items-center justify-center h-screen text-center px-6"
            style={{ backgroundColor: '#1c1c1c', color: '#fff' }}
        >
            <div
                className="rounded-full transition-all duration-1000 ease-in-out"
                style={{
                    width: phase === 'ein' ? 240 : 140,
                    height: phase === 'ein' ? 240 : 140,
                    backgroundColor: color,
                    marginBottom: '32px',
                }}
            />

            <h1 className="text-2xl font-semibold mb-2">{text}</h1>
            <p className="text-sm text-gray-300 mb-8">
                Konzentriere dich auf deinen Atem. Du schaffst das.
            </p>

            <button
                onClick={() => navigate('/')}
                className="bg-white text-black px-4 py-2 rounded-md shadow hover:bg-gray-200 transition"
            >
                Ich fühle mich besser
            </button>
        </div>
    );
}
