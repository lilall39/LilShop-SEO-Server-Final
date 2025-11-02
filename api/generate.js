export default async function handler(req, res) {
  try {
    const { nomProduit, descProduit } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: "Tu es un expert SEO Shopify et Vinted. Réponds toujours dans ce format clair : **Titre SEO :** ..., **Meta Description :** ..., **Hashtags Vinted :** ..., **Hashtags Shopify :** ...",
          },
          {
            role: "user",
            content: `Produit : ${nomProduit}\nDescription : ${descProduit}`,
          },
        ],
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Erreur API :", error);
    return res.status(500).json({ error: error.message });
  }
}
