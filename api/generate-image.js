export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "Aucune image reçue par le serveur." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Décris l’image brièvement en français." },
              { type: "image_url", image_url: `data:image/jpeg;base64,${imageBase64}` },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    // 🔍 Affiche la réponse complète (pour debug)
    return new Response(JSON.stringify(data, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // 🔥 Capture toute erreur et l’affiche clairement
    return new Response(
      JSON.stringify({ message: "Erreur côté serveur", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

