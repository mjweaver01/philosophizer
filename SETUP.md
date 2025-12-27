# Quick Setup Guide

## Prerequisites

- Bun runtime installed
- Docker and Docker Compose installed (recommended)
- OR PostgreSQL installed locally (alternative)

## Setup Steps

### Option A: Using Docker (Recommended)

#### 1. Install Dependencies

```bash
bun install
```

#### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and set:

- `JWT_SECRET` - A strong secret key for JWT tokens (generate with `openssl rand -base64 32`)
- `OPENAI_API_KEY` - Your OpenAI API key
- `POSTGRES_PASSWORD` - Change the default password for production

#### 3. Start Services with Docker

```bash
# Start PostgreSQL, ChromaDB, and Ollama
docker compose up -d postgres chroma ollama

# Or use the npm script
bun run postgres

# Check services are running
docker compose ps
```

The PostgreSQL schema will be automatically initialized on first startup.

#### 4. Start the Development Server

```bash
bun run dev
```

The server will start at http://localhost:1738

---

### Option B: Local PostgreSQL

#### 1. Install Dependencies

```bash
bun install
```

#### 2. Setup PostgreSQL Database

```bash
# Create database
createdb philosophizer

# Run schema
psql -d philosophizer -f src/db/schema.sql
```

#### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and set:

- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A strong secret key for JWT tokens (generate with `openssl rand -base64 32`)
- `OPENAI_API_KEY` - Your OpenAI API key
- `CHROMA_URL` - Your ChromaDB URL (default: http://localhost:8000)

#### 4. Start ChromaDB (if not already running)

```bash
bun run chroma
```

#### 5. Start the Development Server

```bash
bun run dev
```

The server will start at http://localhost:1738

## First Time Usage

1. Navigate to http://localhost:1738/signup
2. Create an account with your email and password
3. You'll be automatically logged in and redirected to the chat interface
4. Start chatting with the philosopher AI!

## Existing Data Migration

If you have existing conversations in ChromaDB, they won't have a `userId` associated with them. You have two options:

**Option 1: Clear all conversations**

```bash
# This will delete all existing conversations
bun run rag:clear
```

**Option 2: Keep existing conversations (they won't be visible)**
Existing conversations without a `userId` will simply not be visible to any user. They'll remain in ChromaDB but won't be accessible through the UI.

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `pg_isready`
- Check your `DATABASE_URL` in `.env`
- Verify database exists: `psql -l | grep philosophizer`

### ChromaDB Issues

- Ensure ChromaDB is running: `curl http://localhost:8000/api/v1/heartbeat`
- Check ChromaDB logs: `docker logs chroma`

### Authentication Issues

- Clear browser localStorage if you're having token issues
- Verify `JWT_SECRET` is set in `.env`
- Check server logs for authentication errors

## Development Commands

```bash
# Start development server with hot reload
bun run dev

# Start production server
bun run start

# Run with Docker Compose (all services)
bun run start:docker

# PostgreSQL commands
bun run postgres           # Start PostgreSQL in Docker
bun run postgres:stop      # Stop PostgreSQL
bun run postgres:logs      # View PostgreSQL logs
bun run db:setup           # Setup database with schema
bun run db:reset           # Reset database (WARNING: deletes all data)

# Index philosophical texts (RAG)
bun run rag:index

# Clear RAG index
bun run rag:clear

# Backup ChromaDB
bun run chroma:backup
```

## Vector Data Backup & Merge Workflows

### Overview

The vector database contains philosopher text chunks with embeddings. You can backup, restore, and selectively merge this data across environments while preserving user data (conversations, messages, etc.).

### Backup Vector Data

Create a backup of the vector data from your local database:

```bash
./scripts/backup-pgvector.sh
```

This creates three files:

- `pgvector-backup.sql` - Standard SQL dump with INSERT statements
- `pgvector-merge.sql` - Transaction-wrapped version for safe merging
- `pgvector-backup-TIMESTAMP.sql` - Versioned backup

### Restore to Local Database

Restore vector data to your local development database:

```bash
# Auto-detect mode (merge if data exists, full restore if empty)
./scripts/restore-pgvector.sh

# Force merge mode (replace existing data)
./scripts/restore-pgvector.sh --merge

# Force full mode (standard restore)
./scripts/restore-pgvector.sh --full
```

### Merge to Remote/Cloud Database

Update vector data in a production or cloud database **while preserving all other tables**:

```bash
# Using DATABASE_URL environment variable
DATABASE_URL="postgresql://user:pass@host:port/dbname" ./scripts/merge-pgvector.sh

# Or pass connection string as argument
./scripts/merge-pgvector.sh "postgresql://user:pass@host:port/dbname"
```

**What gets replaced:**

- ✅ `philosopher_text_chunks` table (vector data)

**What gets preserved:**

- ✅ `users` table
- ✅ `conversations` table
- ✅ `conversation_messages` table
- ✅ `magic_links` table

### Common Workflows

#### Workflow 1: Update Production Vector Data

When you've updated or added new philosophical texts locally and want to deploy to production:

```bash
# 1. Index texts locally
bun run rag:index

# 2. Backup vector data
./scripts/backup-pgvector.sh

# 3. Merge to production
./scripts/merge-pgvector.sh "$DATABASE_URL"
```

#### Workflow 2: Publish Pre-loaded Docker Image

Create a Docker image with pre-loaded vector data for fast deployment:

```bash
# 1. Backup vector data
./scripts/backup-pgvector.sh

# 2. Build and publish Docker image
./scripts/publish-pgvector.sh your-dockerhub-username/philosophizer-pgvector:latest

# 3. Deploy the image
```

The published image includes:

- PostgreSQL with pgvector extension
- Database schema
- Pre-loaded vector data

#### Workflow 3: Sync Between Environments

Copy vector data from one environment to another while keeping conversations:

```bash
# 1. Backup from source environment
DATABASE_URL="postgresql://source-db-url" \
  docker compose exec -T postgres pg_dump ... > backup.sql

# 2. Or backup from local
./scripts/backup-pgvector.sh

# 3. Merge to destination
./scripts/merge-pgvector.sh "postgresql://destination-db-url"
```

### Safety Features

All merge operations include:

- **Transaction safety**: Changes are rolled back if any error occurs
- **Confirmation prompts**: Prevents accidental data loss
- **Connection testing**: Validates database access before making changes
- **Statistics reporting**: Shows before/after state of all tables
- **Preserved data verification**: Confirms user/conversation data is intact

## API Endpoints

### Authentication

- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user (requires auth)

### Conversations

- `GET /conversations` - List user's conversations (requires auth)
- `POST /conversations` - Create new conversation (requires auth)
- `GET /conversations/:id` - Get conversation (requires auth)
- `PUT /conversations/:id` - Update conversation (requires auth)
- `DELETE /conversations/:id` - Delete conversation (requires auth)

### AI

- `POST /agent` - Chat with AI agent (requires auth)
- `POST /rag` - Query philosophical texts
- `GET /rag` - Get RAG statistics

### Philosophers

- `GET /api/philosophers` - List all philosophers
- `GET /api/philosophers/:id` - Get philosopher details

## Security Notes

⚠️ **Important for Production:**

1. Change `JWT_SECRET` to a strong random value
2. Use HTTPS in production
3. Set `NODE_ENV=production`
4. Use strong passwords (consider increasing minimum length)
5. Implement rate limiting on auth endpoints
6. Consider using httpOnly cookies instead of localStorage for tokens
7. Regularly backup your PostgreSQL database
