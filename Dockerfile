FROM node:alpine AS build

WORKDIR /usr/app
COPY ./ /usr/app

RUN npm install
RUN npm run build

FROM jitesoft/lighttpd as publish

WORKDIR /var/www/html

COPY --from=build /usr/app/build/. ./
