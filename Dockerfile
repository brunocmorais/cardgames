FROM oven/bun:latest AS build

WORKDIR /usr/app

COPY public/ ./public/
COPY src/ ./src/
COPY tsconfig.json package.json vite.config.ts index.html ./

RUN bun install
RUN bun run build

FROM jitesoft/lighttpd as publish

WORKDIR /var/www/html

COPY --from=build /usr/app/dist/. ./
