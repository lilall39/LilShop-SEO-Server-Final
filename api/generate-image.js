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
              {
                type: "text",
                text: "Décris précisément le produit visible sur cette image en une phrase courte. Si tu ne vois rien ou si l’image est vide, dis-le clairement.",
              },
              {
                type: "image_url",
                image_url: `data:image/jpeg;base64,${imageBase64}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    // 💬 Retour complet pour comprendre ce qu'OpenAI répond
    return new Response(JSON.stringify(data, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

