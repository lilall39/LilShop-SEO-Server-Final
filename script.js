 // -------------------------------
// 🌟 Outil SEO Lil-Shop – Frontend
// -------------------------------

// 🧠 Génération de texte classique
async function genererMeta() {
  const nomProduit = document.getElementById("nomProduit").value.trim();
  const descProduit = document.getElementById("descProduit").value.trim();
  const resultMeta = document.getElementById("resultMeta");

  if (!nomProduit) {
    resultMeta.innerHTML = "⚠️ Veuillez saisir un nom de produit.";
    return;
  }

  try {
    resultMeta.innerHTML = "⏳ Génération en cours...";

    const response = await fetch("/api/generate-meta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomProduit, descProduit })
    });

    const data = await response.json();

    if (!data || data.error) {
      throw new Error(data?.error || "Erreur inconnue.");
    }

    resultMeta.innerHTML = `
      <strong>Titre SEO :</strong> ${data.titreSEO}<br><br>
      <strong>Meta Description :</strong> ${data.metaDescription}<br><br>
      <strong>Hashtags Vinted :</strong> ${data.hashtagsVinted}<br><br>
      <strong>Hashtags Shopify :</strong> ${data.hashtagsShopify}
    `;

    document.getElementById("copyButtons").style.display = "block";
  } catch (error) {
    resultMeta.innerHTML = `⚠️ Erreur : ${error.message}`;
  }
}

// 🖼️ Analyse d’image
async function analyserImage() {
  const fileInput = document.getElementById("imageInput");
  const resultImage = document.getElementById("resultImage");
  const file = fileInput.files[0];

  if (!file) {
    resultImage.innerHTML = "⚠️ Choisissez d’abord une image.";
    return;
  }

  resultImage.innerHTML = "🔍 Analyse de l’image en cours...";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!data || data.error) {
      throw new Error(data?.error || "Aucun résultat reçu.");
    }

    resultImage.innerHTML = `
      <strong>Titre SEO :</strong> ${data.titreSEO}<br><br>
      <strong>Meta Description :</strong> ${data.metaDescription}<br><br>
      <strong>Hashtags Vinted :</strong> ${data.hashtagsVinted}<br><br>
      <strong>Hashtags Shopify :</strong> ${data.hashtagsShopify}
    `;
  } catch (error) {
    resultImage.innerHTML = `⚠️ Erreur : ${error.message}`;
  }
}

// 🔁 Bouton Recommencer
function recommencer() {
  document.getElementById("nomProduit").value = "";
  document.getElementById("descProduit").value = "";
  document.getElementById("resultMeta").innerHTML = "";
  document.getElementById("copyButtons").style.display = "none";
}

// 📋 Fonctions de copie
function copierTitre() {
  copierTexte("Titre SEO");
}
function copierMeta() {
  copierTexte("Meta Description");
}
function copierHashtagsVinted() {
  copierTexte("Hashtags Vinted");
}
function copierHashtagsShopify() {
  copierTexte("Hashtags Shopify");
}

function copierTexte(texte) {
  navigator.clipboard.writeText(texte);
  alert(`✅ ${texte} copié !`);
}





