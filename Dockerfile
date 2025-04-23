FROM node:alpine AS build

WORKDIR /usr/app

COPY assets/ ./assets/
COPY src/ ./src/
COPY tsconfig.json package.json webpack.config.cjs webpack.prd.config.cjs ./

RUN npm install
RUN npm run build

FROM jitesoft/lighttpd as publish

WORKDIR /var/www/html

COPY --from=build /usr/app/build/. ./
