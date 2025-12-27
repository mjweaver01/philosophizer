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

# Build the Docker image for multiple platforms
echo "🔨 Building Docker image: $IMAGE_NAME"
echo "   Platforms: linux/amd64, linux/arm64"
echo ""

# Create buildx builder if it doesn't exist
if ! docker buildx inspect philosophizer-builder &> /dev/null; then
  echo "📦 Creating multi-platform builder..."
  docker buildx create --name philosophizer-builder --use
fi

# Build and push for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f Dockerfile.pgvector \
  -t "$IMAGE_NAME" \
  --push \
  "$PROJECT_ROOT"

if [ $? -ne 0 ]; then
  echo "❌ Docker build failed"
  exit 1
fi

echo ""
echo "✅ Build and push complete!"
echo ""
echo "📦 Image: $IMAGE_NAME"
echo "   Platforms: linux/amd64, linux/arm64"
echo ""

echo "✅ Image published successfully!"
echo ""
echo "🎯 To use in production:"
echo "   1. Create new service → Docker Image"
echo "   2. Image: $IMAGE_NAME"
echo "   3. Set POSTGRES_PASSWORD environment variable"
echo ""
echo "🎯 To use locally:"
echo "   docker run -d -p 5432:5432 \\"
echo "     -e POSTGRES_PASSWORD=postgres \\"
echo "     $IMAGE_NAME"
echo ""
echo "🎉 Done!"

