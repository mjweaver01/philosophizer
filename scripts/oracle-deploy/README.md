# Oracle Cloud Deployment Scripts

Automated deployment scripts for hosting Philosophizer on Oracle Cloud's Always Free tier.

## Quick Start

1. **Set up your Oracle Cloud VM** (see [DEPLOYMENT.md](../../docs/DEPLOYMENT.md) for detailed instructions)

2. **SSH into your server:**

   ```bash
   ssh -i ~/.ssh/your-key.key ubuntu@YOUR_VM_IP
   ```

3. **Run the server setup script:**

   ```bash
   sudo bash /opt/philosophizer/scripts/oracle-deploy/01-server-setup.sh
   ```

4. **Configure environment variables:**

   ```bash
   cp scripts/oracle-deploy/env.production.template .env
   nano .env  # Add your API keys
   ```

5. **Deploy the application:**

   ```bash
   bash scripts/oracle-deploy/02-deploy.sh
   ```

6. **Access your app at:** `http://YOUR_VM_IP`

## Files Overview

### 01-server-setup.sh

Initial server configuration script that:

- Updates system packages
- Installs Docker and Docker Compose
- Configures UFW firewall
- Sets up swap space
- Creates deployment directories

**Usage:**

```bash
sudo bash 01-server-setup.sh
```

**Run once:** Only needed when setting up a new server.

### 02-deploy.sh

Application deployment script that:

- Validates environment configuration
- Builds Docker images
- Starts all services (Nginx, App, ChromaDB)
- Performs health checks

**Usage:**

```bash
bash 02-deploy.sh              # Initial deployment
bash 02-deploy.sh --update     # Update deployment
```

### manage.sh

Management script for common operations.

**Usage:**

```bash
bash manage.sh <command>
```

**Commands:**

- `status` - Show status of all services
- `logs` - Follow logs from all services
- `restart` - Restart all services
- `stop` - Stop all services
- `start` - Start all services
- `backup` - Backup ChromaDB data
- `restore <file>` - Restore ChromaDB data from backup
- `stats` - Show resource usage statistics
- `shell [service]` - Open shell in container (default: app)
- `index` - Run RAG indexing

**Examples:**

```bash
bash manage.sh status
bash manage.sh logs
bash manage.sh backup
bash manage.sh restore chroma-backup-20241221-140000.tar.gz
```

### env.production.template

Template for production environment variables.

**Copy and configure:**

```bash
cp env.production.template .env
nano .env  # Add your API keys
```

**Required variables:**

- `AI_API_KEY` - OpenAI or compatible LLM API key
- `OPENAI_API_KEY` - Same as AI_API_KEY
- `EMBEDDING_API_KEY` - Embedding service API key
- `LLM_MODEL` - Model to use (e.g., gpt-4o)
- `EMBEDDING_MODEL` - Embedding model (e.g., text-embedding-3-small)

### nginx.conf

Nginx reverse proxy configuration that:

- Routes traffic to the Bun application
- Adds security headers
- Enables gzip compression
- Handles WebSocket connections
- Provides health check endpoint

**No editing needed** unless you want to customize settings.

### docker-compose.production.yml

Production Docker Compose configuration with:

- **ChromaDB**: Vector database (4GB RAM limit)
- **Philosophizer App**: Bun application (2GB RAM limit)
- **Nginx**: Reverse proxy (256MB RAM limit)

**Features:**

- Resource limits for stability
- Automatic restarts
- Health checks
- Persistent volumes

## Architecture

```
Internet → Port 80 → Nginx → Philosophizer App (Port 1738) → ChromaDB (Port 8000)
                                                            ↓
                                                     Persistent Volume
```

## Complete Deployment Guide

For detailed step-by-step instructions including:

- Oracle Cloud account setup
- VM creation with screenshots
- Network security configuration
- SSH connection guides for all platforms
- Troubleshooting common issues
- Backup and restore procedures
- Custom domain and SSL setup

See **[docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md)**

## Resource Usage

With the default configuration on a 4 OCPU, 24GB RAM ARM instance:

| Service            | Memory Limit | CPU Priority |
| ------------------ | ------------ | ------------ |
| ChromaDB           | 4 GB         | Normal       |
| Philosophizer App  | 2 GB         | Normal       |
| Nginx              | 256 MB       | Low          |
| **Total Reserved** | **~6.25 GB** | -            |
| Available for OS   | ~17.75 GB    | -            |

This leaves plenty of headroom for the operating system and temporary spikes.

## Monitoring

### View All Service Logs

```bash
bash manage.sh logs
```

### Check Service Status

```bash
bash manage.sh status
```

### Monitor Resource Usage

```bash
bash manage.sh stats
```

### Real-time System Monitor

```bash
htop
```

## Maintenance

### Update Application

```bash
cd /opt/philosophizer
git pull
bash scripts/oracle-deploy/02-deploy.sh --update
```

### Restart Services

```bash
bash scripts/oracle-deploy/manage.sh restart
```

### Backup ChromaDB Data

```bash
bash scripts/oracle-deploy/manage.sh backup
```

Backups are stored in `/opt/philosophizer/backups/`

### Restore ChromaDB Data

```bash
bash scripts/oracle-deploy/manage.sh restore chroma-backup-YYYYMMDD-HHMMSS.tar.gz
```

## Troubleshooting

### Services won't start

```bash
docker compose -f scripts/oracle-deploy/docker-compose.production.yml logs
```

### Out of memory

```bash
free -h
docker stats
```

### Can't access via browser

1. Check Security List in Oracle Cloud Console (ports 80, 443)
2. Check UFW firewall: `sudo ufw status`
3. Check Nginx logs: `docker logs philosophizer-nginx`

### Database connection issues

```bash
docker exec philosophizer-chroma curl http://localhost:8000/api/v1/heartbeat
```

For more troubleshooting, see [docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md#troubleshooting)

## Security Notes

- All services run in isolated Docker containers
- Nginx acts as a reverse proxy (no direct app access)
- UFW firewall only allows necessary ports
- Non-root user for application container
- Security headers automatically added by Nginx

## Support

For issues or questions:

1. Check [docs/DEPLOYMENT.md](../../docs/DEPLOYMENT.md)
2. Review logs: `bash manage.sh logs`
3. Check system resources: `bash manage.sh stats`

---

**Enjoy your free, production-ready Philosophizer deployment on Oracle Cloud! 🚀**
