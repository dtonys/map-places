#!/bin/sh
cd ~/webapps/map-places
git pull origin master
cd ./admin
yarn
cd ..
yarn
npm run build
forever restart map-places
forever restart map-places-admin