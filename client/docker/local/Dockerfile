ARG NODE_VERSION=24-alpine3.21

FROM node:${NODE_VERSION} AS node

FROM node AS client-local-build

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

COPY ./package*.json .

RUN npm install

RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . ${APP_HOME}

CMD ["npm","start"]
