import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
<<<<<<< HEAD
    <button onClick={() => navigate("/")} className="back-button">
=======
    <button onClick={onClick} className="back-button">
>>>>>>> 40c7e75 (Refactor components: replace back button implementation in DeinWeg, Guide, and Skills with BackButton component; add DeleteButton component for improved delete functionality and UI consistency.)
      <ArrowLeft size={20} />
      Zurück
    </button>
  );
}
