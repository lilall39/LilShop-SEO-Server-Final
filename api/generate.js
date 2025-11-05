 export const config = {
  runtime: "edge",
};

// ✅ Lil-Shop SEO – Version finale logique (neuf / TBE / vintage)
export default async function handler(req) {
  try {
    const { nomProduit, descProduit } = await req.json();

    if (!nomProduit || !descProduit) {
      return new Response(
        JSON.stringify({ error: "Champs manquants" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🧠 Détection locale intelligente
    const descLower = descProduit.toLowerCase();
    let etat = "";
    let forcerNeuf = false;
    let forcerTBE = false;
    let forcerVintage = false;

    if (descLower.includes("neuf") || descLower.includes("neuve")) {
      etat = "article neuf";
      forcerNeuf = true;
    } else if (
      descLower.includes("tbe") ||
      descLower.includes("seconde main") ||
      descLower.includes("occasion")
    ) {
      etat = "seconde main TBE";
      forcerTBE = true;
    } else if (descLower.includes("vintage")) {
      etat = "vintage";
      forcerVintage = true;
    }

    // 🧩 Règle : si "neuf" est présent, on interdit toute mention de "seconde main"
    const contrainteEtat =
      forcerNeuf
        ? "Le titre et la description doivent clairement indiquer que le produit est neuf. Interdiction absolue de mentionner 'seconde main' ou 'TBE'."
        : forcerTBE
        ? "Le titre doit inclure 'seconde main TBE'."
        : forcerVintage
        ? "Le titre doit inclure le mot 'vintage'."
        : "Ne pas indiquer d’état si non précisé.";

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
Ton objectif : produire des textes optimisés pour Google, clairs, vendeurs, et adaptés à l’état du produit.

🧠 Règles :
- Titre SEO : < 110 caractères
- Meta description : 140–160 caractères
- Inclure la marque, la matière, la couleur, le style, et l’état du produit
- Ton : professionnel, fluide, et vendeur
- Ne jamais tout écrire en majuscules
- Sortie formatée ainsi :
**Titre SEO :** ...
**Meta Description :** ...
**Hashtags Vinted :** ...
**Hashtags Shopify :** ...`,
          },
          {
            role: "user",
            content: `
Nom du produit : ${nomProduit}
Description : ${descProduit}
État détecté : ${etat || "non précisé"}
${contrainteEtat}

Génère :
1️⃣ Un titre SEO optimisé Google (< 110 caractères)
2️⃣ Une meta description de 140–160 caractères
3️⃣ 40 hashtags Vinted vendeurs
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




