
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
# ✅ Autorise les requêtes du navigateur
CORS(app, resources={r"/api/*": {"origins": "*"}})

import os
from openai import OpenAI

# ✅ Récupère la clé OpenAI depuis une variable d'environnement (sécurité)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@app.route("/api/meta", methods=["POST"])
def generer_meta():
    data = request.get_json()
    nom = data.get("nom", "")
    desc = data.get("desc", "")

    prompt = f"""
Tu es un expert en SEO et en rédaction pour une boutique de mode responsable appelée Lil-Shop.

Crée un titre SEO accrocheur et une meta description Google optimisée pour une fiche produit.
Le ton doit être doux, vendeur, naturel et adapté à une boutique de slow fashion.

Informations :
- Produit : {nom}
- Description : {desc}

Exigences :
- Le titre doit être percutant, contenir le nom du produit et évoquer style, tendance ou rareté.
- La meta description doit donner envie d’acheter, insister sur la qualité, la durabilité et l’élégance.
- Langue : français.
"""


    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    texte = response.choices[0].message.content
    return jsonify({"result": texte})


if __name__ == "__main__":
    app.run(debug=True)
