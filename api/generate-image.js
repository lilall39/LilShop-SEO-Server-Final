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

    // 🧠 Utilise le modèle complet gpt-4o pour la vision
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
            role: "system",
            content: "Tu es un expert en mode et SEO e-commerce.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyse cette image de produit et rédige : 1️⃣ un titre SEO court (<110 caractères), 2️⃣ une meta description (140-160 caractères), 3️⃣ 40 hashtags Vinted (#...), et 4️⃣ 40 hashtags Shopify (séparés par virgules).",
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

    // 🧾 Affiche ce que l’API a réellement renvoyé (utile si erreur)
    if (!data.choices || !data.choices[0]) {
      return new Response(
        JSON.stringify({
          error: "Réponse vide d’OpenAI",
          details: data,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = data.choices[0].message.content;
    return new Response(JSON.stringify({ result }), {
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

