# Philosophizer

Agentic chat with tools and reasoning, using the wisdom of history's greatest philosophers and theologians.

Built with Bun, React, TypeScript, and ChromaDB for semantic search over primary source texts.

## Technologies Used

- **Runtime**: Bun
- **AI SDK**: Vercel AI SDK v6 (beta)
- **Frontend**: React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Vector Database**: ChromaDB
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

Create a `.env` file in the root directory:

```env
# Required: AI Provider Configuration
AI_BASE_URL=http://localhost:1234/v1
AI_API_KEY=lm-studio

# Model Configuration
LLM_MODEL=qwen3-1.7b
SEARCH_MODEL=gpt-4.1-mini

# Optional: ChromaDB (defaults to localhost:8000)
CHROMA_URL=http://localhost:8000
```

## ChromaDB Setup

### Start ChromaDB

```bash
bun run chroma
```

### Stop ChromaDB

```bash
bun run chroma:stop
```

### ChromaDB Admin UI

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

For local production testing with all services:

```bash
docker compose up -d
```

## Deployment

### Oracle Cloud (Always Free)

Deploy for free on Oracle Cloud's Always Free tier (4 OCPUs, 24GB RAM):

**Quick Start:**

1. Create an Oracle Cloud VM (Ubuntu 22.04 ARM64)
2. SSH into your server
3. Run setup: `sudo bash scripts/oracle-deploy/01-server-setup.sh`
4. Configure: `cp scripts/oracle-deploy/env.production.template .env && nano .env`
5. Deploy: `bash scripts/oracle-deploy/02-deploy.sh`

**Complete Guide:** See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed step-by-step instructions including:

- Oracle Cloud account setup
- VM creation and configuration
- Network security setup
- SSH connection guides
- Troubleshooting
- Backup and restore procedures
- Custom domain and SSL setup

**Management:** Use the included scripts for easy maintenance:

```bash
bash scripts/oracle-deploy/manage.sh status   # Check service status
bash scripts/oracle-deploy/manage.sh logs     # View logs
bash scripts/oracle-deploy/manage.sh backup   # Backup data
bash scripts/oracle-deploy/manage.sh restart  # Restart services
```

See [scripts/oracle-deploy/README.md](scripts/oracle-deploy/README.md) for all available commands.

### Other Hosting Options

- **Railway**: Deploy with one click from Git (free $5/month credit)
- **Fly.io**: Free tier with persistent volumes
- **Render**: Free web services (no persistent storage on free tier)
- **Vercel/Netlify + Backend**: Split deployment (frontend on Vercel, backend elsewhere)
