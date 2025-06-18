import { ArrowLeft } from "lucide-react";
import "./BackButton.css";

export default function BackButton({ onClick }) {
  return (
    <button className="back-btn" onClick={onClick} aria-label="Zurück">
      <ArrowLeft size={20} strokeWidth={2.2} />
    </button>
  );
}
