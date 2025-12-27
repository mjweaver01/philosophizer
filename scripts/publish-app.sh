#!/bin/bash
#
# Build and publish the Philosophizer app Docker image
#
# Usage:
#   ./scripts/publish-app.sh <docker-image-name>
#   ./scripts/publish-app.sh mjweaver01/philosophizer
#
# Prerequisites:
#   - Docker must be running
#   - You must be logged in to Docker Hub (docker login)

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <docker-image-name>"
  echo "Example: $0 mjweaver01/philosophizer:latest"
  exit 1
fi

IMAGE_NAME="$1"

# Add :latest tag if no tag specified
if [[ "$IMAGE_NAME" != *":"* ]]; then
  IMAGE_NAME="${IMAGE_NAME}:latest"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🐳 Philosophizer App Docker Image Builder"
echo "=========================================="
echo ""

# Build the Docker image for multiple platforms (amd64 for Windows/Linux, arm64 for Mac/RPi)
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
  -f Dockerfile \
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
echo "🎯 To use with docker-compose:"
echo "   1. Update docker-compose.yml:"
echo "      app:"
echo "        image: $IMAGE_NAME"
echo "        # comment out the 'build:' section"
echo ""
echo "   2. On target machine:"
echo "      docker compose up -d"
echo ""
echo "🎯 To run standalone:"
echo "   docker run -d -p 1738:1738 \\"
echo "     -e DATABASE_URL=your-db-url \\"
echo "     -e OPENAI_API_KEY=your-key \\"
echo "     $IMAGE_NAME"
echo ""
echo "🎉 Done!"

