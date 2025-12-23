#!/bin/bash
# =============================================================================
# Publish ChromaDB Image with Pre-loaded Data
#
# Builds and pushes a ChromaDB Docker image with your vector data baked in.
# Perfect for Railway deployments where you want consistent, reproducible data.
#
# Usage:
#   ./scripts/publish-chroma.sh <image-name>
#
# Examples:
#   ./scripts/publish-chroma.sh myuser/philosophizer-chroma
#   ./scripts/publish-chroma.sh ghcr.io/myuser/philosophizer-chroma
#
# Prerequisites:
#   1. Docker logged in to your registry (docker login / docker login ghcr.io)
#   2. chroma-backup.tar.gz exists (run ./scripts/backup-chroma.sh first)
# =============================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_FILE="chroma-backup.tar.gz"
IMAGE_NAME="${1:-}"
TAG="${2:-latest}"

echo "🐳 Publish ChromaDB Image"
echo "========================="
echo ""

# Check if image name provided
if [ -z "$IMAGE_NAME" ]; then
    echo "❌ Please provide an image name"
    echo ""
    echo "Usage: $0 <image-name> [tag]"
    echo ""
    echo "Examples:"
    echo "  $0 myuser/philosophizer-chroma"
    echo "  $0 ghcr.io/myuser/philosophizer-chroma v1.0"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if backup file exists
if [ ! -f "$PROJECT_ROOT/$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    echo ""
    echo "Run this first:"
    echo "  ./scripts/backup-chroma.sh"
    exit 1
fi

BACKUP_SIZE=$(ls -lh "$PROJECT_ROOT/$BACKUP_FILE" | awk '{print $5}')
echo "📦 Backup file: $BACKUP_FILE ($BACKUP_SIZE)"
echo "🏷️  Image: $IMAGE_NAME:$TAG"
echo ""

# Build the image for linux/amd64 (Railway's architecture)
echo "🔨 Building image for linux/amd64..."
cd "$PROJECT_ROOT"
docker build --platform linux/amd64 -f Dockerfile.chroma -t "$IMAGE_NAME:$TAG" .

IMAGE_SIZE=$(docker images "$IMAGE_NAME:$TAG" --format "{{.Size}}")
echo "✅ Built: $IMAGE_NAME:$TAG ($IMAGE_SIZE)"
echo ""

# Ask to push
read -p "📤 Push to registry? [y/N] " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Pushing image..."
    docker push "$IMAGE_NAME:$TAG"
    echo ""
    echo "✅ Published: $IMAGE_NAME:$TAG"
else
    echo "⏭️  Skipped push"
fi

echo ""
echo "🎉 Done!"
echo ""
echo "To use in Railway:"
echo "  1. Create a new service in Railway"
echo "  2. Select 'Docker Image'"
echo "  3. Enter: $IMAGE_NAME:$TAG"
echo "  4. Set environment variables:"
echo "     - IS_PERSISTENT=TRUE"
echo "     - ANONYMIZED_TELEMETRY=FALSE"
echo ""

