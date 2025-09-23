#!/bin/bash

set -e

# 💡 UPDATE THESE
DIGITAL_OCEAN_IP_ADDRESS="139.162.189.133"
EMAIL="kinc.developer@gmail.com"
DOMAINS=(dok.ackirinyaga.org www.dok.ackirinyaga.org)
RSA_KEY_SIZE=4096
data_path="./docker/production/nginx/certbot"
STAGING=1 # Set to 1 for testing, 0 for production    

# 🧹 Cleanup local
cleanup_local() {
  echo "Cleaning up local temporary files..."
  rm -rf ./project-repo.tar.gz
}
trap cleanup_local EXIT

echo "Archiving project..."
git ls-files -z | tar -czf project-repo.tar.gz --null -T - .git

echo "Uploading project to $DIGITAL_OCEAN_IP_ADDRESS..."
rsync -avz ./project-repo.tar.gz root@$DIGITAL_OCEAN_IP_ADDRESS:/tmp/project-repo.tar.gz

echo "Uploading env files..."
rsync -avz .envs/ root@$DIGITAL_OCEAN_IP_ADDRESS:/tmp/.envs/
rsync -avz ./client/.env root@$DIGITAL_OCEAN_IP_ADDRESS:/tmp/.envs/client.env

# 🚀 Connect to server and deploy
ssh -o StrictHostKeyChecking=no root@$DIGITAL_OCEAN_IP_ADDRESS <<'ENDSSH'

set -e

# 🧹 Clean up remote
cleanup_remote(){
  echo "Cleaning up remote temp files..."
  rm -rf /tmp/project-repo.tar.gz
  rm -rf /app
  rm -rf /tmp/.envs
}
trap cleanup_remote EXIT

TEMP_DIR=$(mktemp -d)
echo "Extracting to $TEMP_DIR..."
tar -xzf /tmp/project-repo.tar.gz -C "$TEMP_DIR"

rsync -av --exclude='client.env' /tmp/.envs/ "$TEMP_DIR/.envs/"
rsync -av /tmp/.envs/client.env "$TEMP_DIR/client/.env"

cd "$TEMP_DIR"

echo "Stopping existing containers..."
docker compose -f docker-compose.production.yml down --remove-orphans

echo "Pruning unused Docker resources..."
docker system prune -af

echo "Starting containers..."
docker compose -f docker-compose.production.yml up -d --build --remove-orphans

echo "Setting up Certbot..."

# EMAIL="kinc.developer@gmail.com"
# DOMAINS=(dok.ackirinyaga.org www.dok.ackirinyaga.org)
# RSA_KEY_SIZE=4096
# STAGING=1

DIGITAL_OCEAN_IP_ADDRESS="139.162.189.133"
EMAIL="kinc.developer@gmail.com"
DOMAINS=(dok.ackirinyaga.org www.dok.ackirinyaga.org)
RSA_KEY_SIZE=4096
data_path="./docker/production/nginx/certbot"
STAGING=1 # Set to 1 for testing, 0 for production
DOMAINS_STR="${DOMAINS[*]}"   

if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

# Build domain args
domain_args=""
for domain in "${DOMAINS[@]}"; do
  domain_args="$domain_args -d $domain"
done

email_arg="--register-unsafely-without-email"
if [[ "\$EMAIL" != "" ]]; then
  email_arg="--email $EMAIL"
fi

staging_arg=""

if [ "$STAGING" != "0" ]; then staging_arg="--staging"; fi

# Dummy certs
echo "Creating dummy certs for ${DOMAINS[@]}..."
path="/etc/letsencrypt/live/dok.ackirinyaga.org"
mkdir -p "$data_path/conf/live/dok.ackirinyaga.org"
docker compose -f docker-compose.production.yml run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:1024 -days 1 \
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot


echo "Reloading nginx with dummy certs..."
docker compose -f docker-compose.production.yml up --force-recreate -d nginx

echo "Deleting dummy certs..."

docker compose -f docker-compose.production.yml run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/dok.ackirinyaga.org && \
  rm -Rf /etc/letsencrypt/archive/dok.ackirinyaga.org && \
  rm -Rf /etc/letsencrypt/renewal/dok.ackirinyaga.org.conf" certbot

echo "Requesting Let's Encrypt certs..."

docker compose -f docker-compose.production.yml run --rm --entrypoint "" \
certbot certbot certonly   --webroot -w /var/www/certbot   \
$email_arg  \
$domain_args  \
--rsa-key-size $RSA_KEY_SIZE   \
--agree-tos  \
--non-interactive \
$staging_arg -v

echo "Reloading nginx with real certs..."
docker compose -f docker-compose.production.yml exec nginx nginx -s reload

ENDSSH

echo "✅ Deployment and SSL setup completed!"
