import compassImg from "../assets/kompass-welcome.png";
import "./WelcomeScreen.css";

export default function WelcomeScreen({ onContinue }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <img src={compassImg} alt="Kompass Illustration" />
        <button onClick={onContinue}>Los geht's</button>
      </div>
    </div>
  );
}