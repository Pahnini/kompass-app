import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import React, { useState } from "react"
import compassImg from "../assets/kompass-welcome.png"
import { supabase } from "../utils/supabase"
import "./WelcomeScreen.css"

export default function WelcomeScreen(): React.ReactElement {
  const [authView, setAuthView] = useState<"sign_in" | "magic_link">("sign_in")

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-header">
          <img
            src={compassImg}
            alt="Kompass Illustration"
            className="welcome-image"
          />
          <h1 className="welcome-title">Willkommen zurück!</h1>
          <p className="welcome-subtitle">
            Dein digitaler Kompass für Achtsamkeit, Skills & Selbsthilfe
          </p>
        </div>

        <div className="welcome-actions">
          <div className="auth-container">
            <Auth
              supabaseClient={supabase}
              view={authView}
              appearance={{
                theme: ThemeSupa,
                style: {
                  container: {
                    width: "100%",
                  },
                  button: {
                    borderRadius: "8px",
                    backgroundColor: "#0b9444",
                    color: "white",
                    fontWeight: "bold",
                  },
                  input: {
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  },
                  anchor: {
                    color: "#b7ffd0",
                  },
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
                  magic_link: {
                    email_input_label: "Email",
                    button_label: "Login-Link senden",
                    loading_button_label: "Sende Link...",
                    link_text: "Login mit Magic Link",
                  },
                },
              }}
            />
            <div className="switch-auth">
              <button
                onClick={() =>
                  setAuthView((prev) =>
                    prev === "sign_in" ? "magic_link" : "sign_in"
                  )
                }
                className="continue-btn"
              >
                {authView === "sign_in"
                  ? "Stattdessen mit Magic Link anmelden"
                  : "Stattdessen mit Passwort anmelden"}
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
          <p className="welcome-note">
            Immer für dich da – Skills, Pläne & Hilfe bei Krisen
          </p>
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
      </div>
    </div>
  )
}
