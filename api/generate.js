 export const config = {
  runtime: "edge",
};

// ✅ Lil-Shop SEO – Version finale avec détection automatique locale de l’état
export default async function handler(req) {
  try {
    const { nomProduit, descProduit } = await req.json();

    if (!nomProduit || !descProduit) {
      return new Response(
        JSON.stringify({ error: "Champs manquants" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🧠 Détection intelligente de l’état du produit
    const descLower = descProduit.toLowerCase();
    let etat = "";

    if (descLower.includes("neuf") || descLower.includes("neuve")) {
      etat = "article neuf";
    } else if (
      descLower.includes("tbe") ||
      descLower.includes("seconde main") ||
      descLower.includes("occasion")
    ) {
      etat = "seconde main TBE";
    } else if (descLower.includes("vintage")) {
      etat = "vintage";
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
- Inclure la marque, la matière, le style, la couleur, et l’état du produit (si fourni)
- Ton : professionnel, clair, fluide, inspiré du style des boutiques de mode
- Ne jamais tout écrire en majuscules
- Format de sortie obligatoire :
**Titre SEO :** ...
**Meta Description :** ...
**Hashtags Vinted :** ...
**Hashtags Shopify :** ...`,
          },
          {
            role: "user",
            content: `Nom du produit : ${nomProduit}
Description détaillée : ${descProduit}
État détecté : ${etat || "non précisé"}

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



