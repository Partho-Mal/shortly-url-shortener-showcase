#!/bin/bash
# ============================================================================
# Full Docker Cleanup Script
#
# Purpose:
#   Stop, remove, and clean all Docker containers, images, volumes, and networks.
#   Safe for local development reset or rebuild.
#
# Usage:
#   cd go_backend
#   chmod +x ./bin/bash/all_docker_cleanup.sh
#   ./bin/bash/all_docker_cleanup.sh
# ============================================================================

set -e  # Exit immediately if any command fails

# Confirmation prompt
echo "WARNING: This will remove ALL Docker containers, images, volumes, and networks!"
read -p "Do you want to continue? (y/N): " confirm
case "$confirm" in
  [yY][eE][sS]|[yY])
    echo "Starting full Docker cleanup..."
    ;;
  *)
    echo "Cleanup cancelled."
    exit 0
    ;;
esac

# ------------------------------------------------------------
# Step 1: Stop all running containers
# ------------------------------------------------------------
if [ "$(docker ps -q)" ]; then
  echo "Stopping all running containers..."
  docker stop $(docker ps -q)
else
  echo "No running containers found."
fi

# ------------------------------------------------------------
# Step 2: Remove all containers
# ------------------------------------------------------------
if [ "$(docker ps -aq)" ]; then
  echo "Removing all containers..."
  docker rm -f $(docker ps -aq)
else
  echo "No containers to remove."
fi

# ------------------------------------------------------------
# Step 3: Remove all images
# ------------------------------------------------------------
if [ "$(docker images -q)" ]; then
  echo "Removing all images..."
  docker rmi -f $(docker images -q)
else
  echo "No images to remove."
fi

# ------------------------------------------------------------
# Step 4: Remove all volumes (WARNING: deletes all data)
# ------------------------------------------------------------
if [ "$(docker volume ls -q)" ]; then
  echo "Removing all volumes..."
  docker volume rm $(docker volume ls -q)
else
  echo "No volumes found."
fi

# ------------------------------------------------------------
# Step 5: Remove all custom networks (excluding defaults)
# ------------------------------------------------------------
NETWORKS=$(docker network ls --filter type=custom -q)
if [ -n "$NETWORKS" ]; then
  echo "Removing all custom networks..."
  docker network rm $NETWORKS
else
  echo "No custom networks found."
fi

# ------------------------------------------------------------
# Step 6: Verification summary
# ------------------------------------------------------------
echo ""
echo "Remaining Docker state:"
docker ps -a
docker images
docker volume ls
docker network ls

echo ""
echo "Docker cleanup completed successfully."
echo "You can now rebuild your stack with:"
echo "docker compose up --build"
