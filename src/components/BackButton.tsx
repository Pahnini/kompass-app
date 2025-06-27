import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/")} className="back-button">
      <ArrowLeft size={20} />
      Zurück
    </button>
  );
}
