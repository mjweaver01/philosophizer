#!/bin/bash
#
# Restore philosopher text chunks and vector data to PostgreSQL
# This loads data from pgvector-backup.sql into the database
#
# Usage:
#   ./scripts/restore-pgvector.sh
#
# Prerequisites:
#   - PostgreSQL container must be running
#   - pgvector-backup.sql must exist

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_FILE="$PROJECT_ROOT/pgvector-backup.sql"

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
if ! docker compose ps postgres | grep -q "running"; then
  echo "❌ Error: PostgreSQL container is not running"
  echo "   Run: docker compose up -d postgres"
  exit 1
fi

# Get database connection details
DB_CONTAINER="philosophizer-postgres"
DB_NAME="${POSTGRES_DB:-philosophizer}"
DB_USER="${POSTGRES_USER:-postgres}"

echo "⚠️  Warning: This will replace all existing vector data"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled"
  exit 0
fi

echo ""
echo "💾 Restoring backup..."

# Restore the backup
docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

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

