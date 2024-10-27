FROM ubuntu:focal as path

RUN apt update && apt install -y git && git clone https://github.com/NotePhil/parcours.git /project

FROM node:17.0-bullseye-slim

RUN mkdir /app

WORKDIR /app

RUN npm install -g @angular/cli@13

COPY --from=path /project/package.json /project/package-lock.json ./

RUN npm ci

COPY --from=path /project .

RUN npm run build --prod

WORKDIR /app/dist/clinique

RUN npm install -g angular-http-server

ENTRYPOINT ["angular-http-server"]
