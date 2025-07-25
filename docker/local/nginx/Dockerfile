ARG NODE_VERSION=19.5.0-alpine

FROM node:${NODE_VERSION} AS node

FROM node AS client-local-build

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

COPY ./client/package*.json ./

RUN npm ci --silent

RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

COPY ./client/ ${APP_HOME}

RUN npm run build

FROM docker.io/nginx:1.27.0-alpine3.19-slim

RUN rm /etc/nginx/conf.d/default.conf

COPY ./docker/local/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=client-local-build /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]