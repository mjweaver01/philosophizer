# Oracle Cloud Deployment Guide

Complete guide to deploying the Philosophizer application on Oracle Cloud's Always Free tier.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Oracle Cloud Account Setup](#oracle-cloud-account-setup)
4. [Creating Your VM Instance](#creating-your-vm-instance)
5. [Configuring Network Security](#configuring-network-security)
6. [Connecting to Your Server](#connecting-to-your-server)
7. [Deploying the Application](#deploying-the-application)
8. [Post-Deployment Configuration](#post-deployment-configuration)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [Troubleshooting](#troubleshooting)
11. [Backup and Restore](#backup-and-restore)

---

## Overview

This guide will help you deploy Philosophizer on Oracle Cloud's Always Free tier, which includes:

- **2 AMD-based Compute VMs** OR **4 ARM-based Compute VMs** (24GB RAM total)
- **200 GB Block Volume storage**
- **10 TB outbound data transfer per month**
- **Free forever** - no credit card charges

We'll use a single ARM-based VM with 4 OCPUs and 24GB RAM, which is powerful enough to run:

- Philosophizer Bun application
- ChromaDB vector database
- Nginx reverse proxy

---

## Prerequisites

Before starting, ensure you have:

- [ ] Oracle Cloud account (free tier)
- [ ] Your API keys for:
  - OpenAI or compatible LLM provider
  - Embedding service (if different from LLM provider)
- [ ] SSH client installed on your computer
  - **macOS/Linux**: Built-in terminal
  - **Windows**: Use PowerShell, PuTTY, or Windows Terminal
- [ ] Git repository for your code (GitHub, GitLab, etc.) - optional but recommended

---

## Oracle Cloud Account Setup

### Step 1: Create Your Oracle Cloud Account

1. Go to [https://www.oracle.com/cloud/free/](https://www.oracle.com/cloud/free/)
2. Click "Start for free"
3. Fill in your information:
   - Email address
   - Country/Territory
   - First and Last name
4. Verify your email address
5. Complete the account setup:
   - You'll need to provide a credit card for identity verification
   - **Important**: You won't be charged unless you explicitly upgrade to paid services
6. Choose your home region (this cannot be changed later)
   - Pick a region close to your target users
   - US regions: Phoenix, Ashburn, San Jose
   - Europe: Frankfurt, London, Amsterdam
   - Asia Pacific: Tokyo, Seoul, Mumbai

### Step 2: Access the Console

1. Go to [https://cloud.oracle.com/](https://cloud.oracle.com/)
2. Click "Sign in to Cloud"
3. Enter your Cloud Account Name (provided during signup)
4. Sign in with your credentials

---

## Creating Your VM Instance

### Step 1: Navigate to Compute Instances

1. In the Oracle Cloud Console, open the **Navigation Menu** (☰ hamburger icon)
2. Go to **Compute** → **Instances**
3. Click **Create Instance**

### Step 2: Configure Instance Details

**Name Your Instance:**

```
philosophizer-prod
```

**Placement:**

- Leave default (Oracle will choose optimal placement)

**Image and Shape:**

1. Click **Edit** next to "Image and shape"

2. **Choose Image:**
   - Click "Change Image"
   - Select **Ubuntu 22.04**
   - Choose **Canonical Ubuntu 22.04** (ARM64)
   - Click "Select Image"

3. **Choose Shape:**
   - Click "Change Shape"
   - Select **Ampere (ARM)**
   - Choose **VM.Standard.A1.Flex**
   - Configure resources:
     - **OCPUs**: 4 (use the slider or type "4")
     - **Memory (GB)**: 24 (automatically set based on OCPUs)
   - Click "Select Shape"

### Step 3: Configure Networking

**Create a VCN (Virtual Cloud Network):**

If this is your first instance, Oracle will create a new VCN for you:

1. Under "Networking", select **Create new virtual cloud network**
2. Name: `philosophizer-vcn`
3. Select **Create new public subnet**
4. Subnet name: `philosophizer-public-subnet`

**Assign a Public IP:**

- Make sure **"Assign a public IPv4 address"** is checked ✓

### Step 4: Add SSH Keys

You need an SSH key pair to access your server.

**Option A: Generate Keys in the Browser (Easiest)**

1. Select **"Generate a key pair for me"**
2. Click **"Save Private Key"** - this downloads a `.key` file
3. Click **"Save Public Key"** - optional, for your records
4. **IMPORTANT**: Save this private key file safely - you can't download it again!

**Option B: Use Your Own SSH Keys**

If you already have SSH keys:

```bash
cat ~/.ssh/id_rsa.pub
```

1. Select **"Upload public key files (.pub)"** or **"Paste public keys"**
2. Upload or paste your public key

**Option C: Generate Keys Locally**

On macOS/Linux:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/oracle_philosophizer
```

On Windows (PowerShell):

```powershell
ssh-keygen -t rsa -b 4096 -f $env:USERPROFILE\.ssh\oracle_philosophizer
```

Then upload the `.pub` file or paste its contents.

### Step 5: Boot Volume

1. Click **"Specify a custom boot volume size"**
2. Set to **200 GB** (maximum for free tier)

### Step 6: Create the Instance

1. Review all settings
2. Click **"Create"**
3. Wait 2-3 minutes for provisioning (status will change from "Provisioning" to "Running")

### Step 7: Note Your Public IP

Once running, you'll see your instance details:

1. Find **"Public IP address"** (e.g., `132.145.83.xxx`)
2. **Copy this IP** - you'll need it to connect

---

## Configuring Network Security

By default, Oracle Cloud blocks most incoming traffic. You need to open ports for HTTP, HTTPS, and SSH.

### Step 1: Configure Security List

1. On your instance details page, under **"Instance information"**, find **"Primary VNIC"**
2. Click on the **Subnet name** (e.g., `philosophizer-public-subnet`)
3. Under **"Security Lists"**, click on the security list name (e.g., `Default Security List`)
4. Click **"Add Ingress Rules"**

### Step 2: Add Ingress Rules

Add the following rules one by one:

**Rule 1: HTTP (Port 80)**

```
Source Type: CIDR
Source CIDR: 0.0.0.0/0
IP Protocol: TCP
Destination Port Range: 80
Description: HTTP
```

**Rule 2: HTTPS (Port 443)**

```
Source Type: CIDR
Source CIDR: 0.0.0.0/0
IP Protocol: TCP
Destination Port Range: 443
Description: HTTPS
```

**Rule 3: Custom App Port (Port 1738) - Optional for testing**

```
Source Type: CIDR
Source CIDR: 0.0.0.0/0
IP Protocol: TCP
Destination Port Range: 1738
Description: Philosophizer direct access
```

**Note**: SSH (port 22) should already be open by default.

Click **"Add Ingress Rules"** after each entry.

---

## Connecting to Your Server

### Prepare Your SSH Key (if you generated one in the browser)

**On macOS/Linux:**

```bash
cd ~/Downloads
chmod 400 ssh-key-*.key
mv ssh-key-*.key ~/.ssh/oracle_philosophizer.key
```

**On Windows:**

Move the key file to a safe location and set permissions using PowerShell:

```powershell
Move-Item ssh-key-*.key $env:USERPROFILE\.ssh\oracle_philosophizer.key
icacls $env:USERPROFILE\.ssh\oracle_philosophizer.key /inheritance:r
icacls $env:USERPROFILE\.ssh\oracle_philosophizer.key /grant:r "$($env:USERNAME):(R)"
```

### Connect via SSH

Replace `YOUR_VM_IP` with your actual public IP address.

**On macOS/Linux:**

```bash
ssh -i ~/.ssh/oracle_philosophizer.key ubuntu@YOUR_VM_IP
```

**On Windows (PowerShell):**

```powershell
ssh -i $env:USERPROFILE\.ssh\oracle_philosophizer.key ubuntu@YOUR_VM_IP
```

**First Connection:**

You'll see a message about authenticity of the host. Type `yes` to continue.

```
The authenticity of host 'YOUR_VM_IP' can't be established.
Are you sure you want to continue connecting (yes/no)? yes
```

You should now see:

```
ubuntu@philosophizer-prod:~$
```

---

## Deploying the Application

### Step 1: Run Initial Server Setup

Run the server setup script to install Docker, configure the firewall, and prepare the environment:

```bash
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/philosophizer/main/scripts/oracle-deploy/01-server-setup.sh)"
```

**Or upload and run locally:**

1. **Upload the repository to the server:**

```bash
cd /opt/philosophizer
sudo chown ubuntu:ubuntu /opt/philosophizer
git clone https://github.com/YOUR_USERNAME/philosophizer.git .
```

2. **Run the setup script:**

```bash
sudo bash /opt/philosophizer/scripts/oracle-deploy/01-server-setup.sh
```

**What this script does:**

- Updates system packages
- Installs Docker and Docker Compose
- Configures UFW firewall
- Sets up 4GB swap space
- Creates deployment directories

**Important:** After the script completes, **log out and log back in** for Docker group changes to take effect:

```bash
exit
```

Then reconnect via SSH.

### Step 2: Configure Environment Variables

1. **Navigate to the deployment directory:**

```bash
cd /opt/philosophizer
```

2. **Copy the environment template:**

```bash
cp scripts/oracle-deploy/env.production.template .env
```

3. **Edit the environment file:**

```bash
nano .env
```

or

```bash
vim .env
```

4. **Update your API keys:**

```bash
NODE_ENV=production
PORT=1738

CHROMA_URL=http://chroma:8000
CHROMA_PORT=8000

AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=sk-proj-xxxxxxxxxxxxx
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

LLM_MODEL=gpt-4o
SEARCH_MODEL=gpt-4o-mini

EMBEDDING_BASE_URL=https://api.openai.com/v1
EMBEDDING_API_KEY=sk-proj-xxxxxxxxxxxxx
EMBEDDING_MODEL=text-embedding-3-small
```

**For nano editor:**

- Edit the values
- Press `Ctrl + X` to exit
- Press `Y` to confirm save
- Press `Enter` to confirm filename

**For vim editor:**

- Press `i` to enter insert mode
- Edit the values
- Press `Esc` to exit insert mode
- Type `:wq` and press `Enter` to save and quit

### Step 3: Deploy the Application

```bash
bash scripts/oracle-deploy/02-deploy.sh
```

**What this script does:**

- Validates your environment configuration
- Creates necessary directories
- Builds Docker images
- Starts all services (Nginx, Philosophizer, ChromaDB)
- Performs health checks

This will take 5-10 minutes the first time as it builds the Docker images.

### Step 4: Verify Deployment

Check that all services are running:

```bash
docker compose -f scripts/oracle-deploy/docker-compose.production.yml ps
```

You should see three services:

- `philosophizer-nginx` (healthy)
- `philosophizer-app` (running)
- `philosophizer-chroma` (healthy)

View logs:

```bash
docker compose -f scripts/oracle-deploy/docker-compose.production.yml logs -f
```

Press `Ctrl + C` to stop viewing logs.

### Step 5: Test Your Application

Open your browser and visit:

```
http://YOUR_VM_IP
```

You should see the Philosophizer interface!

---

## Post-Deployment Configuration

### Index RAG Data

To enable the full RAG functionality, you need to index the philosophical texts:

```bash
docker exec philosophizer-app bun run rag:index
```

This process may take 10-30 minutes depending on the amount of data.

**Monitor indexing progress:**

```bash
docker logs -f philosophizer-app
```

### Configure Automatic Backups (Optional)

Create a cron job to backup ChromaDB data daily:

```bash
crontab -e
```

Add this line to backup at 2 AM daily:

```
0 2 * * * /opt/philosophizer/scripts/oracle-deploy/manage.sh backup >> /opt/philosophizer/backups/backup.log 2>&1
```

---

## Monitoring and Maintenance

### Management Script

Use the `manage.sh` script for common operations:

```bash
cd /opt/philosophizer
bash scripts/oracle-deploy/manage.sh <command>
```

**Available commands:**

| Command   | Description                       |
| --------- | --------------------------------- |
| `status`  | Show status of all services       |
| `logs`    | Follow logs from all services     |
| `restart` | Restart all services              |
| `stop`    | Stop all services                 |
| `start`   | Start all services                |
| `backup`  | Backup ChromaDB data              |
| `restore` | Restore ChromaDB data from backup |
| `stats`   | Show resource usage statistics    |
| `shell`   | Open shell in app container       |
| `index`   | Run RAG indexing                  |

**Examples:**

```bash
bash scripts/oracle-deploy/manage.sh status

bash scripts/oracle-deploy/manage.sh logs

bash scripts/oracle-deploy/manage.sh backup

bash scripts/oracle-deploy/manage.sh stats
```

### Monitor Resource Usage

**System resources:**

```bash
htop
```

Press `q` to quit.

**Docker stats:**

```bash
docker stats
```

Press `Ctrl + C` to stop.

**Disk usage:**

```bash
df -h
```

**Memory usage:**

```bash
free -h
```

### Updating the Application

When you make changes to your code:

1. **Commit and push changes to your Git repository**

2. **On the server, pull changes and redeploy:**

```bash
cd /opt/philosophizer
git pull
bash scripts/oracle-deploy/02-deploy.sh --update
```

---

## Troubleshooting

### Services Won't Start

**Check logs:**

```bash
docker compose -f scripts/oracle-deploy/docker-compose.production.yml logs
```

**Common issues:**

1. **Out of memory:**
   - Check: `free -h`
   - Solution: Restart services, reduce memory limits

2. **Port already in use:**
   - Check: `sudo netstat -tulpn | grep :80`
   - Solution: Stop conflicting service

3. **ChromaDB won't start:**
   - Check volume permissions
   - Try: `docker volume rm philosophizer-chroma-data` (will delete data!)

### Can't Connect to Server

**Check SSH connection:**

```bash
ssh -v -i ~/.ssh/oracle_philosophizer.key ubuntu@YOUR_VM_IP
```

**Common issues:**

1. **Permission denied (publickey):**
   - Check key file permissions: `chmod 400 ~/.ssh/oracle_philosophizer.key`
   - Verify you're using the correct key file

2. **Connection timeout:**
   - Verify Security List ingress rules (port 22)
   - Check instance is running in Oracle Cloud Console

### Application Not Accessible via Browser

**Check Nginx:**

```bash
docker logs philosophizer-nginx
```

**Check if port 80 is listening:**

```bash
sudo netstat -tulpn | grep :80
```

**Test locally on server:**

```bash
curl http://localhost
```

**Common issues:**

1. **Security List not configured:**
   - Verify ports 80 and 443 are open in Oracle Cloud Console

2. **Firewall (UFW) blocking:**
   - Check: `sudo ufw status`
   - Allow port: `sudo ufw allow 80/tcp`

### Database Connection Issues

**Check ChromaDB health:**

```bash
docker exec philosophizer-chroma curl http://localhost:8000/api/v1/heartbeat
```

Should return: `{}`

**Restart ChromaDB:**

```bash
docker compose -f scripts/oracle-deploy/docker-compose.production.yml restart chroma
```

---

## Backup and Restore

### Manual Backup

Create a backup of ChromaDB data:

```bash
bash scripts/oracle-deploy/manage.sh backup
```

Backups are stored in `/opt/philosophizer/backups/` with timestamp.

### Download Backup to Local Machine

From your local computer:

```bash
scp -i ~/.ssh/oracle_philosophizer.key \
  ubuntu@YOUR_VM_IP:/opt/philosophizer/backups/chroma-backup-*.tar.gz \
  ~/Downloads/
```

### Restore from Backup

List available backups:

```bash
bash scripts/oracle-deploy/manage.sh restore
```

Restore specific backup:

```bash
bash scripts/oracle-deploy/manage.sh restore chroma-backup-20241221-140000.tar.gz
```

### Upload Backup from Local Machine

From your local computer:

```bash
scp -i ~/.ssh/oracle_philosophizer.key \
  ~/Downloads/chroma-backup-*.tar.gz \
  ubuntu@YOUR_VM_IP:/opt/philosophizer/backups/
```

---

## Adding a Custom Domain (Optional)

When you're ready to use a custom domain instead of the IP address:

### Step 1: Configure DNS

Add an A record pointing to your VM's public IP:

```
Type: A
Name: philosophizer (or @)
Value: YOUR_VM_IP
TTL: 3600
```

### Step 2: Install SSL Certificate

SSH into your server and run:

```bash
sudo apt-get update
sudo apt-get install -y certbot

sudo certbot certonly --standalone \
  -d yourdomain.com \
  --pre-hook "docker compose -f /opt/philosophizer/scripts/oracle-deploy/docker-compose.production.yml stop nginx" \
  --post-hook "docker compose -f /opt/philosophizer/scripts/oracle-deploy/docker-compose.production.yml start nginx"
```

### Step 3: Update Nginx Configuration

Edit `scripts/oracle-deploy/nginx.conf` to add SSL configuration and update server_name.

### Step 4: Set Up Auto-Renewal

```bash
sudo crontab -e
```

Add:

```
0 3 * * * certbot renew --pre-hook "docker compose -f /opt/philosophizer/scripts/oracle-deploy/docker-compose.production.yml stop nginx" --post-hook "docker compose -f /opt/philosophizer/scripts/oracle-deploy/docker-compose.production.yml start nginx" >> /var/log/certbot-renew.log 2>&1
```

---

## Additional Resources

- [Oracle Cloud Free Tier Documentation](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm)
- [Docker Documentation](https://docs.docker.com/)
- [Bun Documentation](https://bun.sh/docs)
- [ChromaDB Documentation](https://docs.trychroma.com/)

---

## Support and Questions

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review application logs: `docker compose logs -f`
3. Check system resources: `htop` and `docker stats`
4. Ensure all environment variables are correctly set

---

## Summary

You've successfully deployed Philosophizer on Oracle Cloud! Your application is:

✅ Running on a powerful ARM-based VM (free forever)  
✅ Using Docker for containerization  
✅ Behind Nginx reverse proxy  
✅ With persistent ChromaDB storage  
✅ Accessible via HTTP (and ready for HTTPS with a domain)

**Next steps:**

- Index your RAG data
- Set up automatic backups
- Consider adding a custom domain with SSL
- Monitor resource usage regularly

Enjoy your free, production-ready deployment! 🚀
