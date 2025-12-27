#!/bin/bash
#
# Restore philosopher text chunks and vector data to PostgreSQL
# This loads data from pgvector-backup.sql into the database
#
# Usage:
#   ./scripts/restore-pgvector.sh [--merge|--full]
#
#   --merge: Replace existing vector data (truncate then insert)
#   --full:  Standard restore (may error on duplicate keys)
#   (auto):  Auto-detect based on whether data exists
#
# Prerequisites:
#   - PostgreSQL container must be running
#   - pgvector-backup.sql must exist

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_FILE="$PROJECT_ROOT/pgvector-backup.sql"
MERGE_FILE="$PROJECT_ROOT/pgvector-merge.sql"

# Parse command line arguments
MODE="auto"
if [ "$1" = "--merge" ]; then
  MODE="merge"
elif [ "$1" = "--full" ]; then
  MODE="full"
fi

echo "📥 PostgreSQL Vector Database Restore"
echo "======================================"
echo ""

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Backup file not found: $BACKUP_FILE"
  echo "   Run: ./scripts/backup-pgvector.sh"
  exit 1
fi

# Check if PostgreSQL container is running
if ! docker compose ps postgres | grep -q "Up"; then
  echo "❌ Error: PostgreSQL container is not running"
  echo "   Run: docker compose up -d postgres"
  exit 1
fi

# Get database connection details
DB_CONTAINER="philosophizer-postgres"
DB_NAME="${POSTGRES_DB:-philosophizer}"
DB_USER="${POSTGRES_USER:-postgres}"

# Auto-detect mode if not specified
if [ "$MODE" = "auto" ]; then
  CHUNK_COUNT=$(docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM philosopher_text_chunks;" 2>/dev/null | tr -d ' ' || echo "0")
  
  if [ "$CHUNK_COUNT" = "0" ]; then
    MODE="full"
    echo "ℹ️  Auto-detected: Table is empty, using full restore mode"
  else
    MODE="merge"
    echo "ℹ️  Auto-detected: Table has $CHUNK_COUNT chunks, using merge mode"
  fi
  echo ""
fi

# Display mode
if [ "$MODE" = "merge" ]; then
  echo "🔄 Mode: MERGE (replace existing data)"
  
  if [ ! -f "$MERGE_FILE" ]; then
    echo "❌ Error: Merge file not found: $MERGE_FILE"
    echo "   Run: ./scripts/backup-pgvector.sh"
    exit 1
  fi
  
  RESTORE_FILE="$MERGE_FILE"
else
  echo "📥 Mode: FULL (standard restore)"
  RESTORE_FILE="$BACKUP_FILE"
fi
echo ""

echo "⚠️  Warning: This will replace all existing vector data"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled"
  exit 0
fi

echo ""
echo "💾 Restoring from $RESTORE_FILE..."

# Restore the backup
docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" < "$RESTORE_FILE"

if [ $? -ne 0 ]; then
  echo "❌ Restore failed"
  exit 1
fi

# Get statistics
CHUNK_COUNT=$(docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM philosopher_text_chunks;" | tr -d ' ')

echo ""
echo "✅ Restore complete!"
echo ""
echo "📊 Restored $CHUNK_COUNT text chunks"
echo ""
echo "📊 Statistics by philosopher:"
docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -c "
SELECT 
  philosopher,
  COUNT(*) as chunks
FROM philosopher_text_chunks 
GROUP BY philosopher 
ORDER BY philosopher;
"
echo ""

