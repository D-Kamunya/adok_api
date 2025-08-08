#!/bin/bash

set -e

# 💡 UPDATE THESE
DIGITAL_OCEAN_IP_ADDRESS="139.162.189.133"

# 🧹 Cleanup local
cleanup_local() {
  echo "Cleaning up local temporary files..."
  rm -rf ./project.tar
}
trap cleanup_local EXIT

echo "Archiving project..."
git archive --format tar --output ./project.tar develop

echo "Uploading project to $DIGITAL_OCEAN_IP_ADDRESS..."
rsync -avz ./project.tar root@$DIGITAL_OCEAN_IP_ADDRESS:/tmp/project.tar

echo "Uploading env files..."
rsync -avz .envs root@$DIGITAL_OCEAN_IP_ADDRESS:/tmp/.envs
# 🚀 Connect to server and deploy
ssh -o StrictHostKeyChecking=no root@$DIGITAL_OCEAN_IP_ADDRESS <<'ENDSSH'

set -e

# 🧹 Clean up remote
cleanup_remote(){
  echo "Cleaning up remote temp files..."
  rm -rf /tmp/project.tar
  rm -rf /app
  mv -rf /tmp/.envs
}
trap cleanup_remote EXIT

TEMP_DIR=$(mktemp -d)
echo "Extracting to $TEMP_DIR..."
tar -xf /tmp/project.tar -C "$TEMP_DIR"

mv /tmp/.envs "$TEMP_DIR/.envs"

cd "$TEMP_DIR"

echo "Stopping existing containers..."
docker compose -f local.yml down --remove-orphans

echo "Pruning unused Docker resources..."
docker system prune -af

echo "Starting containers..."
docker compose -f local.yml up -d --build --remove-orphans


ENDSSH

echo "✅ Local Deployment completed!"
