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
        background: #f0f4f8;
        color: #1e1e1e;
        transition: background 0.4s ease;
      }
html, body {
  font-size: 17px;
  line-height: 1.6;
  letter-spacing: 0.2px;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}
  h1, h2, h3 {
  font-weight: 600;
  margin-top: 1.2em;
  margin-bottom: 0.4em;
}
.quick-btn:active {
  transform: scale(1.04);
  box-shadow: 0 0 12px #b7ffd0aa;
}
p, li {
  font-size: 1em;
  margin-bottom: 0.7em;
  color: #2f4f4f;
}

@media (max-width: 600px) {
  html {
    font-size: 16px;
  }
}
      .main-area {
        padding: 16px 12px 80px;
        transition: background 0.3s ease;
      }
button, input, textarea, select {
    font-size: 1.1em;
    min-height: 42px;
  }
      /* Card */
      .card {
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        padding: 18px 14px;
        margin-bottom: 20px;
        transition: box-shadow 0.2s ease;
      }
      .card:hover {
        box-shadow: 0 6px 24px rgba(0,0,0,0.08);
      }

      /* Buttons */
      button {
        background-color: #0b9444;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 10px 18px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-family: inherit;
      }
      button:hover {
        background-color: #097c38;
      }
      button:focus-visible {
        outline: 3px solid #5dade2;
        outline-offset: 2px;
      }

      /* Inputs */
      input, select, textarea {
        font-family: inherit;
        font-size: 1em;
        padding: 10px;
        border: 1px solid #cde3da;
        border-radius: 8px;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 12px;
        transition: border 0.2s ease;
      }
      input:focus, select:focus, textarea:focus {
        border-color: #0b9444;
        outline: none;
      }

      /* Sidebar */
      .sidebar {
        background: #2f4f4f;
        color: white;
        position: fixed;
        top: 0;
        left: -240px;
        width: 240px;
        height: 100vh;
        z-index: 200;
        box-shadow: 4px 0 18px rgba(0,0,0,0.2);
        transition: left 0.3s ease;
        display: flex;
        flex-direction: column;
      }
      .sidebar.open {
        left: 0;
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

      @media (min-width: 700px) {
        .sidebar {
          left: 0;
          transform: translateX(0);
          position: relative;
          height: auto;
          box-shadow: none;
        }
        .sidebar-toggle-mobile {
          display: none;
        }
      }

      /* Scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-thumb {
        background: #b7ffd0;
        border-radius: 6px;
      }

      /* Toast */
      .toast-success {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #16c66b;
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
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return null;
}
