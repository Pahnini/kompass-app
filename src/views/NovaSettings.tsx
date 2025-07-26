import { useState, useEffect } from 'react';

export default function NovaSettings() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('nova-disabled');
    if (stored === 'true') setEnabled(false);
  }, []);

  const toggleNova = () => {
    const newValue = !enabled;
    localStorage.setItem('nova-disabled', newValue ? 'false' : 'true');
    setEnabled(newValue);
    window.location.reload(); // optional, um Nova sofort neu zu laden
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Nova Einstellungen</h2>
      <p className="text-sm text-gray-500">Du kannst Nova hier aktivieren oder deaktivieren.</p>
      <button
        onClick={toggleNova}
        className={`px-4 py-2 rounded text-white shadow ${
          enabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {enabled ? 'Nova deaktivieren' : 'Nova aktivieren'}
      </button>
    </div>
  );
}
