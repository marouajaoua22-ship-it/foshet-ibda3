# -*- coding: utf-8 -*-
"""
Insère les liens Google Drive dans le site, en une seule fois.

1. Envoyez chaque vidéo / audio listé dans liens_drive.csv sur Google Drive
   (partage : « Tous les utilisateurs disposant du lien — Lecteur »).
2. Collez le lien de partage dans la colonne « lien_drive » (n'importe quel
   format : /view, /edit, open?id=…, ou seulement l'identifiant).
3. Lancez :  python inserer_liens_drive.py

Chaque emplacement https://drive.google.com/file/d/FILE_ID/preview#<fichier>
des fichiers content/*.json est remplacé par
https://drive.google.com/file/d/<ID>/preview  (lecteur intégré Drive),
puis content/fallback.js est régénéré pour la version « double-clic ».
Les lignes sans lien sont ignorées (l'emplacement reste « en attente »).
"""
import csv
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(ROOT, "liens_drive.csv")
FILES = ["settings", "pedagogie", "aventure", "plastique", "musique", "mediatheque"]
PENDING = "https://drive.google.com/file/d/FILE_ID/preview#"


def drive_id(link):
    link = (link or "").strip()
    if not link:
        return None
    for pat in (r"/file/d/([\w-]{10,})", r"/d/([\w-]{10,})", r"[?&]id=([\w-]{10,})"):
        m = re.search(pat, link)
        if m:
            return m.group(1)
    if re.fullmatch(r"[\w-]{20,}", link):
        return link
    return None


def main():
    mapping, bad = {}, []
    with open(CSV_PATH, encoding="utf-8-sig", newline="") as f:
        sample = f.read(2048)
        f.seek(0)
        delim = ";" if sample.count(";") >= sample.count(",") else ","
        for row in csv.DictReader(f, delimiter=delim):
            fn = (row.get("fichier_local") or "").strip()
            link = (row.get("lien_drive") or "").strip()
            if not fn or not link:
                continue
            fid = drive_id(link)
            if not fid:
                bad.append((fn, link))
                continue
            suffix = "#audio" if fn.lower().endswith((".mp3", ".m4a", ".wav")) else ""
            mapping[PENDING + fn] = "https://drive.google.com/file/d/%s/preview%s" % (fid, suffix)

    replaced = 0

    def walk(o):
        nonlocal replaced
        if isinstance(o, dict):
            for k, v in o.items():
                if isinstance(v, str) and v in mapping:
                    o[k] = mapping[v]
                    replaced += 1
                else:
                    walk(v)
        elif isinstance(o, list):
            for x in o:
                walk(x)

    pending_left = 0
    for name in FILES:
        path = os.path.join(ROOT, "content", name + ".json")
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        walk(data)
        text = json.dumps(data, ensure_ascii=False, indent=2)
        pending_left += text.count("FILE_ID")
        with open(path, "w", encoding="utf-8") as f:
            f.write(text + "\n")

    print("Liens insérés :", replaced)
    print("Emplacements encore en attente :", pending_left)
    for fn, link in bad:
        print("  ! lien non reconnu pour", fn, "->", link)

    subprocess.run([sys.executable, os.path.join(ROOT, "mettre_a_jour_hors_ligne.py")], check=False)


if __name__ == "__main__":
    main()
