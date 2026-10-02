# -*- coding: utf-8 -*-
"""
Régénère content/fallback.js à partir des fichiers content/*.json.

Pourquoi ? Quand on ouvre index.html par double-clic (file://), le navigateur
interdit la lecture des fichiers JSON : le site utilise alors cette copie
embarquée. Après des modifications faites dans l'admin (Decap CMS),
lancez ce script pour que la version « double-clic » soit aussi à jour.

Usage :  python mettre_a_jour_hors_ligne.py
"""
import json
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
FILES = ["settings", "pedagogie", "aventure", "plastique", "musique", "mediatheque"]

data = {}
for name in FILES:
    path = os.path.join(ROOT, "content", name + ".json")
    with open(path, encoding="utf-8") as f:
        data[name] = json.load(f)

out = os.path.join(ROOT, "content", "fallback.js")
with open(out, "w", encoding="utf-8") as f:
    f.write("/* Fichier généré automatiquement par mettre_a_jour_hors_ligne.py — ne pas modifier à la main. */\n")
    f.write("window.__FOSHET_FALLBACK__ = ")
    json.dump(data, f, ensure_ascii=False, indent=1)
    f.write(";\n")

print("OK :", out)
