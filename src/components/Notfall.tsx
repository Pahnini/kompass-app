import React from 'react';
import { HelpResource } from '../data/helpResources';
import BackButton from './BackButton';

interface NotfallProps {
  helpResources: HelpResource[];
}

export default function Notfall({ helpResources }: NotfallProps): React.ReactElement {
  return (
    <div className="card notfall-card">
      <BackButton />
      <h2>Notfall / Hilfe</h2>
      <div className="contact-list">
        <a href="tel:116111" style={{ color: '#abebc6' }}>
          📞 116111 Jugendtelefon
        </a>
        <a href="tel:08001110111" style={{ color: '#abebc6' }}>
          📞 0800 111 0 111 Telefonseelsorge
        </a>
        <a href="tel:112" style={{ color: '#abebc6' }}>
          🚑 112 Notruf
        </a>
      </div>
      <div
        style={{
          margin: '18px 0 10px 0',
          fontWeight: 'bold',
          color: '#fff',
        }}
      >
        Websites & Hilfe:
      </div>
      <ul>
        {helpResources.map(h => (
          <li key={h.url}>
            <a href={h.url} target="_blank" rel="noopener noreferrer" style={{ color: '#abebc6' }}>
              {h.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="invite-friends">
        <p>
          Freunde einladen:{' '}
          <input
            readOnly
            value={window.location.href}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
            style={{ width: '80%' }}
          />{' '}
          <button onClick={() => navigator.clipboard.writeText(window.location.href)}>📋</button>
        </p>
      </div>
    </div>
  );
}
