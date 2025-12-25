#!/bin/bash
#
# Build and publish a Docker image with pre-loaded pgvector data
# This creates a custom PostgreSQL image with philosopher texts already indexed
#
# Usage:
#   ./scripts/publish-pgvector.sh <docker-image-name>
#   ./scripts/publish-pgvector.sh mjweaver01/philosophizer-pgvector
#
# Prerequisites:
#   - pgvector-backup.sql must exist (run backup-pgvector.sh first)
#   - Docker must be running
#   - You must be logged in to Docker Hub (docker login)

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <docker-image-name>"
  echo "Example: $0 mjweaver01/philosophizer-pgvector:latest"
  exit 1
fi

IMAGE_NAME="$1"

# Add :latest tag if no tag specified
if [[ "$IMAGE_NAME" != *":"* ]]; then
  IMAGE_NAME="${IMAGE_NAME}:latest"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_FILE="$PROJECT_ROOT/pgvector-backup.sql"

echo "🐳 PostgreSQL + pgvector Docker Image Builder"
echo "=============================================="
echo ""

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Backup file not found: $BACKUP_FILE"
  echo "   Run: ./scripts/backup-pgvector.sh"
  exit 1
fi

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "📦 Backup file: $BACKUP_SIZE"

# Get number of chunks from backup
CHUNK_COUNT=$(grep -c "INSERT INTO philosopher_text_chunks" "$BACKUP_FILE" || echo "unknown")
echo "📊 Text chunks: $CHUNK_COUNT"
echo ""

# Build the Docker image
echo "🔨 Building Docker image: $IMAGE_NAME"
echo ""

docker build \
  -f Dockerfile.pgvector \
  -t "$IMAGE_NAME" \
  "$PROJECT_ROOT"

if [ $? -ne 0 ]; then
  echo "❌ Docker build failed"
  exit 1
fi

echo ""
echo "✅ Build complete!"
echo ""

# Get image size
IMAGE_SIZE=$(docker images "$IMAGE_NAME" --format "{{.Size}}")
echo "📦 Image size: $IMAGE_SIZE"
echo ""

# Offer to push to registry
read -p "Push to Docker registry? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "🚀 Pushing to Docker registry..."
  docker push "$IMAGE_NAME"
  
  if [ $? -ne 0 ]; then
    echo "❌ Push failed. Make sure you're logged in:"
    echo "   docker login"
    exit 1
  fi
  
  echo ""
  echo "✅ Image published successfully!"
  echo ""
  echo "🎯 To use this image:"
  echo ""
  echo "1. Update docker-compose.yml:"
  echo "   postgres:"
  echo "     image: $IMAGE_NAME"
  echo ""
  echo "2. Pull and run:"
  echo "   docker compose pull postgres"
  echo "   docker compose up -d"
  echo ""
else
  echo ""
  echo "✅ Image built locally. To push later:"
  echo "   docker push $IMAGE_NAME"
  echo ""
fi

echo "🎉 Done!"

