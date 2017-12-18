#!/bin/sh
cd ~/webapps/map-places
git pull origin master
cd ./admin
npm i
cd ..
npm i
npm run build
forever restart map-places
forever restart map-places-admin