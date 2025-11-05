export const config = { runtime: "edge" };

// ✅ Lil-Shop – génération SEO depuis une image
export default async function handler(req) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Aucune image reçue" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyse cette image de produit et génère :
1️⃣ Un titre SEO de moins de 110 caractères,
2️⃣ Une meta description de 140–160 caractères,
3️⃣ 40 hashtags Vinted (#...),
4️⃣ 40 hashtags Shopify (séparés par virgules).`,
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
    const result = data?.choices?.[0]?.message?.content || "Aucun résultat.";

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
