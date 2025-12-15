#!/bin/bash
# =============================================================================
# ChromaDB Backup Script
# 
# Creates a backup of your local ChromaDB data that can be deployed to a VPS
#
# Usage:
#   ./scripts/backup-chroma.sh                    # Uses default volume name
#   ./scripts/backup-chroma.sh my-volume-name     # Custom volume name
#
# Output: chroma-backup.tar.gz in project root
# =============================================================================

set -e

# Configuration
VOLUME_NAME="${1:-chroma-data}"
BACKUP_FILE="chroma-backup.tar.gz"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🗄️  ChromaDB Backup Script"
echo "=========================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if the volume exists
if ! docker volume inspect "$VOLUME_NAME" > /dev/null 2>&1; then
    echo "❌ Volume '$VOLUME_NAME' not found."
    echo ""
    echo "Available volumes:"
    docker volume ls --format "  - {{.Name}}"
    echo ""
    echo "Usage: $0 <volume-name>"
    exit 1
fi

echo "📦 Backing up volume: $VOLUME_NAME"
echo "📁 Output file: $PROJECT_ROOT/$BACKUP_FILE"
echo ""

# Stop the Chroma container if it's running (to ensure data consistency)
if docker ps -q -f name=chroma > /dev/null 2>&1; then
    CHROMA_RUNNING=$(docker ps -q -f name=chroma)
    if [ -n "$CHROMA_RUNNING" ]; then
        echo "⏸️  Stopping Chroma container for consistent backup..."
        docker stop chroma > /dev/null
        RESTART_CHROMA=true
    fi
fi

# Create backup using Alpine container
echo "📤 Creating backup archive..."
docker run --rm \
    -v "$VOLUME_NAME:/data:ro" \
    -v "$PROJECT_ROOT:/backup" \
    alpine tar czf "/backup/$BACKUP_FILE" -C /data .

# Get backup size
BACKUP_SIZE=$(ls -lh "$PROJECT_ROOT/$BACKUP_FILE" | awk '{print $5}')
echo "✅ Backup created: $BACKUP_FILE ($BACKUP_SIZE)"

# Restart Chroma if we stopped it
if [ "$RESTART_CHROMA" = true ]; then
    echo "▶️  Restarting Chroma container..."
    docker start chroma > /dev/null
fi

echo ""
echo "🎉 Backup complete!"
echo ""
echo "Next steps:"
echo "  1. Copy $BACKUP_FILE to your VPS"
echo "  2. Run ./scripts/restore-chroma.sh on the VPS"
echo "  3. Start services with: docker compose up -d"

