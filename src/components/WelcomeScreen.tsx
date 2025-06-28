import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import React from "react";
import compassImg from "../assets/kompass-welcome.png";
import supabase from "../utils/supabase";
import "./WelcomeScreen.css";

export default function WelcomeScreen(): React.ReactElement {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-header">
          <img
            src={compassImg}
            alt="Kompass Illustration"
            className="welcome-image"
          />
        </div>

        <div className="welcome-features">
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">Skills & Achtsamkeit</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📝</span>
            <span className="feature-text">Tagebuch & Ziele</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <span className="feature-text">Chatbot Unterstützung</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚨</span>
            <span className="feature-text">Notfall Hilfe</span>
          </div>
        </div>

        <div className="welcome-actions">
          <div className="auth-container">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  container: { width: "100%" },
                  button: {
                    borderRadius: "8px",
                    backgroundColor: "#5dade2",
                    color: "white",
                    fontWeight: "bold",
                  },
                  input: { borderRadius: "8px" },
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "Email",
                    password_label: "Passwort",
                    button_label: "Anmelden",
                    loading_button_label: "Anmelden...",
                    link_text: "Bereits ein Konto? Anmelden",
                  },
                  sign_up: {
                    email_label: "Email",
                    password_label: "Passwort",
                    button_label: "Registrieren",
                    loading_button_label: "Registrieren...",
                    link_text: "Kein Konto? Registrieren",
                  },
                },
              }}
            />
          </div>
          <p className="welcome-note">
            Immer für dich da – Skills, Pläne & Hilfe bei Krisen
          </p>
        </div>
      </div>
    </div>
  );
}
