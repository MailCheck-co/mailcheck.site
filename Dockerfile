# syntax=docker/dockerfile:experimental

FROM node:8.15.0-stretch

ARG firebasekey

WORKDIR /opt/app

COPY package.json package-lock.json ./

COPY functions/package.json functions/package-lock.json ./functions/

RUN --mount=type=cache,target=/root/.npm npm i --silent && npm i --silent --prefix functions

COPY . .

RUN FIREBASE_TOKEN=$firebasekey NODE_ENV=production npm run deploy && rm -rf ./node_modules ./functions/node_modules
