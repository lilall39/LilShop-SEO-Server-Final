export const config = {
  runtime: "edge",
};

// ✅ Version finale améliorée Lil-Shop SEO (Edge Function)
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
            content: `Tu es un expert SEO e-commerce pour Shopify et Vinted. 
Ton objectif est de produire des textes parfaits pour Google Search, clairs, naturels et vendeurs.
Tu respectes toujours ces contraintes :
- Titre SEO : moins de 110 caractères
- Meta description : entre 140 et 160 caractères
- Ton : professionnel mais accessible, inspiré du style des grandes boutiques de mode
- Inclure la marque, la matière, le style, l’état (ex : seconde main TBE), et les mots clés principaux.
- Ne jamais écrire un titre tout en majuscules.
- Ne jamais répéter "Produit :" ou "Description :" dans la sortie.
- Toujours formater ainsi : 
**Titre SEO :** ...
**Meta Description :** ...
**Hashtags Vinted :** ...
**Hashtags Shopify :** ...`,
          },
          {
            role: "user",
            content: `Nom du produit : ${nomProduit}
Courte description : ${descProduit}

Génère :
1️⃣ Un titre SEO optimisé pour Google (moins de 110 caractères)
2️⃣ Une meta description de 140–160 caractères
3️⃣ 40 hashtags Vinted vendeurs et pertinents
4️⃣ 40 hashtags Shopify séparés par des virgules

⚠️ Dans les hashtags, inclure systématiquement :
#${nomProduit.replace(/\s+/g, '').toLowerCase()}, #pascher, #tendance, #mode, #femme, #fille, #homme, #enfant, #pascher, #jeune, #cadeau, #idéeCadeau, #fête, #cadeauFemme, #cadeauArtisanal, #italie, #espagne, #portugal, #angleterre, #suisse, #belgique, #paysBas.`,
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

