#!/bin/bash
# ============================================================================
# Project-specific Docker Cleanup Script
#
# Purpose:
#   Stop, remove, and clean only the Shortly project containers, volumes,
#   and network. Safe for local development reset or rebuild.
#
# Usage:
#   cd go_backend
#   chmod +x ./bin/bash/docker_cleanup.sh
#   ./bin/bash/docker_cleanup.sh
# ============================================================================

set -e  # Exit immediately if any command fails

# Confirmation prompt
read -p "WARNING: This will delete all Shortly containers, volumes, and network. Continue? [y/N] " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Cleanup aborted."
  exit 1
fi

echo "Starting Docker cleanup for Shortly project..."

# List of project containers
CONTAINERS=("shortly_postgres" "shortly_redis" "shortly_app")

# Stop containers if running
for container in "${CONTAINERS[@]}"; do
  if [ "$(docker ps -q -f name=$container)" ]; then
    echo "Stopping container $container..."
    docker stop $container
  else
    echo "Container $container not running."
  fi
done

# Remove containers
for container in "${CONTAINERS[@]}"; do
  if [ "$(docker ps -aq -f name=$container)" ]; then
    echo "Removing container $container..."
    docker rm -f $container
  else
    echo "Container $container not found."
  fi
done

# Remove project volume
if [ "$(docker volume ls -q -f name=pgdata)" ]; then
  echo "Removing volume pgdata..."
  docker volume rm pgdata
else
  echo "Volume pgdata not found."
fi

# Remove project network
if [ "$(docker network ls -q -f name=shortly_net)" ]; then
  echo "Removing network shortly_net..."
  docker network rm shortly_net
else
  echo "Network shortly_net not found."
fi

# Verification summary
echo ""
echo "Remaining Docker state:"
docker ps -a
docker images
docker volume ls
docker network ls

echo ""
echo "Project-specific Docker cleanup completed."
echo "You can now rebuild the stack with:"
echo "docker compose up --build"
