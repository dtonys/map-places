#!/bin/sh
cd ~/webapps/map-places
git pull origin master
cd ./admin
yarn
cd ..
yarn
npm run build
npm run start
