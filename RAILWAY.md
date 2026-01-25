# Railway Deployment Guide

This guide walks you through deploying Philosophizer on Railway using your custom PostgreSQL Docker image.

## Quick Start Summary

1. Create a Railway project
2. Deploy PostgreSQL service using your Docker Hub image (`mjweaver01/philosophizer-pgv-hqe:latest`)
3. Deploy Ollama service (`ollama/ollama:latest`) and pull nomic-embed-text model
4. Deploy your app from GitHub repository
5. Configure environment variables to connect all services
6. Access your app via the generated Railway URL

**Deployment time**: ~15 minutes (includes one-time model download)

## Overview

Railway doesn't use docker-compose, so we'll deploy three separate services:
1. **PostgreSQL Service** - Using your custom `mjweaver01/philosophizer-pgv-hqe:latest` image
2. **Ollama Service** - Hosting the `nomic-embed-text-v1.5` embedding model
3. **App Service** - The main Bun application

### Service Architecture

```
┌─────────────────┐
│   Railway URL   │ (Public)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   App Service   │ (Bun)
│   Port: 1738    │
└────┬───────┬────┘
     │       │
     │       │ (Internal Network)
     │       │
     ▼       ▼
┌─────────┐ ┌──────────────┐
│ Postgres│ │    Ollama    │
│ +vector │ │ nomic-embed  │
│ :5432   │ │ :11434       │
└─────────┘ └──────────────┘
(Volume)      (Volume)
```

## Prerequisites

