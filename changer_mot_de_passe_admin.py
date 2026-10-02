# -*- coding: utf-8 -*-
"""
Change le mot de passe de la page /admin.
Usage :  python changer_mot_de_passe_admin.py
Puis republiez le dossier sur Netlify (glisser-déposer).
"""
import getpass
import hashlib
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(ROOT, "admin", "index.html")
SALT = "foshet-ibda3:"

pw = getpass.getpass("Nouveau mot de passe : ")
if len(pw) < 6:
    raise SystemExit("Mot de passe trop court (6 caractères minimum).")
if pw != getpass.getpass("Confirmer : "):
    raise SystemExit("Les deux saisies ne correspondent pas.")

digest = hashlib.sha256((SALT + pw).encode("utf-8")).hexdigest()
with open(PATH, encoding="utf-8") as f:
    html = f.read()
html, n = re.subn(r'var PASSWORD_HASH = "[0-9a-f]{64}";', 'var PASSWORD_HASH = "%s";' % digest, html)
if n != 1:
    raise SystemExit("PASSWORD_HASH introuvable dans admin/index.html")
with open(PATH, "w", encoding="utf-8") as f:
    f.write(html)
print("OK : mot de passe mis à jour dans admin/index.html")
