FROM docker.io/nginx:1.27.0-alpine3.19-slim

RUN rm /etc/nginx/conf.d/default.conf

COPY ./docker/production/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY ./client/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
