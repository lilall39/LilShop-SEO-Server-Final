 // 🟢 Indexation Google améliorée  
async function pingGoogle() {
  const sitemapUrl = document.getElementById("sitemapUrl").value.trim();
  const resultPing = document.getElementById("resultPing");

  if (!sitemapUrl.startsWith("http")) {
    resultPing.innerHTML = "⚠️ Veuillez entrer une URL valide (commençant par http ou https).";
    return;
  }

  resultPing.innerHTML = "⏳ Envoi du sitemap à Google...";
  try {
    const response = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    if (response.ok) {
      resultPing.innerHTML = `
        ✅ <b>Sitemap soumis à Google avec succès !</b><br>
        🕓 Le traitement peut prendre quelques heures.<br><br>
        🔎 <a href="https://search.google.com/search-console/sitemaps" target="_blank">
          Vérifier dans Google Search Console
        </a>
      `;
    } else {
      resultPing.innerHTML = "⚠️ Erreur lors de la soumission à Google.";
    }

    // 🌀 Soumission aussi à Bing pour un meilleur SEO
    await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
  } catch (error) {
    resultPing.innerHTML = "❌ Une erreur s'est produite : " + error.message;
  }
}


// 🟣 Génération SEO + Hashtags
async function genererMeta() {
  const nomProduit = document.getElementById("nomProduit").value.trim();
  const descProduit = document.getElementById("descProduit").value.trim();
  const resultMeta = document.getElementById("resultMeta");
  const hashtagsVinted = document.getElementById("hashtagsVinted");
  const hashtagsShopify = document.getElementById("hashtagsShopify");

  resultMeta.textContent = "⏳ Génération en cours...";
  hashtagsVinted.textContent = "";
  hashtagsShopify.textContent = "";

  try {
    // ✅ Appel à ton backend hébergé sur Vercel
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomProduit, descProduit })
    });

    const data = await response.json();

    // 🧠 Vérifie que le format est correct
    if (!data || typeof data.result !== "string") {
      console.log("Réponse serveur :", data);
      throw new Error("Le serveur a répondu, mais le format est inattendu.");
    }

    const texte = data.result;

    // 🧩 Extraction des sections principales
    const titre = texte.match(/\*\*Titre SEO\s*:\*\*\s*(.+)/i)?.[1] || "Titre non trouvé";
    const meta = texte.match(/\*\*Meta Description\s*:\*\*\s*(.+)/i)?.[1] || "Meta description non trouvée";
    let vinted = texte.match(/\*\*Hashtags Vinted\s*:\*\*\s*([\s\S]+?)\n\*\*Hashtags Shopify/i)?.[1]?.trim() || "";
    let shopify = texte.match(/\*\*Hashtags Shopify\s*:\*\*\s*([\s\S]+)/i)?.[1]?.trim() || "";

    // 🧱 Vérification du nombre de hashtags Vinted
