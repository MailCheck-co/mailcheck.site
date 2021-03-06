# syntax = docker/dockerfile:1.0.2-experimental

FROM node:12.18.3-stretch AS base_stage
WORKDIR /opt/app

FROM base_stage AS credentials
ARG firebasekey
ENV FIREBASE_TOKEN="$firebasekey" \
    NODE_ENV='production'
RUN --mount=type=cache,target=/root/.npm,id=npm_cache \
    npm install -g firebase-tools@9.1.2

FROM base_stage AS landing_dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm,id=npm_cache \
    npm --prefer-offline ci --silent

FROM base_stage AS functions_dependencies
RUN --mount=type=bind,source=functions/package.json,target=functions/package.json \
    --mount=type=bind,source=functions/package-lock.json,target=functions/package-lock.json \
    --mount=type=cache,target=/root/.npm,id=npm_cache \
    npm --prefer-offline ci --silent --prefix functions

FROM credentials AS build_hosting
RUN --mount=type=bind,source=src,target=src \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=bind,source=rollup.config.js,target=rollup.config.js \
    --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
    --mount=type=bind,source=/opt/app/node_modules,target=./node_modules,from=landing_dependencies \
    --mount=type=cache,target=/root/.npm,id=npm_cache \
    npm run build

FROM credentials AS deploy_hosting
RUN --mount=type=bind,source=.firebaserc,target=.firebaserc \
    --mount=type=bind,source=firebase.json,target=firebase.json \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=bind,source=/opt/app/node_modules,target=node_modules,from=landing_dependencies \
    --mount=type=bind,source=/opt/app/dist,target=dist,from=build_hosting \
    npm run deploy_hosting:prod

FROM credentials AS deploy_functions
WORKDIR /opt/app/functions
RUN --mount=type=bind,source=.firebaserc,target=/opt/app/.firebaserc \
    --mount=type=bind,source=firebase.json,target=/opt/app/firebase.json \
    --mount=type=bind,source=functions/index.js,target=index.js \
    --mount=type=bind,source=functions/package.json,target=package.json \
    --mount=type=bind,source=functions/package-lock.json,target=package-lock.json \
    --mount=type=bind,source=functions/checkmail.js,target=checkmail.js \
    --mount=type=bind,source=functions/sendmail.js,target=sendmail.js \
    --mount=type=bind,source=/opt/app/functions/node_modules,target=node_modules,from=functions_dependencies \
    npm run deploy_functions:prod

FROM base_stage AS bind_stages
RUN --mount=target=.,from=deploy_functions \
    --mount=target=.,from=deploy_hosting

LABEL com.description="Landing" \
      com.release-date="25.03.2019" \
      com.type="Build and Deploy" \
      com.is-production="true" \
      com.version="latest" \
      com.image-name="mailcheck/land" \
      com.registry="hotline.nodeart.app"
