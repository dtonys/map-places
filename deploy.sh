#!/bin/sh

cd ~/webapps/map-places
git pull origin master
npm i
npm run build
npm run start
