@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Foshet Ibda3 - envoi vers GitHub
where git >nul 2>nul || (echo Git n'est pas installe : https://git-scm.com/download/win & pause & exit /b 1)
if not exist ".git" (
  git init
  git branch -M main
  git remote add origin https://github.com/marouajaoua22-ship-it/foshet-ibda3.git
)
git add -A
git commit -m "Site Foshet Ibda3 : mise a jour depuis le PC"
git pull --rebase origin main 2>nul
git push -u origin main
echo.
echo Termine. Verifiez : https://github.com/marouajaoua22-ship-it/foshet-ibda3
pause
