#!/bin/bash
# =============================================================================
# ChromaDB Restore Script
# 
# Restores ChromaDB data from a backup archive to a Docker volume
#
# Usage:
#   ./scripts/restore-chroma.sh                       # Uses default backup file
#   ./scripts/restore-chroma.sh my-backup.tar.gz      # Custom backup file
#
# Prerequisites: chroma-backup.tar.gz in project root (or specify path)
# =============================================================================

set -e

# Configuration
BACKUP_FILE="${1:-chroma-backup.tar.gz}"
VOLUME_NAME="philosophizer-chroma-data"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🗄️  ChromaDB Restore Script"
echo "==========================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if backup file exists
if [ ! -f "$PROJECT_ROOT/$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $PROJECT_ROOT/$BACKUP_FILE"
    echo ""
    echo "Usage: $0 <backup-file.tar.gz>"
    exit 1
fi

BACKUP_SIZE=$(ls -lh "$PROJECT_ROOT/$BACKUP_FILE" | awk '{print $5}')
echo "📦 Backup file: $BACKUP_FILE ($BACKUP_SIZE)"
echo "📁 Target volume: $VOLUME_NAME"
echo ""

# Stop Chroma container if running
if docker ps -q -f name=philosophizer-chroma > /dev/null 2>&1; then
    CHROMA_RUNNING=$(docker ps -q -f name=philosophizer-chroma)
    if [ -n "$CHROMA_RUNNING" ]; then
        echo "⏸️  Stopping Chroma container..."
        docker stop philosophizer-chroma > /dev/null
    fi
fi

# Create volume if it doesn't exist
if ! docker volume inspect "$VOLUME_NAME" > /dev/null 2>&1; then
    echo "📦 Creating volume: $VOLUME_NAME"
    docker volume create "$VOLUME_NAME" > /dev/null
fi

# Restore backup
echo "📥 Restoring backup to volume..."
docker run --rm \
    -v "$VOLUME_NAME:/data" \
    -v "$PROJECT_ROOT:/backup:ro" \
    alpine sh -c "rm -rf /data/* && cd /data && tar xzf /backup/$BACKUP_FILE"

echo ""
echo "✅ Restore complete!"
echo ""
echo "Next steps:"
echo "  docker compose up -d"
echo ""
echo "To verify the data:"
echo "  curl http://localhost:8000/api/v1/collections"

