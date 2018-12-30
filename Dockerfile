FROM node:8

WORKDIR /opt/app

COPY package.json ./
COPY functions/package.json ./functions/
RUN npm i --silent && npm i --silent --prefix functions
COPY . .

ARG firebasekey
RUN FIREBASE_TOKEN=$firebasekey NODE_ENV=production npm run deploy && rm -rf ./node_modules ./functions/node_modules
