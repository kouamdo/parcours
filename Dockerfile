FROM node:17.0-bullseye-slim as build

RUN mkdir /app
WORKDIR /app

RUN npm install -g @angular/cli@13

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build --prod

FROM nginx:1.25-alpine

COPY --from=build /app/dist /usr/share/nginx/html
