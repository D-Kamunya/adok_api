#!/bin/bash

set -e

# 💡 UPDATE THESE
DIGITAL_OCEAN_IP_ADDRESS="139.162.189.133"
EMAIL="kinc.developer@gmail.com"
DOMAINS=(dok.ackirinyaga.org www.dok.ackirinyaga.org)
RSA_KEY_SIZE=4096
STAGING=1 # Set to 0 for production certs

# 🧹 Cleanup local
cleanup_local() {
  echo "Cleaning up local temporary files..."
  rm -rf ./project.tar
}
trap cleanup_local EXIT

echo "Archiving project..."
git archive --format tar --output ./project.tar master

echo "Uploading project to $DIGITAL_OCEAN_IP_ADDRESS..."
rsync -avz ./project.tar root@$DIGITAL_OCEAN_IP_ADDRESS:/tmp/project.tar

# 🚀 Connect to server and deploy
ssh -o StrictHostKeyChecking=no root@$DIGITAL_OCEAN_IP_ADDRESS <<'ENDSSH'

set -e

# 🧹 Clean up remote
cleanup_remote(){
  echo "Cleaning up remote temp files..."
  rm -rf /tmp/project.tar
  rm -rf /app
}
trap cleanup_remote EXIT

TEMP_DIR=$(mktemp -d)
echo "Extracting to $TEMP_DIR..."
tar -xf /tmp/project.tar -C "$TEMP_DIR"

cd "$TEMP_DIR"

echo "Stopping existing containers..."
docker compose -f docker-compose.production.yml down --remove-orphans

echo "Pruning unused Docker resources..."
docker system prune -af

echo "Starting containers..."
docker compose -f docker-compose.production.yml up -d --build --remove-orphans

echo "Setting up Certbot..."

EMAIL="kinc.developer@gmail.com"
DOMAINS=(dok.ackirinyaga.org www.dok.ackirinyaga.org)
RSA_KEY_SIZE=4096
STAGING=1

# Build domain args
domain_args=""
for domain in "${DOMAINS[@]}"; do
  domain_args="$domain_args -d \$domain"
done

email_arg="--register-unsafely-without-email"
if [[ "\$EMAIL" != "" ]]; then
  email_arg="--email \$EMAIL"
fi

staging_arg=""
if [ \$STAGING -ne 0 ]; then
  staging_arg="--staging"
fi

# Dummy certs
echo "Creating dummy certs..."
mkdir -p ./docker/production/nginx/certbot/conf/live/${DOMAINS[0]}
docker compose -f docker-compose.production.yml run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:1024 -days 1 \
    -keyout '/etc/letsencrypt/live/${DOMAINS[0]}/privkey.pem' \
    -out '/etc/letsencrypt/live/${DOMAINS[0]}/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo "Reloading nginx with dummy certs..."
docker compose -f docker-compose.production.yml up --force-recreate -d nginx

echo "Deleting dummy certs..."
docker compose -f docker-compose.production.yml run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/${DOMAINS[0]} && \
  rm -Rf /etc/letsencrypt/archive/${DOMAINS[0]} && \
  rm -Rf /etc/letsencrypt/renewal/${DOMAINS[0]}.conf" certbot

echo "Requesting Let's Encrypt certs..."
docker compose -f docker-compose.production.yml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    \$staging_arg \
    \$email_arg \
    \$domain_args \
    --rsa-key-size \$RSA_KEY_SIZE \
    --agree-tos \
    --force-renewal" certbot

echo "Reloading nginx with real certs..."
docker compose -f docker-compose.production.yml exec nginx nginx -s reload

ENDSSH

echo "✅ Deployment and SSL setup completed!"
