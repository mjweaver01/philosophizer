#!/bin/bash
#
# Backup philosopher text chunks and vector data from PostgreSQL
# This creates a SQL dump that can be used to pre-load a production database
#
# Usage:
#   ./scripts/backup-pgvector.sh
#
# Prerequisites:
#   - PostgreSQL container must be running
#   - Philosopher texts must be indexed

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_FILE="$PROJECT_ROOT/pgvector-backup.sql"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
VERSIONED_BACKUP="$PROJECT_ROOT/pgvector-backup-${TIMESTAMP}.sql"

echo "🗄️  PostgreSQL Vector Database Backup"
echo "======================================"
echo ""

# Check if PostgreSQL container is running
if ! docker compose ps postgres | grep -q "Up"; then
  echo "❌ Error: PostgreSQL container is not running"
  echo "   Run: docker compose up -d postgres"
  exit 1
fi

# Get database connection details from docker-compose
DB_CONTAINER="philosophizer-postgres"
DB_NAME="${POSTGRES_DB:-philosophizer}"
DB_USER="${POSTGRES_USER:-postgres}"

# Check if philosopher_text_chunks table has data
echo "📊 Checking vector data..."
CHUNK_COUNT=$(docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM philosopher_text_chunks;" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$CHUNK_COUNT" = "0" ]; then
  echo "❌ Error: No philosopher text chunks found"
  echo "   Run: bun run rag:index"
  exit 1
fi

echo "✓ Found $CHUNK_COUNT text chunks"
echo ""

# Create backup with only the vector data tables
echo "💾 Creating backup..."
docker compose exec -T postgres pg_dump \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --table=philosopher_text_chunks \
  --data-only \
  --column-inserts \
  > "$BACKUP_FILE"

if [ $? -ne 0 ]; then
  echo "❌ Backup failed"
  exit 1
fi

# Create versioned backup
cp "$BACKUP_FILE" "$VERSIONED_BACKUP"

# Create transaction-safe merge file for remote database updates
MERGE_FILE="$PROJECT_ROOT/pgvector-merge.sql"
echo "💾 Creating transaction-safe merge file..."

cat > "$MERGE_FILE" << 'EOF'
-- Transaction-safe vector data merge
-- This replaces philosopher_text_chunks while preserving all other tables

BEGIN;

-- Remove all existing vector data
TRUNCATE TABLE philosopher_text_chunks CASCADE;

-- Insert new vector data from backup
EOF

# Append the backup data
cat "$BACKUP_FILE" >> "$MERGE_FILE"

# Complete the transaction
cat >> "$MERGE_FILE" << 'EOF'

COMMIT;

-- Verify the merge
SELECT 
  'Merge completed successfully!' as status,
  COUNT(*) as total_chunks,
  COUNT(DISTINCT philosopher) as philosophers
FROM philosopher_text_chunks;
EOF

MERGE_SIZE=$(du -h "$MERGE_FILE" | cut -f1)

# Get file size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo ""
echo "✅ Backup complete!"
echo ""
echo "📁 Files created:"
echo "   $BACKUP_FILE ($BACKUP_SIZE)"
echo "   $VERSIONED_BACKUP"
echo "   $MERGE_FILE ($MERGE_SIZE) [transaction-safe for remote merge]"
echo ""
echo "📊 Backup statistics:"
docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -c "
SELECT 
  philosopher,
  COUNT(*) as chunks,
  pg_size_pretty(SUM(octet_length(content))) as text_size,
  pg_size_pretty(SUM(octet_length(embedding::text))) as vector_size
FROM philosopher_text_chunks 
GROUP BY philosopher 
ORDER BY philosopher;
"
echo ""
echo "🎯 Next steps:"
echo "   1. Review: cat pgvector-backup.sql | head -20"
echo "   2. Local restore: ./scripts/restore-pgvector.sh"
echo "   3. Remote merge: ./scripts/merge-pgvector.sh \$DATABASE_URL"
echo "   4. Publish Docker image: ./scripts/publish-pgvector.sh your-dockerhub-username/philosophizer-pgvector"
echo ""

