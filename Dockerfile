# specify the node base image with your desired version node:<version>
FROM node:8.9.4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install

EXPOSE 4001