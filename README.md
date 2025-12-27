# Philosophizer

Agentic chat with tools and reasoning, using the wisdom of history's greatest philosophers and theologians.

Built with Bun, React, TypeScript, and ChromaDB for semantic search over primary source texts.

## Technologies Used

- **Runtime**: Bun
- **AI SDK**: Vercel AI SDK v6 (beta)
- **Frontend**: React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Database**: PostgreSQL 16
- **Vector Database**: ChromaDB
- **Authentication**: JWT with bcrypt
- **Markdown**: Streamdown (optimized for streaming AI responses)
- **Validation**: Zod schemas

## Setup

### Prerequisites

- [Bun](https://bun.sh)
- [Docker](https://docker.com)

### Installation

```bash
# Install dependencies
bun install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables to set:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/philosophizer

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# AI Provider
OPENAI_API_KEY=your-openai-api-key

# Optional: ChromaDB (defaults to localhost:8000)
CHROMA_URL=http://localhost:8000
```

See `.env.example` for all available configuration options.

## Database Setup

### PostgreSQL (Required)

Start PostgreSQL with Docker:

```bash
# Start PostgreSQL
bun run postgres

# Setup database schema
bun run db:setup

# View logs
bun run postgres:logs

# Stop PostgreSQL
bun run postgres:stop
```

Or use local PostgreSQL:

```bash
createdb philosophizer
psql -d philosophizer -f src/db/schema.sql
```

### ChromaDB (Vector Database)

Start ChromaDB:

```bash
bun run chroma
```

Stop ChromaDB:

```bash
bun run chroma:stop
```

### ChromaDB Admin UI (Optional)

View and manage your vector database with a web interface:

```bash
# Start the admin UI
bun run chroma:admin

# Open http://localhost:3001 in your browser
# Use http://host.docker.internal:8000 as the connection URL

# Stop the admin UI
bun run chroma:admin:stop
```

## RAG (Retrieval Augmented Generation)

The app includes a collection of primary source philosophical and theological texts that are indexed for semantic search.

### Index Texts

```bash
bun run rag:index
```

### Clear the Index

```bash
bun run rag:clear
```

### RAG API Endpoints

Once the server is running, you can query the vector store via API:

**Query passages:**

```bash
curl -X POST http://localhost:1738/rag \
  -H "Content-Type: application/json" \
  -d '{"query": "What is virtue?", "limit": 5}'
```

With optional filters:

```bash
curl -X POST http://localhost:1738/rag \
  -H "Content-Type: application/json" \
  -d '{"query": "What is virtue?", "philosopher": "aristotle", "limit": 10}'
```

**Get collection stats:**

```bash
curl http://localhost:1738/rag
```

## Conversations API

Save and recall chat conversations (stored in ChromaDB).

**List all conversations:**

```bash
curl http://localhost:1738/conversations
```

**Create a new conversation:**

```bash
curl -X POST http://localhost:1738/conversations \
  -H "Content-Type: application/json" \
  -d '{"title": "Discussion about virtue"}'
```

**Get a conversation with messages:**

```bash
curl http://localhost:1738/conversations/{id}
```

**Update conversation (title or messages):**

```bash
curl -X PUT http://localhost:1738/conversations/{id} \
  -H "Content-Type: application/json" \
  -d '{"title": "New title", "messages": [...]}'
```

**Delete a conversation:**

```bash
curl -X DELETE http://localhost:1738/conversations/{id}
```

## Usage

### Development Mode

```bash
bun run dev
```

### Production Mode

```bash
bun run start
```

### Debug Mode

```bash
bun run dev:debug
```

## Docker Compose

For local production deployment with all services:

```bash
docker compose up -d
```
