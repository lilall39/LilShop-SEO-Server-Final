 export const config = {
  runtime: "edge",
};

// ✅ Lil-Shop SEO – Version améliorée avec détection de l’état
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
Ton objectif : produire des textes parfaits pour Google Search, clairs, naturels et vendeurs.

🧠 Règles :
- Titre SEO : < 110 caractères
- Meta description : 140–160 caractères
- Inclure la marque, la matière, le style, l’état, et les mots-clés principaux
- Déterminer intelligemment l’état :
   • Si le texte contient "neuf" ou "neuve" → écrire "article neuf"
   • Si le texte contient "TBE", "seconde main", "occasion" → écrire "seconde main TBE"
   • Si le texte contient "vintage" → écrire "vintage"
   • Sinon, ne pas ajouter de mention d’état
- Ne jamais tout mettre en majuscules
- Ton : professionnel, clair, fluide, inspiré du style des boutiques de mode
- Format de sortie obligatoire :
**Titre SEO :** ...
**Meta Description :** ...
**Hashtags Vinted :** ...
**Hashtags Shopify :** ...`,
          },
          {
            role: "user",
            content: `Nom du produit : ${nomProduit}
Description : ${descProduit}

Génère :
1️⃣ Un titre SEO optimisé pour Google (< 110 caractères)
2️⃣ Une meta description de 140–160 caractères
3️⃣ 40 hashtags Vinted vendeurs et pertinents
4️⃣ 40 hashtags Shopify séparés par des virgules

Inclure systématiquement ces hashtags fixes : 
#${nomProduit.replace(/\s+/g, '').toLowerCase()}, #pascher, #tendance, #mode, #femme, #fille, #homme, #enfant, #jeune, #cadeau, #idéeCadeau, #fête, #cadeauFemme, #cadeauArtisanal, #italie, #espagne, #portugal, #angleterre, #suisse, #belgique, #paysBas.`,
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


