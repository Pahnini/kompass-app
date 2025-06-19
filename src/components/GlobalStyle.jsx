import { useEffect } from "react";

export default function GlobalStyle() {
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

      html, body {
        min-height: 100%;
        margin: 0;
        padding: 0;
        font-family: 'Poppins', sans-serif;
        background: #2f4f4f;
        color: #e0e0e0;
        font-size: 17px;
        line-height: 1.6;
        letter-spacing: 0.2px;
        scroll-behavior: smooth;
        -webkit-font-smoothing: antialiased;
      }

      h1, h2, h3 {
        font-weight: 600;
        color: #ffffff;
        margin-top: 1.2em;
        margin-bottom: 0.4em;
      }

      p, li {
        font-size: 1em;
        margin-bottom: 0.7em;
        color: #d0d0d0;
      }

      button, input, textarea, select {
        font-size: 1.1em;
        min-height: 42px;
        font-family: inherit;
      }

      .main-area {
        background: #2f4f4f !important;
        padding: 16px 12px 80px;
        transition: background 0.3s ease;
        min-height: 100vh;
      }

      .card {
        background: #3b5b5b;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        padding: 18px 14px;
        margin-bottom: 20px;
        color: #f5f5f5;
      }

      .card:hover {
        box-shadow: 0 6px 24px rgba(0,0,0,0.2);
      }

      button {
        background-color: #5dade2;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 10px 18px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      button:hover {
        background-color: #4a92c7;
      }

      button:focus-visible {
        outline: 3px solid #97ccf0;
        outline-offset: 2px;
      }

      input, select, textarea {
        background-color: #4a6a6a;
        color: white;
        border: 1px solid #a0d0c0;
        border-radius: 8px;
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 12px;
      }

      input:focus, select:focus, textarea:focus {
        border-color: #5dade2;
        outline: none;
      }

      .sidebar {
        background: #2f4f4f;
        color: white;
        z-index: 200;
        box-shadow: 4px 0 18px rgba(0,0,0,0.2);
        transform: translateX(-100%);
        opacity: 0;
        visibility: hidden;
        transition: transform 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        left: 0;
        width: 240px;
        height: 100vh;
      }

      .sidebar.open {
        transform: translateX(0);
        opacity: 1;
        visibility: visible;
      }

      .sidebar button {
        background: transparent;
        border: none;
        color: inherit;
        font-size: 16px;
        text-align: left;
        padding: 12px 20px;
        width: 100%;
        cursor: pointer;
        transition: background 0.2s;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .sidebar button .icon {
        display: flex;
        align-items: center;
      }

      .sidebar button .label {
        flex: 1;
        text-align: left;
      }

      .sidebar button:hover,
      .sidebar button.active {
        background: rgba(255, 255, 255, 0.1);
      }

      .sidebar-toggle-mobile {
        position: fixed;
        top: 16px;
        right: 16px;
        background: #0b9444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        font-size: 24px;
        z-index: 210;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      }

      ::-webkit-scrollbar {
        width: 6px;
      }

      ::-webkit-scrollbar-thumb {
        background: #5dade2;
        border-radius: 6px;
      }

      .toast-success {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #5dade2;
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        font-weight: bold;
        animation: fadeInOut 1.3s ease-in-out;
        z-index: 9999;
      }

      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(10px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; }
        100% { opacity: 0; transform: translateY(-10px); }
      }

      .back-btn-icon {
        background: transparent;
        border: none;
        font-size: 1.2em;
        color: #0b9444;
        margin-bottom: 14px;
        cursor: pointer;
        transition: color 0.2s;
      }

      .back-btn-icon:hover {
        color: #097c38;
      }

      /* Neues Desktop-Layout */
     @media (min-width: 700px) {
  .main-area {
    margin-left: 240px; /* Platz für die Sidebar schaffen */
    min-height: 100vh;
    background: #2f4f4f;
    padding: 24px 32px;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
    height: 100vh;
    transform: none !important;
    opacity: 1 !important;
    visibility: visible !important;
    background: #2f4f4f;
    z-index: 200;
    box-shadow: 4px 0 18px rgba(0, 0, 0, 0.2);
  }

  .sidebar-toggle-mobile {
    display: none;
  }
}
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return null;
}
