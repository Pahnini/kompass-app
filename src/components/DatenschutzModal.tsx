import { JSX } from 'react';

type DatenschutzModalProps = {
  onClose: () => void;
  dsHinweis: string;
};

export default function DatenschutzModal({
  onClose,
  dsHinweis,
}: DatenschutzModalProps): JSX.Element {
  return (
    <div className="ds-modal">
      <div className="ds-box">
        <p>{dsHinweis}</p>
        <button onClick={onClose}>Alles klar 👍</button>
      </div>
    </div>
  );
}
