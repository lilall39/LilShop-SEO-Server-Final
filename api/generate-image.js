export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    // 🧩 Lecture du flux binaire (FormData)
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(
        JSON.stringify({ error: "Format de requête invalide. Attendu: multipart/form-data." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🔄 Convertir le flux en texte et extraire le Base64
    const formData = await req.formData();
    const file = formData.get("image");
    if (!file) {
      return new Response(
        JSON.stringify({ error: "Aucune image reçue par le serveur." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // 🧠 Appel à l’API OpenAI
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
                text: `Décris ce produit et génère :
1. Un titre SEO de moins de 110 caractères
2. Une meta description optimisée
3. 40 hashtags Vinted (avec #)
4. 40 hashtags Shopify (séparés par des virgules)
⚠️ Ne pas inclure la phrase : "🧾Prix d’origine payé..."`,
              },
              { type: "image_url", image_url: `data:image/jpeg;base64,${base64}` },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.choices?.[0]?.message?.content) {
      throw new Error(data?.error?.message || "Réponse inattendue d’OpenAI.");
    }

    // 🧩 Parser le texte retourné
    const text = data.choices[0].message.content;
    const parsed = {
      titreSEO: extractSection(text, "Titre SEO"),
      metaDescription: extractSection(text, "Meta Description"),
      hashtagsVinted: extractSection(text, "Hashtags Vinted"),
      hashtagsShopify: extractSection(text, "Hashtags Shopify"),
    };

    return new Response(JSON.stringify(parsed), {
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

// 🔍 Fonction utilitaire simple
function extractSection(text, title) {
  const regex = new RegExp(`\\*\\*${title}\\s*:\\*\\*\\s*([^*]+)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "Non trouvé";
}


