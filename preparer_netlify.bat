@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Foshet Ibda3 - preparation Netlify
echo.
echo Deplace les fichiers lourds (videos, audios, PowerPoint, images originales)
echo HORS du site, vers le dossier voisin  ..\medias_hors_site\
echo Rien n'est supprime. Le site garde seulement media\web et media\docs.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0outils_preparer_netlify.ps1"
echo.
pause