let hashtagsArray = vinted.match(/#[\wàâçéèêëîïôöùûüÿ\-]+/gi) || [];

// 🧩 Hashtags fixes (toujours présents)
const fixedTagsVinted = [
  "#italie", "#espagne", "#portugal", "#angleterre", "#suisse", "#belgique", "#paysbas",
  "#pascher", "#tendance", "#mode", "#femme", "#homme", "#enfant", "#jeune",
  "#cadeau", "#idée", "#fête", "#cadeaufemme", "#cadeauartisanal"
];

// ✅ Ajoute les hashtags fixes s’ils manquent
fixedTagsVinted.forEach(tag => {
  if (!hashtagsArray.includes(tag)) hashtagsArray.push(tag);
});

// Complète jusqu’à 40 hashtags maximum
while (hashtagsArray.length < 40) {
  const next = fixedTagsVinted[hashtagsArray.length % fixedTagsVinted.length];
  hashtagsArray.push(next);
}

// Nettoyage final et recomposition
hashtagsArray = [...new Set(hashtagsArray)];
vinted = hashtagsArray.slice(0, 40).join(" ");

 
// 🟢 Indexation Google améliorée  
async function pingGoogle() {
  const sitemapUrl = document.getElementById("sitemapUrl").value.trim();
  const resultPing = document.getElementById("resultPing");

  if (!sitemapUrl.startsWith("http")) {
    resultPing.innerHTML = "⚠️ Veuillez entrer une URL valide (commençant par http ou https).";
    return;
  }

  resultPing.innerHTML = "⏳ Envoi du sitemap à Google...";
  try {
    const response = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    if (response.ok) {
      resultPing.innerHTML = `
        ✅ <b>Sitemap soumis à Google avec succès !</b><br>
        🕓 Le traitement peut prendre quelques heures.<br><br>
        🔎 <a href="https://search.google.com/search-console/sitemaps" target="_blank">
          Vérifier dans Google Search Console
        </a>
      `;
    } else {
      resultPing.innerHTML = "⚠️ Erreur lors de la soumission à Google.";
    }

    // 🌀 Soumission aussi à Bing pour un meilleur SEO
    await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
  } catch (error) {
    resultPing.innerHTML = "❌ Une erreur s'est produite : " + error.message;
  }
}


// 🟣 Génération SEO + Hashtags
async function genererMeta() {
  const nomProduit = document.getElementById("nomProduit").value.trim();
  const descProduit = document.getElementById("descProduit").value.trim();
  const resultMeta = document.getElementById("resultMeta");
  const hashtagsVinted = document.getElementById("hashtagsVinted");
  const hashtagsShopify = document.getElementById("hashtagsShopify");

  resultMeta.textContent = "⏳ Génération en cours...";
  hashtagsVinted.textContent = "";
  hashtagsShopify.textContent = "";

  try {
    // ✅ Appel à ton backend hébergé sur Vercel
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomProduit, descProduit })
    });

    const data = await response.json();

    // 🧠 Vérifie que le format est correct
    if (!data || typeof data.result !== "string") {
      console.log("Réponse serveur :", data);
      throw new Error("Le serveur a répondu, mais le format est inattendu.");
    }

    const texte = data.result;

    // 🧩 Extraction des sections principales
    const titre = texte.match(/\*\*Titre SEO\s*:\*\*\s*(.+)/i)?.[1] || "Titre non trouvé";
    const meta = texte.match(/\*\*Meta Description\s*:\*\*\s*(.+)/i)?.[1] || "Meta description non trouvée";
    let vinted = texte.match(/\*\*Hashtags Vinted\s*:\*\*\s*([\s\S]+?)\n\*\*Hashtags Shopify/i)?.[1]?.trim() || "";
    let shopify = texte.match(/\*\*Hashtags Shopify\s*:\*\*\s*([\s\S]+)/i)?.[1]?.trim() || "";

    // 🧱 Vérification du nombre de hashtags Vinted
    let hashtagsArray = vinted.match(/#[\wàâçéèêëîïôöùûüÿ\-]+/gi) || [];

    // 🧩 Hashtags fixes (toujours présents)
    const fixedTags = [
      "#italie", "#espagne", "#portugal", "#angleterre", "#suisse",
      "#belgique", "#paysbas", "#pascher", "#tendance", "#mode",
      "#femme", "#homme", "#enfant", "#jeune", "#cadeau",
      "#idée", "#fête", "#cadeaufemme", "#cadeauartisanal"
    ];

    // ✅ Ajoute les hashtags fixes s’ils manquent
    hashtagsArray = [...new Set([...hashtagsArray, ...fixedTags])];

    // Complète jusqu’à 40
    while (hashtagsArray.length < 40) {
      const next = fixedTags[hashtagsArray.length % fixedTags.length];
      hashtagsArray.push(next);
    }

    // Nettoyage final
    hashtagsArray = [...new Set(hashtagsArray)];
    vinted = hashtagsArray.slice(0, 40).join(" ");

    // 🛍️ Shopify : assurer au moins 40 mots-clés
    let shopifyArray = shopify
      .replace(/#/g, "") // enlève les #
      .split(/,|\s+/)
      .map(t => t.trim())
      .filter(Boolean);

    // Ajoute les versions sans dièse
    const fixedShopify = fixedTags.map(tag => tag.replace("#", ""));
    shopifyArray = [...new Set([...shopifyArray, ...fixedShopify])];

    while (shopifyArray.length < 40) {
      const next = fixedShopify[shopifyArray.length % fixedShopify.length];
      shopifyArray.push(next);
    }

    shopify = shopifyArray.slice(0, 40).join(", ");

    // ✅ Affichage final
    resultMeta.innerHTML = `<b>Titre SEO :</b> ${titre}<br><br><b>Meta Description :</b> ${meta}`;
    hashtagsVinted.innerHTML = `<b>Hashtags Vinted :</b><br>${vinted}`;
    hashtagsShopify.innerHTML = `<b>Hashtags Shopify :</b><br>${shopify}`;

    // Boutons de copie
    document.getElementById("copyMetaBtn").style.display = "inline-block";
    document.getElementById("copyVintedBtn").style.display = "inline-block";
    document.getElementById("copyShopifyBtn").style.display = "inline-block";

  } catch (error) {
    resultMeta.textContent = "❌ Une erreur s'est produite : " + error.message;
  }
}


// 🧾 Copie individuelle
function copierMeta() {
  copierTexte(document.getElementById("resultMeta").innerText);
}
function copierVinted() {
  copierTexte(document.getElementById("hashtagsVinted").innerText);
}
function copierShopify() {
  copierTexte(document.getElementById("hashtagsShopify").innerText);
}
function copierTexte(texte) {
  navigator.clipboard.writeText(texte);
  const msg = document.getElementById("copyMsg");
  msg.textContent = "✅ Copié !";
  setTimeout(() => (msg.textContent = ""), 2000);
}


// 🔄 Recommencer
function recommencer() {
  document.getElementById("nomProduit").value = "";
  document.getElementById("descProduit").value = "";
  document.getElementById("resultMeta").textContent = "";
  document.getElementById("hashtagsVinted").textContent = "";
  document.getElementById("hashtagsShopify").textContent = "";
  document.getElementById("copyMetaBtn").style.display = "none";
  document.getElementById("copyVintedBtn").style.display = "none";
  document.getElementById("copyShopifyBtn").style.display = "none";
}
