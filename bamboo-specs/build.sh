#!/bin/bash
set -euo pipefail
REPO_NAME='mailcheck.landing'
IMAGE_NAME="hotline.nodeart.app/bit/$REPO_NAME:latest"
FIREBASE_KEY=$(cat /run/secrets/firebase_key)
if [[ "$bamboo_repository_git_branch" = "master" ]]; then
    docker build \
        --build-arg firebasekey=${FIREBASE_KEY} \
        --tag=${IMAGE_NAME} \
        .
    docker rmi ${IMAGE_NAME}
    echo "Building and deployment completed successfully" && exit 0
else
    echo "Automatic building and deployment enabled only for master branch"
fi
