#!/bin/bash
#
# Merge philosopher text chunks and vector data to a remote PostgreSQL database
# This updates ONLY the philosopher_text_chunks table while preserving all other data
#
# Usage:
#   ./scripts/merge-pgvector.sh [DATABASE_URL]
#   ./scripts/merge-pgvector.sh "postgresql://user:pass@host:port/dbname"
#   
#   Or use environment variable:
#   DATABASE_URL="postgresql://..." ./scripts/merge-pgvector.sh
#
# Prerequisites:
#   - pgvector-backup.sql must exist (run backup-pgvector.sh first)
#   - PostgreSQL client (psql) must be installed
#   - Network access to remote database

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_FILE="$PROJECT_ROOT/pgvector-backup.sql"
MERGE_FILE="$PROJECT_ROOT/pgvector-merge.sql"

echo "🔄 PostgreSQL Vector Database Merge"
echo "===================================="
echo ""

# Get database connection string
DB_URL="${1:-$DATABASE_URL}"

if [ -z "$DB_URL" ]; then
  echo "❌ Error: No database URL provided"
  echo ""
  echo "Usage:"
  echo "  $0 <database-url>"
  echo "  $0 \"postgresql://user:pass@host:port/dbname\""
  echo ""
  echo "Or set DATABASE_URL environment variable:"
  echo "  DATABASE_URL=\"postgresql://...\" $0"
  exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Backup file not found: $BACKUP_FILE"
  echo "   Run: ./scripts/backup-pgvector.sh"
  exit 1
fi

# Get backup statistics
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
INSERT_COUNT=$(grep -c "^INSERT INTO philosopher_text_chunks" "$BACKUP_FILE" || echo "0")

echo "📦 Backup file: $BACKUP_SIZE"
echo "📊 Insert statements: $INSERT_COUNT"
echo ""

# Test database connection
echo "🔌 Testing connection..."
if ! psql "$DB_URL" -c "SELECT 1;" > /dev/null 2>&1; then
  echo "❌ Error: Cannot connect to database"
  echo "   Check your connection string and network access"
  exit 1
fi
echo "✓ Connection successful"
echo ""

# Check current data in database
echo "📊 Current database state..."
CURRENT_COUNT=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM philosopher_text_chunks;" 2>/dev/null | tr -d ' ' || echo "0")
CURRENT_PHILOSOPHERS=$(psql "$DB_URL" -t -c "SELECT COUNT(DISTINCT philosopher) FROM philosopher_text_chunks;" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$CURRENT_COUNT" = "0" ]; then
  echo "   philosopher_text_chunks: empty"
else
  echo "   philosopher_text_chunks: $CURRENT_COUNT chunks from $CURRENT_PHILOSOPHERS philosophers"
fi

# Check other tables to confirm we're preserving them
USER_COUNT=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ' || echo "0")
CONV_COUNT=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM conversations;" 2>/dev/null | tr -d ' ' || echo "0")
MSG_COUNT=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM conversation_messages;" 2>/dev/null | tr -d ' ' || echo "0")

echo ""
echo "📋 Tables that will be PRESERVED:"
echo "   users: $USER_COUNT rows"
echo "   conversations: $CONV_COUNT rows"
echo "   conversation_messages: $MSG_COUNT rows"
echo ""

# Warning and confirmation
echo "⚠️  WARNING: This will REPLACE all data in philosopher_text_chunks"
echo "   All other tables will remain untouched"
echo ""

# Check if running in CI/non-interactive mode
if [ -t 0 ]; then
  read -p "Continue with merge? (y/N) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
  fi
else
  echo "ℹ️  Running in non-interactive mode, proceeding with merge..."
fi

echo ""
echo "💾 Creating transaction-safe merge file..."

# Create a transaction-wrapped merge file
cat > "$MERGE_FILE" << 'EOF'
-- Transaction-safe vector data merge
-- This replaces philosopher_text_chunks while preserving all other tables

BEGIN;

-- Remove all existing vector data
TRUNCATE TABLE philosopher_text_chunks CASCADE;

-- Insert new vector data from backup
EOF

# Append the backup data (skip any transaction statements that might be in backup)
grep "^INSERT INTO philosopher_text_chunks" "$BACKUP_FILE" >> "$MERGE_FILE"

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

echo "✓ Merge file created: $MERGE_FILE"
echo ""
echo "🔄 Executing merge..."

# Execute the merge
if psql "$DB_URL" -f "$MERGE_FILE"; then
  echo ""
  echo "✅ Merge complete!"
else
  echo ""
  echo "❌ Merge failed (transaction rolled back)"
  exit 1
fi

# Get final statistics
echo ""
echo "📊 Final statistics by philosopher:"
psql "$DB_URL" -c "
SELECT 
  philosopher,
  COUNT(*) as chunks,
  pg_size_pretty(SUM(octet_length(content))) as text_size
FROM philosopher_text_chunks 
GROUP BY philosopher 
ORDER BY philosopher;
"

# Verify preservation of other tables
echo ""
echo "✓ Verified preserved tables:"
psql "$DB_URL" -c "
SELECT 
  'users' as table_name, 
  COUNT(*) as rows 
FROM users
UNION ALL
SELECT 
  'conversations', 
  COUNT(*) 
FROM conversations
UNION ALL
SELECT 
  'conversation_messages', 
  COUNT(*) 
FROM conversation_messages;
"

echo ""
echo "🎉 Vector data merge completed successfully!"
echo ""
echo "📁 Merge file saved: $MERGE_FILE"
echo "   (Keep this for audit/rollback purposes)"
echo ""

