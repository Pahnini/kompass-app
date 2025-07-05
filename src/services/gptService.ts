let lastCall = 0;

export async function fetchGPTResponse(mood: string): Promise<string> {
  const now = Date.now();
  if (now - lastCall < 2000) {
    return "Bitte warte kurz, bevor du erneut klickst.";
  }
  lastCall = now;

  const prompt = `Ich bin ein Jugendlicher und fühle mich ${mood}. Gib mir einen konkreten Skill-Tipp, der mir in dieser Stimmung helfen könnte. Kurz, freundlich und machbar.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Du bist ein motivierender Coach für Jugendliche. Gib praktische, einfache Skill-Tipps in 1–2 Sätzen.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 60,
      }),
    });

    const data = await response.json();

    if (response.status === 429) {
      console.warn("Rate Limit erreicht (429).");
      return "GPT ist gerade überlastet. Versuch es in ein paar Sekunden nochmal.";
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.warn("Unvollständige Antwort von GPT:", data);
      return "Ich konnte gerade keinen Tipp finden. Versuch es später nochmal.";
    }

    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error("Fehler beim Abrufen des GPT-Tipps:", err);
    return "Es gab ein technisches Problem mit dem Skill-Tipp.";
  }
}
