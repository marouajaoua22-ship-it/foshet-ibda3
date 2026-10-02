@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Foshet Ibda3 - site local
echo Site : http://localhost:8080/   (fermez cette fenetre pour arreter)
set PY=python
where python >nul 2>nul || set PY=py
start "" http://localhost:8080/
%PY% -m http.server 8080
