import { JSX } from 'react';

type LoadingProps = {
  message: string;
};
export default function Loading({ message = 'Lädt...' }: LoadingProps): JSX.Element {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div className="loading-spinner">🧭</div>
      <h3 style={{ margin: '0 0 10px 0', color: '#ffffff' }}>{message}</h3>
      <p style={{ margin: '0', color: '#d0d0d0', fontSize: '14px' }}>Einen Moment bitte...</p>
    </div>
  );
}
