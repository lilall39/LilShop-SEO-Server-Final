 export const config = {
  runtime: "edge",
};

// ✅ Version compatible avec Vercel Edge Functions
export default async function handler(req) {
  try {
    const { nomProduit, descProduit } = await req.json();

    if (!nomProduit || !descProduit) {
      return new Response(
        JSON.stringify({ error: "Champs manquants" }),
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
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "Tu es un expert SEO Shopify et Vinted. Réponds toujours dans ce format clair : **Titre SEO :** ... **Meta Description :** ... **Hashtags Vinted :** ... **Hashtags Shopify :** ...",
          },
          {
            role: "user",
            content: `Produit : ${nomProduit}\nDescription : ${descProduit}\nGénère :\n1. Un titre SEO court\n2. Une meta description optimisée\n3. 40 hashtags Vinted\n4. 40 hashtags Shopify`,
          },
        ],
      }),
    });

    const result = await response.json();

    if (!result.choices || !result.choices[0].message) {
      throw new Error("Réponse inattendue de l’API OpenAI");
    }

    return new Response(
      JSON.stringify({ result: result.choices[0].message.content }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erreur API :", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


