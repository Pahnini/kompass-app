import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { UIProvider } from "./context/UIContext";
import { UserDataProvider } from "./context/UserDataContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <UserDataProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </UserDataProvider>
    </ThemeProvider>
  </React.StrictMode>
);
