## Docker Compose

For production deployment with all services:

```bash
docker compose up -d
```

## Railway Deployment

Deploy to Railway with both the app and ChromaDB vector database.

### Prerequisites

- Railway account (https://railway.app)
- Railway CLI installed: `npm i -g @railway/cli`
- Git repository connected to Railway

### Quick Deploy

1. **Connect your repository to Railway:**

```bash
railway login
railway init
```

2. **Configure environment variables in Railway dashboard:**

Required variables for the `app` service:

- `NODE_ENV=production`
- `CHROMA_URL=http://chroma.railway.internal:8000`
- `AI_BASE_URL` - Your AI provider URL (e.g., `https://api.openai.com/v1`)
- `AI_API_KEY` or `OPENAI_API_KEY` - Your AI API key
- `LLM_MODEL` - Your model name (e.g., `gpt-4o`)
- `SEARCH_MODEL` - Search model (e.g., `gpt-4o-mini`)

Optional embedding configuration:

- `EMBEDDING_BASE_URL` - Defaults to OpenAI
- `EMBEDDING_API_KEY` - Falls back to `OPENAI_API_KEY`
- `EMBEDDING_MODEL` - Embedding model name

3. **Deploy both services:**

```bash
railway up
```

Railway will automatically:

- Deploy the app using the `Dockerfile`
- Deploy ChromaDB with persistent storage
- Configure internal networking between services
- Assign a public URL to your app

4. **Index your philosophical texts (one-time setup):**

After deployment, you'll need to index your texts. You can do this by:

- Using Railway's CLI to run the indexing script in your deployed service
- Or manually uploading a pre-indexed ChromaDB backup

```bash
railway run bun run rag:index
```

### Service Architecture

The Railway deployment includes two services:

1. **app** - The main Bun application (Dockerfile-based)
   - Handles web requests and API endpoints
   - Connects to ChromaDB via internal network
   - Publicly accessible via Railway-provided URL

2. **chroma** - ChromaDB vector database
   - Stores philosophical text embeddings
   - Manages conversation history
   - Persistent volume for data storage
   - Only accessible internally by the app

### Monitoring

View logs and monitor your services:

```bash
railway logs
```

Or use the Railway dashboard for a graphical interface.

### Updating ChromaDB Data

To backup and restore your ChromaDB data:

```bash
railway volumes
railway volumes export <volume-id> chroma-backup.tar.gz
railway volumes import <volume-id> chroma-backup.tar.gz
```

### Troubleshooting

**Connection issues between app and ChromaDB:**

- Verify `CHROMA_URL=http://chroma.railway.internal:8000`
- Check that both services are running in the Railway dashboard

**Indexing failures:**

- Ensure your AI provider credentials are correct
- Verify the embedding model is available
- Check logs: `railway logs --service app`

**ChromaDB data not persisting:**

- Verify the volume is mounted at `/chroma/chroma`
- Check Railway dashboard for volume configuration
