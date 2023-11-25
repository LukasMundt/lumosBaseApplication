# Lumos Baseapplication
<p align="center">
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/lukasmundt/lumosbaseapplication" alt="Latest Stable Version"></a>
</p>

## Installation auf Cloudron
1. Installiere eine neue LAMP-App auf deiner Cloudron-Instanz. Räume der App beim Arbeitsspeicher ein Limit von 640MiB ein.
2. Leere mit dem Filemanager den Ordner public.
3. Öffne das Terminal und führe die folgenden Befehle aus:
```bash
cd ../data
composer create-project lukasmundt/lumosbaseapplication /public
su - www-data
cd public
export PATH="/usr/local/node-18.18.0/bin:$PATH"
npm i
npm run build
```
4. Öffne im Filemanager die Datei `apache/app.conf`. Ändere den Pfad so, dass der `public`-Ordner nach Außen hin sichtbar ist.
5. Starte die Instanz neu.