- Railway account (https://railway.app)
- Railway CLI (optional but recommended): `npm i -g @railway/cli`
- Your custom PostgreSQL image on Docker Hub: `mjweaver01/philosophizer-pgv-hqe:latest`

## Important: Embedding Model Consistency

**Critical**: Your PostgreSQL image contains vectors that were created using `nomic-embed-text-v1.5`. You **must** use the exact same model for querying, otherwise semantic search won't work correctly. This guide uses Ollama which is proven reliable for hosting local embedding models.

### Why Ollama?

✅ **Reliable**: Battle-tested and widely used for self-hosted LLMs  
✅ **Simple**: Easy model management with `ollama pull` and `ollama list`  
✅ **OpenAI-compatible API**: Works with your existing code  
✅ **Persistent storage**: Models stay downloaded across deployments (with volume)  
✅ **Good documentation**: Large community and excellent support  

## Step 1: Create a New Railway Project

1. Go to https://railway.app/new
2. Click "Empty Project"
3. Give your project a name (e.g., "Philosophizer")

## Step 2: Deploy PostgreSQL Service

### 2.1 Create PostgreSQL Service from Docker Image

1. In your Railway project, click **"+ New"**
2. Select **"Empty Service"**
3. Name it "postgres"
4. Click on the service, go to **"Settings"** tab
5. Under **"Source"**, change from GitHub to **"Docker Image"**
6. Enter your Docker image: `mjweaver01/philosophizer-pgv-hqe:latest`

### 2.2 Configure PostgreSQL Environment Variables

In the postgres service, go to **"Variables"** tab and add:

```
POSTGRES_DB=philosophizer
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<generate-secure-password>
```

**Important**: Generate a secure password! You can use:
```bash
openssl rand -base64 32
```

### 2.3 Expose PostgreSQL Port (if needed for external access)

1. Go to **"Settings"** tab
2. Under **"Networking"**, click **"Public Networking"**
3. Railway will assign a public TCP endpoint (optional - only needed if you want external access)

### 2.4 Add PostgreSQL Volume (for data persistence)

1. Go to **"Settings"** tab
2. Under **"Volumes"**, click **"Add Volume"**
3. Mount Path: `/var/lib/postgresql/data`
4. This ensures your database persists across deployments

## Step 3: Deploy Ollama Embedding Service

Since your PostgreSQL data was embedded using `nomic-embed-text-v1.5`, you need to use the same model for queries. We'll use Ollama which is reliable and well-supported.

### 3.1 Create Ollama Service from Docker Image

1. In your Railway project, click **"+ New"**
2. Select **"Empty Service"**
3. Name it "ollama"
4. Click on the service, go to **"Settings"** tab
5. Under **"Source"**, change to **"Docker Image"**
6. Enter: `ollama/ollama:latest`

### 3.2 Add Ollama Volume (REQUIRED)

The volume stores downloaded models persistently:

1. Go to **"Settings"** tab
2. Under **"Volumes"**, click **"Add Volume"**
3. Mount Path: `/root/.ollama`
4. Click **"Add"**

Without this volume, you'll need to re-download the model on every deployment!

### 3.3 Wait for Service to Deploy

The Ollama service will start successfully, but it won't have the model yet. Wait for the deployment to complete.

### 3.4 Pull the Model Using Public URL

The Railway CLI method doesn't work reliably for this, so we'll use the public API instead.

**Step 1: Enable Public Networking**

1. Go to your **ollama** service in Railway dashboard
2. Click **"Settings"** → **"Networking"**
3. Click **"Public Networking"** → **"Add a Public Domain"**
4. When asked for port, enter: `11434`
5. Copy the generated URL (e.g., `ollama-production-b069.up.railway.app`)

**Step 2: Pull the Model**

```bash
curl -X POST https://your-ollama-url.up.railway.app/api/pull \
  -H "Content-Type: application/json" \
  -d '{"name": "nomic-embed-text:v1.5"}'
```

Replace `your-ollama-url.up.railway.app` with your actual URL.

This will take 1-2 minutes to download the model (~274 MB). You'll see progress output:
```json
{"status":"pulling manifest"}
{"status":"downloading...","completed":xxx,"total":xxx}
```

**Step 3: Verify the Model Downloaded**

```bash
curl https://your-ollama-url.up.railway.app/api/tags
```

You should see `nomic-embed-text:v1.5` in the models list.

**Step 4: Disable Public Networking**

Once verified, go back to **Settings** → **Networking** and remove the public domain for security.

### 3.5 Configure Resources (Optional)

Ollama with nomic-embed-text is lightweight:
- **Recommended**: 2GB RAM minimum
- **CPU**: 1 vCPU is sufficient
- **No GPU needed**: CPU inference works well for this model

Go to **"Settings"** → **"Resources"** to adjust if needed.

## Step 4: Deploy the Main Application

### 3.1 Create App Service from GitHub

1. Click **"+ New"** in your project
2. Select **"GitHub Repo"**
3. Connect and select your `philosophizer` repository
4. Railway will auto-detect the Dockerfile and start building

### 4.2 Configure Application Environment Variables

In the app service, go to **"Variables"** tab and add these variables:

#### Database Configuration

**Get the connection string from your postgres service:**

1. Go to your **postgres service** in Railway
2. Go to **"Connect"** tab
3. Look for **"Private Network URL"** or **"DATABASE_PRIVATE_URL"**
4. Copy the full connection string (it looks like: `postgresql://postgres:password@postgres.railway.internal:5432/philosophizer`)

Then in your **app service**, set:
```
DATABASE_URL=postgresql://postgres:postgres@postgres.railway.internal:5432/philosophizer
```

**Important**: 
- Use the **internal** domain (ends with `.railway.internal`), not the public one
- The format is: `postgresql://username:password@host:5432/database`
- Replace with your actual postgres password if you changed it

#### Server Configuration
```
PORT=1738
NODE_ENV=production
HOSTNAME=0.0.0.0
```

**Important**: `HOSTNAME=0.0.0.0` is required for Railway to access your app. Without this, you'll get a 502 error because the app only listens on localhost.

#### JWT Configuration
```
JWT_SECRET=<generate-secure-secret>
JWT_EXPIRES_IN=7d
```

Generate a secure JWT secret:
```bash
openssl rand -base64 32
```

#### Admin Configuration
```
ADMIN_EMAILS=your-email@example.com
```

#### LLM Configuration (OpenAI)
```
OPENAI_API_KEY=<your-openai-api-key>
LLM_MODEL=gpt-4o
SEARCH_MODEL=gpt-4o
```

Or if using Anthropic:
```
ANTHROPIC_API_KEY=<your-anthropic-api-key>
LLM_MODEL=claude-3-5-sonnet-20241022
SEARCH_MODEL=claude-3-5-sonnet-20241022
```

#### Embedding Configuration (Required)

**Important**: Use the same model that was used to create the vectors in PostgreSQL.

**Get the Ollama service internal URL:**

1. Go to your **ollama service** in Railway
2. Go to **"Settings"** → **"Networking"**
3. Copy the **"Private Networking"** domain (e.g., `ollama.railway.internal`)

Then in your **app service**, set:
```
EMBEDDING_BASE_URL=http://ollama.railway.internal:11434/v1
EMBEDDING_API_KEY=ollama
EMBEDDING_MODEL=nomic-embed-text:v1.5
```

**Notes**: 
- Ollama exposes an OpenAI-compatible API at `/v1/embeddings`
- Port 11434 is Ollama's default port
- The API key can be any value (no authentication required)
- Use the internal `.railway.internal` domain for free service-to-service communication

### 4.3 Configure Service Settings

1. Go to **"Settings"** tab
2. Under **"Networking"**:
   - Enable **"Public Networking"**
   - Railway will generate a public URL (e.g., `https://philosophizer.up.railway.app`)
3. Under **"Deploy"**:
   - Ensure **"Dockerfile Path"** is set to `Dockerfile` (should be auto-detected)

### 4.4 Set Service Dependencies (Important!)

1. In the app service, go to **"Settings"** tab
2. Under **"Service Dependencies"**, add both:
   - `postgres` service
   - `ollama` service
3. This ensures PostgreSQL and Ollama start before the app

## Step 5: Deploy & Verify

### 5.1 Trigger Deployment

Railway should automatically deploy after configuration. If not:
1. Go to the app service
2. Click **"Deploy"** or **"Redeploy"**

### 5.2 Monitor Logs

1. Click on the app service
2. Go to **"Deployments"** tab
3. Click on the latest deployment to view logs
4. Look for successful startup messages

### 5.3 Check Database Connection

In the logs, you should see:
```
✅ Database connected successfully
```

### 5.4 Verify Ollama Service

Before accessing the app, verify Ollama is working.

**Check the model is downloaded** (if public networking is still enabled):
```bash
curl https://your-ollama-url.up.railway.app/api/tags
```

You should see `nomic-embed-text:v1.5` in the models list.

**Test the embeddings API** (optional - if public networking is enabled):
```bash
curl -X POST https://your-ollama-url.up.railway.app/v1/embeddings \
  -H "Content-Type: application/json" \
  -d '{"model": "nomic-embed-text:v1.5", "input": "hello world"}'
```

You should receive a JSON response with an embedding vector.

**Remember to disable public networking** after verification for security!

### 5.5 Access Your Application

1. Go to app service **"Settings"** → **"Networking"**
2. Click on the generated Railway URL (e.g., `https://philosophizer.up.railway.app`)
3. Test the semantic search functionality to ensure embeddings are working

## Step 6: Custom Domain (Optional)

1. In the app service, go to **"Settings"** tab
2. Under **"Domains"**, click **"Custom Domain"**
3. Add your domain (e.g., `philosophizer.com`)
4. Update your DNS records as instructed by Railway

## Environment Variables Reference

Here's a complete template for your app service variables:

```bash
# Database (get this from postgres service "Connect" tab)
DATABASE_URL=postgresql://postgres:postgres@postgres.railway.internal:5432/philosophizer

# Server
PORT=1738
NODE_ENV=production
HOSTNAME=0.0.0.0

# JWT
JWT_SECRET=<your-generated-secret>
JWT_EXPIRES_IN=7d

# Admin
ADMIN_EMAILS=your-email@example.com

# LLM (choose one)
# OpenAI:
OPENAI_API_KEY=sk-...
LLM_MODEL=gpt-4o
SEARCH_MODEL=gpt-4o

# OR Anthropic:
# ANTHROPIC_API_KEY=sk-ant-...
# LLM_MODEL=claude-3-5-sonnet-20241022
# SEARCH_MODEL=claude-3-5-sonnet-20241022

# Embeddings (REQUIRED - using Ollama service)
# Get the internal domain from ollama service networking settings
EMBEDDING_BASE_URL=http://ollama.railway.internal:11434/v1
EMBEDDING_API_KEY=ollama
EMBEDDING_MODEL=nomic-embed-text:v1.5
```

## Important Notes

### Railway-Specific Considerations

1. **Internal Networking**: Use `${{postgres.PRIVATE_DOMAIN}}` for internal service-to-service communication (faster and free)
2. **Volumes are Essential**: PostgreSQL MUST have a volume mounted or data will be lost on redeployment
3. **No Docker Compose**: Each service is deployed independently
4. **Auto-Deploy**: Railway auto-deploys on git push by default (can be disabled in settings)
5. **Build Minutes**: Free tier has 500 build hours/month; monitor your usage

### Database Backup

Your PostgreSQL image comes pre-loaded with data, but you should still:

1. **Enable Railway Backups** (if available in your plan)
2. **Manual Backups**: Use the admin panel backup features in the app
3. **External Backups**: Periodically export data using the backup scripts

### Secrets Management

**Never commit these to git:**
- `.env` file (already in `.gitignore`)
- All secrets should be in Railway's Variables tab
- Generate new secrets for production (don't reuse local dev secrets)

## Troubleshooting

### App Can't Connect to Database

**Check:**
1. DATABASE_URL uses `${{postgres.PRIVATE_DOMAIN}}` not `localhost`
2. Service dependency is set correctly (app depends on postgres)
3. PostgreSQL service is running (check its logs)
4. Credentials match between services

### PostgreSQL Image Not Starting

**Check:**
1. Image name is correct: `mjweaver01/philosophizer-pgv-hqe:latest`
2. Image is public on Docker Hub
3. Check PostgreSQL logs for initialization errors
4. Ensure volume is mounted to `/var/lib/postgresql/data`

### Ollama Service Issues

**Service starts but model not found:**
1. Enable public networking on ollama service (port 11434)
2. Check if model was downloaded: `curl https://your-ollama-url.up.railway.app/api/tags`
3. If not listed, pull it: `curl -X POST https://your-ollama-url.up.railway.app/api/pull -H "Content-Type: application/json" -d '{"name": "nomic-embed-text:v1.5"}'`
4. Verify volume is mounted to `/root/.ollama`
5. Check service has enough memory (2GB recommended)

**Model keeps disappearing after redeploy:**
- Volume is NOT mounted! Go to Settings → Volumes → Add `/root/.ollama`
- Without volume, models are lost on every deployment

**Embedding errors in app:**
1. Get internal domain from ollama service → Settings → Networking → Private Networking
2. Verify EMBEDDING_BASE_URL: `http://ollama.railway.internal:11434/v1`
3. Check EMBEDDING_MODEL matches exactly: `nomic-embed-text:v1.5`
4. Ensure app service has dependency on ollama service
5. Test endpoint manually with curl (see verification section)

### Build Failures

**Check:**
1. Dockerfile exists and is valid
2. All dependencies can be installed
3. Check build logs for specific errors

### App Returns 502 Bad Gateway

**Most common cause**: App is binding to localhost instead of 0.0.0.0

**Fix:**
1. Add environment variable: `HOSTNAME=0.0.0.0`
2. Redeploy the app service
3. Railway's proxy needs to access the app on all interfaces

**Other checks:**
1. Verify app service is running (check logs)
2. Look for startup errors in deployment logs
3. Ensure PORT is set to 1738
4. Check that database and embeddings services are healthy

### App Starts but Returns Errors

**Check:**
1. Environment variables are set correctly
2. PORT is set to 1738
3. NODE_ENV is set to production
4. HOSTNAME is set to 0.0.0.0
5. Check app logs for specific errors

### First-Time Deployment Issues

**"Cannot connect to database"**
- Get DATABASE_URL from postgres service → "Connect" tab → "Private Network URL"
- Use the internal domain (ends with `.railway.internal`)
- Format: `postgresql://postgres:password@postgres.railway.internal:5432/philosophizer`
- Check postgres service is running
- Verify credentials match (username, password, database name)

**"Embedding model not found"**
- Enable public networking on ollama service temporarily
- Pull the model via curl: `curl -X POST https://your-ollama-url.up.railway.app/api/pull -H "Content-Type: application/json" -d '{"name": "nomic-embed-text:v1.5"}'`
- Verify model exists: `curl https://your-ollama-url.up.railway.app/api/tags`
- Check EMBEDDING_MODEL is exactly: `nomic-embed-text:v1.5`
- Verify EMBEDDING_BASE_URL: `http://ollama.railway.internal:11434/v1`
- Ensure volume is mounted to `/root/.ollama`
- Disable public networking after model is downloaded

**"Volume data lost after redeploy"**
- Ensure volumes are created in **Settings** → **Volumes**
- Check mount paths are correct
- Volumes persist across deploys unless manually deleted

## Updating Your Deployment

### Update PostgreSQL Image

If you push a new version of your PostgreSQL image to Docker Hub:

1. Go to postgres service → **"Settings"**
2. Under **"Source"**, the image should be `mjweaver01/philosophizer-pgv-hqe:latest`
3. Click **"Redeploy"** to pull the latest version
4. **Warning**: This won't affect existing data in the volume

### Update Ollama Model

If you need to update or change the embedding model:

1. **Warning**: Changing the model will break existing embeddings!
2. You would need to re-index all data in PostgreSQL with the new model
3. To update the same model version:
   - Enable public networking on ollama service
   - Run: `curl -X POST https://your-ollama-url.up.railway.app/api/pull -H "Content-Type: application/json" -d '{"name": "nomic-embed-text:v1.5"}'`
   - Disable public networking
4. To use a different model:
   - Pull it via curl with the new model name
   - Update EMBEDDING_MODEL in app service variables
   - Re-index all PostgreSQL data with the new model

### Update Application Code

Simply push to your GitHub repository:
```bash
git add .
git commit -m "Update application"
git push
```

Railway will automatically build and deploy the new version.

### Rolling Back

1. Go to app service → **"Deployments"**
2. Find a previous successful deployment
3. Click the three dots → **"Redeploy"**

## Cost Estimation

Railway pricing (as of 2025):
- **Trial**: $5 credit (no subscription required)
- **Hobby Plan**: $5/month subscription + $0.000231/GB-hour for memory + $0.000463/vCPU-hour
- **Pro Plan**: $20/month subscription + usage-based pricing
- **Egress**: Included in hobby plan; Pro plan gets more

### Estimated Monthly Cost for Philosophizer

**Hobby Plan (recommended for personal/small projects):**
- PostgreSQL: ~$5-10 (1GB RAM, mostly idle)
- Ollama: ~$5-10 (2GB RAM, sporadic usage)
- App: ~$3-8 (512MB-1GB RAM, depends on traffic)
- **Subscription**: $5/month
- **Total**: ~$18-33/month

**Pro Plan (for production/higher traffic):**
- Better resource guarantees
- More egress included
- Priority support
- **Total**: ~$30-50/month + usage

### Free Trial Option

Railway offers $5 in trial credits:
- No credit card required initially
- Good for testing deployment
- Credits last ~1-2 weeks of continuous running
- Upgrade to hobby plan when ready

### Cost Optimization Tips

1. **Use internal networking**: Free communication between services
2. **Optimize queries**: Reduce database load
3. **Cache embeddings**: Store frequently used embeddings if possible
4. **Monitor usage**: Check Railway dashboard regularly
5. **Idle services**: Consider pausing dev environments when not in use

## Post-Deployment Steps

### 1. Test Semantic Search

After deployment, test that embeddings are working:
1. Create an account on your deployed app
2. Try searching for philosophical concepts
3. Verify that relevant results are returned

### 2. Verify Ollama Service (Security)

The Ollama service should only be accessible internally:
1. Go to ollama service → **"Settings"**
2. Under **"Networking"**, ensure **"Public Networking"** is disabled
3. The app accesses it via internal domain (e.g., `ollama.railway.internal`)
4. Model persists in the volume at `/root/.ollama`

**Note:** Only enable public networking temporarily if you need to pull new models or troubleshoot.

### 3. Monitor Resource Usage

Check your usage in Railway dashboard:
- Services should idle at low resource usage
- Ollama will spike when processing embeddings (~30-50ms per request)
- PostgreSQL should remain relatively constant
- Ollama keeps model in memory, so base memory usage ~500-800MB

### 4. Set Up Alerts (Optional)

Railway Pro plan offers:
- Usage alerts
- Deployment notifications
- Error tracking integration

## Performance Optimization

### Ollama Embedding Performance

- **Model stays loaded**: Ollama keeps the model in memory after first use
- **Fast inference**: CPU inference is quick for this lightweight model (~30-50ms per request)
- **Low memory**: Base usage ~500-800MB with model loaded
- **Cold starts**: First request after idle may take 1-2 seconds to load model
- **Persistent models**: With volume, models survive deployments

### Database Performance

- Your pgvector HNSW index is already optimized
- Monitor query performance in app logs
- Consider connection pooling for high traffic

### App Performance

- Railway auto-sleeps services on free tier (wakes in ~1 second)
- Consider keeping services "awake" on hobby/pro tier for better UX

## Advanced Configuration

### Horizontal Scaling

If you need to scale:
1. Go to app service → **"Settings"**
2. Under **"Replicas"**, increase the count
3. Note: PostgreSQL and Ollama should remain single-instance

### Health Checks

Railway uses the `HEALTHCHECK` in your Dockerfile automatically.

### Custom Start Command

If needed, override in **"Settings"** → **"Deploy"** → **"Start Command"**

### Resource Limits

Recommended minimum resources:
- **PostgreSQL**: 1GB RAM, 1 vCPU
- **Ollama**: 2GB RAM, 1 vCPU (model is ~274 MB, needs overhead)
- **App**: 512MB RAM, 0.5 vCPU

## Why Railway for This Project?

### Advantages

✅ **Docker Support**: Native support for custom Docker images (your PostgreSQL image)  
✅ **Service References**: Easy internal networking with `${{service.VARIABLE}}`  
✅ **Persistent Volumes**: Simple volume management for PostgreSQL and Ollama  
✅ **Auto Deploy**: Git push triggers automatic deployment  
✅ **No Config Files**: No need for kubernetes manifests or complex configs  
✅ **Developer Friendly**: Clean UI, good documentation, helpful CLI  

### Alternatives Comparison

| Platform | Docker Images | Volumes | Internal Network | Est. Cost |
|----------|--------------|---------|------------------|-----------|
| **Railway** | ✅ Excellent | ✅ Simple | ✅ Auto | $18-33/mo |
| Render | ✅ Good | ⚠️ Paid disk | ✅ Auto | $21-35/mo |
| Fly.io | ✅ Excellent | ✅ Good | ⚠️ Manual | $15-30/mo |
| Heroku | ⚠️ Buildpacks | ❌ Addon only | ✅ Auto | $25-50/mo |
| DigitalOcean | ✅ K8s only | ✅ Good | ⚠️ Manual | $20-40/mo |

Railway wins for this project due to:
- **Easy Docker Hub image deployment**: Both your custom PostgreSQL and official Nomic images work perfectly
- **Simple volume management**: PostgreSQL data persists across deploys
- **Automatic internal networking**: Services communicate via `${{service.VARIABLE}}` references
- **No complex configuration needed**: No Kubernetes manifests, no manual networking setup
- **Fast deployment**: Pre-built images mean quick startup times

## Useful Railway CLI Commands

Once you have the Railway CLI installed and linked to your project:

```bash
# Link to your project
railway link

# View logs for a specific service
railway logs --service app
railway logs --service postgres
railway logs --service ollama

# Execute commands in a service
railway run --service ollama ollama list
railway run --service postgres psql -U postgres -d philosophizer

# Check service status
railway status

# Open project in browser
railway open

# Set environment variables
railway variables set KEY=value --service app

# Deploy specific service
railway up --service app

# SSH into a service (for debugging)
railway shell --service app
```

## Monitoring & Debugging Tips

### View Real-Time Logs

```bash
# Follow logs for all services
railway logs -f

# Follow logs for specific service
railway logs -f --service app
```

### Check Service Metrics

1. Go to Railway dashboard
2. Click on any service
3. View **Metrics** tab for CPU, Memory, Network usage

### Test Database Connection

```bash
# Connect to PostgreSQL directly
railway run --service postgres psql -U postgres -d philosophizer

# Run a test query
railway run --service postgres psql -U postgres -d philosophizer -c "SELECT COUNT(*) FROM philosopher_text_chunks;"
```

### Test Ollama Service

To interact with Ollama, enable public networking temporarily:

```bash
# List downloaded models
curl https://your-ollama-url.up.railway.app/api/tags

# Test embeddings API
curl -X POST https://your-ollama-url.up.railway.app/v1/embeddings \
  -H "Content-Type: application/json" \
  -d '{"model": "nomic-embed-text:v1.5", "input": "test"}'

# Pull a model (if needed)
curl -X POST https://your-ollama-url.up.railway.app/api/pull \
  -H "Content-Type: application/json" \
  -d '{"name": "nomic-embed-text:v1.5"}'
```

**Remember to disable public networking after testing!**

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway CLI Docs: https://docs.railway.app/develop/cli
- Project Issues: Check your app logs first

## Next Steps After Successful Deployment

Once your app is deployed and running:

### 1. Create Admin Account
- Visit your Railway URL
- Sign up with the email you set in `ADMIN_EMAILS`
- You'll have admin access to the admin panel

### 2. Test Core Features
- **Authentication**: Create account, login, logout
- **Chat**: Start a conversation with a philosopher
- **Search**: Test semantic search functionality
- **Admin Panel**: Access `/admin` to view system stats

### 3. Configure Custom Domain (Optional)
See [Step 6: Custom Domain](#step-6-custom-domain-optional)

### 4. Set Up Monitoring
- Bookmark your Railway project dashboard
- Enable notifications for deployments
- Set up error tracking (Sentry, etc.)

### 5. Optimize Performance
- Monitor initial response times
- Check database query performance in logs
- Adjust resource limits if needed

### 6. Backup Strategy
- Test the backup functionality in admin panel
- Set up automated backups (GitHub Actions workflow)
- Store backups externally (S3, Google Drive, etc.)

### 7. Security Hardening
- Disable Ollama public networking
- Rotate JWT_SECRET periodically
- Review database access logs
- Set up rate limiting (if needed)

## Deployment Checklist

Use this checklist to ensure everything is configured correctly:

### PostgreSQL Service
- [ ] Service created with Docker image: `mjweaver01/philosophizer-pgv-hqe:latest`
- [ ] Environment variables set (POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD)
- [ ] Volume mounted to `/var/lib/postgresql/data`
- [ ] Service is running and healthy

### Ollama Service
- [ ] Service created with Docker image: `ollama/ollama:latest`
- [ ] Volume mounted to `/root/.ollama`
- [ ] Public networking enabled temporarily (port 11434)
- [ ] Model `nomic-embed-text:v1.5` downloaded via curl API
- [ ] Model verified with `curl https://your-ollama-url.up.railway.app/api/tags`
- [ ] Public networking disabled after model download (security)

### App Service
- [ ] Connected to GitHub repository
- [ ] All environment variables configured:
  - [ ] DATABASE_URL (using postgres service reference)
  - [ ] JWT_SECRET (secure, generated)
  - [ ] OPENAI_API_KEY or ANTHROPIC_API_KEY
  - [ ] EMBEDDING_BASE_URL (using ollama service internal domain with port 11434)
  - [ ] EMBEDDING_MODEL set to `nomic-embed-text:v1.5`
  - [ ] ADMIN_EMAILS set
  - [ ] HOSTNAME set to `0.0.0.0` (required for Railway access)
  - [ ] PORT set to `1738`
  - [ ] NODE_ENV set to `production`
- [ ] Service dependencies added (postgres, ollama)
- [ ] Public networking enabled
- [ ] Deployment successful

### Post-Deployment
- [ ] App accessible via Railway URL
- [ ] Can create account / login
- [ ] Semantic search returns results
- [ ] Database connection working
- [ ] No errors in logs

## Quick Reference

### Docker Images Used

| Service | Image | Size | Notes |
|---------|-------|------|-------|
| PostgreSQL | `mjweaver01/philosophizer-pgv-hqe:latest` | Custom | Pre-loaded with vector data |
| Ollama | `ollama/ollama:latest` | ~1GB | Requires model pull after deploy |
| App | Built from GitHub | Varies | Bun application |

### Key Ports

| Service | Port | Access |
|---------|------|--------|
| PostgreSQL | 5432 | Internal only |
| Ollama | 11434 | Internal only |
| App | 1738 | Public (via Railway URL) |

### Critical Environment Variables

```bash
# Server configuration (REQUIRED for Railway)
HOSTNAME=0.0.0.0
PORT=1738
NODE_ENV=production

# Database (get from postgres service "Connect" tab)
DATABASE_URL=postgresql://postgres:postgres@postgres.railway.internal:5432/philosophizer

# Embeddings (get internal domain from ollama service networking)
EMBEDDING_BASE_URL=http://ollama.railway.internal:11434/v1
EMBEDDING_MODEL=nomic-embed-text:v1.5
```

### Service Dependencies

```
app
├── depends on: postgres
└── depends on: ollama
```

---

**Ready to deploy?** Start with Step 1 and follow the guide sequentially!
