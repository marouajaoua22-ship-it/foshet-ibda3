@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Foshet Ibda3 - administration (Decap CMS)
echo 1) Serveur Decap (ecrit dans content\*.json) : 2e fenetre "Decap server"
start "Decap server" cmd /k npx decap-server
echo 2) Admin : http://localhost:8080/admin/   (fermez cette fenetre pour arreter)
set PY=python
where python >nul 2>nul || set PY=py
timeout /t 3 >nul
start "" http://localhost:8080/admin/
%PY% -m http.server 8080
echo.
echo Mise a jour de la version hors ligne (double-clic sur index.html)...
%PY% mettre_a_jour_hors_ligne.py
pause
