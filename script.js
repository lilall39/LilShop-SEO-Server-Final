 // ✅ Lil-Shop SEO – Front-end connecté au serveur /api/generate
async function genererMeta() {
  const nomProduit = document.getElementById("nomProduit").value.trim();
  const descProduit = document.getElementById("descProduit").value.trim();
  const resultMeta = document.getElementById("resultMeta");
  const copyButtons = document.getElementById("copyButtons");

  if (!nomProduit || !descProduit) {
    resultMeta.textContent = "⚠️ Merci de renseigner un nom et une description.";
    copyButtons.style.display = "none";
    return;
  }

  resultMeta.textContent = "⏳ Génération en cours...";
  copyButtons.style.display = "none";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomProduit, descProduit }),
    });

    const data = await response.json();

    if (data.error) {
      resultMeta.textContent = "❌ Erreur : " + data.error;
    } else {
      resultMeta.textContent = data.result;
      copyButtons.style.display = "block";
    }
  } catch (error) {
    resultMeta.textContent = "❌ Une erreur s’est produite : " + error.message;
    copyButtons.style.display = "none";
  }
}

function recommencer() {
  document.getElementById("nomProduit").value = "";
  document.getElementById("descProduit").value = "";
  document.getElementById("resultMeta").textContent = "";
  document.getElementById("copyButtons").style.display = "none";
}

// ✂️ Fonctions de copie
function copierTexte(motif) {
  const texte = document.getElementById("resultMeta").textContent;
  const regex = new RegExp(`${motif}\\s*:?\\s*(.*?)\\s*(?=(\\n[A-Z]|$))`, "is");
  const match = texte.match(regex);
  if (match && match[1]) {
    navigator.clipboard.writeText(match[1].trim());
    alert(`✅ ${motif} copié !`);
  } else {
    alert(`❌ Impossible de copier ${motif}.`);
  }
}

function copierTitre() { copierTexte("Titre SEO"); }
function copierMeta() { copierTexte("Meta Description"); }
function copierHashtagsVinted() { copierTexte("Hashtags Vinted"); }
function copierHashtagsShopify() { copierTexte("Hashtags Shopify"); }

// ✅ Fonction d'analyse d'image
async function analyserImage() {
  const input = document.getElementById("imageInput");
  const result = document.getElementById("resultImage");

  if (!input || !input.files.length) {
    result.textContent = "❌ Merci de choisir une image.";
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result.split(",")[1];
    result.textContent = "⏳ Analyse en cours...";
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Image }),
      });
      const data = await response.json();
      result.textContent = data.result || "⚠️ Aucun résultat reçu.";
    } catch (err) {
      result.textContent = "❌ Erreur d’analyse : " + err.message;
    }
  };

  reader.readAsDataURL(input.files[0]);
}



