 // Fonction appelée quand on clique sur "Analyser l’image"
async function analyserImage() {
  const input = document.querySelector("#imageInput");
  const message = document.querySelector("#resultMeta");
  message.textContent = "Analyse en cours...";

  if (!input.files.length) {
    message.textContent = "❌ Choisis d’abord une image !";
    return;
  }

  const file = input.files[0];
  const base64 = await toBase64(file);

  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64.split(",")[1] }),
    });

    const data = await response.json();

    if (data.error) {
      message.textContent = "⚠️ Erreur : " + data.error;
      console.log("Réponse erreur :", data);
    } else {
      message.textContent = "✅ Résultat :\n\n" + data.result;
    }
  } catch (err) {
    message.textContent = "❌ Erreur réseau : " + err.message;
  }
}

// Convertir un fichier image en base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}




