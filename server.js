import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// 📡 Route pour soumettre ton sitemap à Google
app.get("/ping-google", async (req, res) => {
  const { sitemap } = req.query;
  if (!sitemap) return res.status(400).send("❌ URL sitemap manquante");

  try {
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap)}`;
    const response = await fetch(pingUrl);
    res.send(response.ok ? "✅ Sitemap soumis à Google avec succès !" : "⚠️ Erreur Google.");
  } catch (error) {
    res.status(500).send("❌ Erreur : " + error.message);
  }
});

// 🚀 Lancement du serveur
app.listen(3000, () => console.log("✅ Serveur Lil-Shop SEO lancé sur le port 3000"));
