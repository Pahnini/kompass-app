import { ArrowLeft } from "lucide-react";

export default function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="back-button">
      <ArrowLeft size={20} />
      Zurück
    </button>
  );
}
