import { ArrowLeft } from "lucide-react";

export default function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="back-button flex items-center gap-2 text-base text-white hover:text-teal-300" >
      <ArrowLeft size={20} />
      Zurück
    </button>
  );
}
