export const getMockResponse = (mood: string): string => {
  switch (mood) {
    case "focus":
      return "Mach weiter so – ein kleiner Spaziergang könnte dir helfen, fokussiert zu bleiben.";
    case "hopeful":
      return "Nutze den Schwung und starte etwas Neues – vielleicht ein kleiner Wochenplan?";
    case "overwhelmed":
      return "3 Minuten tiefe Atmung. Dann: eine To-Do-Pause. Du musst nicht alles heute schaffen.";
    case "tired":
      return "Schließ kurz die Augen, atme durch. Vielleicht hilft ein Powernap oder Musik.";
    default:
      return "Bleib bei dir. Jeder Tag ist anders – du darfst fühlen, was du fühlst.";
  }
};
