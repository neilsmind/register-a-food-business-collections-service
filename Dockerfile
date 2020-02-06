# specify the node base image with your desired version node:<version>
FROM node:8.9.4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm config set registry http://registry.npmjs.org/ && \
    npm install --production --verbose --maxsockets=10

EXPOSE 4001