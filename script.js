 // ✅ Lil-Shop SEO – Front-end connecté au serveur /api/generate

async function genererMeta() {
  const nomProduit = document.getElementById("nomProduit").value.trim();
  const descProduit = document.getElementById("descProduit").value.trim();
  const resultMeta = document.getElementById("resultMeta");

  if (!nomProduit || !descProduit) {
    resultMeta.textContent = "⚠️ Merci de renseigner un nom et une description.";
    return;
  }

  resultMeta.textContent = "⏳ Génération en cours...";

  try {
    // 🔄 On envoie la requête vers ton serveur Vercel (et non vers l’API OpenAI)
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomProduit, descProduit }),
    });

    const data = await response.json();

    if (data.error) {
      resultMeta.textContent = "❌ Erreur : " + data.error;
    } else {
      // 🧾 Affiche proprement le résultat généré par ton serveur
      resultMeta.textContent = data.result;
    }
  } catch (error) {
    resultMeta.textContent = "❌ Une erreur s’est produite : " + error.message;
  }
}

// 🔁 Bouton "Recommencer" : on efface tout
function recommencer() {
  document.getElementById("nomProduit").value = "";
  document.getElementById("descProduit").value = "";
  document.getElementById("resultMeta").textContent = "";
}



