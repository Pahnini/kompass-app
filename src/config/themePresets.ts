export const themes = {
    ocean: {
        name: "Ocean",
        background: "#0077b6",
        button: "#00b4d8",
        font: "'Poppins', sans-serif",
        textColor: "#ffffff",
    },
    forest: {
        name: "Forest",
        background: "#264653",
        button: "#2a9d8f",
        font: "'Roboto', sans-serif",
        textColor: "#e0f7fa",
    },
    soft: {
        name: "Soft Pastel",
        background: "#f7e1f5",
        button: "#d291bc",
        font: "'Comic Neue', cursive",
        textColor: "#333333",
    },
};

export type ThemeKey = keyof typeof themes;
