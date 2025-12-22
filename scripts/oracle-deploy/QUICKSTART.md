# Quick Start: Deploy to Oracle Cloud

This is the fastest way to get Philosophizer running on Oracle Cloud's Always Free tier.

## Before You Start

You need:
- [ ] Oracle Cloud account (sign up at [oracle.com/cloud/free](https://www.oracle.com/cloud/free/))
- [ ] OpenAI API key (or compatible LLM provider)
- [ ] 15-20 minutes

## Step 1: Create VM (5 minutes)

1. Log into [Oracle Cloud Console](https://cloud.oracle.com/)
2. Click **Compute** → **Instances** → **Create Instance**
3. Configure:
   - **Name**: `philosophizer-prod`
   - **Image**: Ubuntu 22.04 (ARM64)
   - **Shape**: VM.Standard.A1.Flex (4 OCPUs, 24GB RAM)
   - **Boot Volume**: 200GB
   - **SSH Keys**: Generate and download the private key
4. Click **Create**
5. Wait 2-3 minutes for provisioning
6. **Copy the Public IP address**

## Step 2: Open Firewall Ports (3 minutes)

1. On your instance page, click the **Subnet name**
2. Click the **Security List**
3. Click **Add Ingress Rules**
4. Add these rules:

**HTTP (Port 80):**
```
Source CIDR: 0.0.0.0/0
Port: 80
```

**HTTPS (Port 443):**
```
Source CIDR: 0.0.0.0/0
Port: 443
```

## Step 3: Connect to Server (2 minutes)

**On Mac/Linux:**
```bash
chmod 400 ~/Downloads/ssh-key-*.key
ssh -i ~/Downloads/ssh-key-*.key ubuntu@YOUR_VM_IP
```

**On Windows (PowerShell):**
```powershell
ssh -i $env:USERPROFILE\Downloads\ssh-key-*.key ubuntu@YOUR_VM_IP
```

Type `yes` when asked about authenticity.

## Step 4: Setup Server (5 minutes)

```bash
cd /opt/philosophizer
sudo chown ubuntu:ubuntu /opt/philosophizer
git clone https://github.com/YOUR_USERNAME/philosophizer.git .

sudo bash scripts/oracle-deploy/01-server-setup.sh
```

**Log out and back in:**
```bash
exit
```

Then reconnect with SSH.

## Step 5: Configure & Deploy (5 minutes)

```bash
cd /opt/philosophizer

cp scripts/oracle-deploy/env.production.template .env

nano .env
```

**Update these lines:**
```env
AI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
EMBEDDING_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

**Deploy:**
```bash
bash scripts/oracle-deploy/02-deploy.sh
```

Wait 5-10 minutes for Docker to build everything.

## Step 6: Test It! (1 minute)

Open your browser:
```
http://YOUR_VM_IP
```

You should see Philosophizer! 🎉

## Step 7: Index RAG Data (Optional, 15 minutes)

```bash
docker exec philosophizer-app bun run rag:index
```

This enables the full philosophical knowledge base.

---

## Quick Commands

**View logs:**
```bash
bash scripts/oracle-deploy/manage.sh logs
```

**Check status:**
```bash
bash scripts/oracle-deploy/manage.sh status
```

**Backup data:**
```bash
bash scripts/oracle-deploy/manage.sh backup
```

**Restart services:**
```bash
bash scripts/oracle-deploy/manage.sh restart
```

---

## Troubleshooting

**Can't connect via SSH?**
- Check you're using the correct key file
- Verify port 22 is open in Security List

**Can't access in browser?**
- Check ports 80 and 443 are open in Security List
- Run: `bash scripts/oracle-deploy/manage.sh status`

**Out of memory?**
- Check: `free -h`
- Restart: `bash scripts/oracle-deploy/manage.sh restart`

**Need more help?**
- Full guide: [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)
- Script reference: [scripts/oracle-deploy/README.md](README.md)

---

## What You Get (Free Forever)

✅ 4 CPU cores (ARM)  
✅ 24 GB RAM  
✅ 200 GB storage  
✅ 10 TB bandwidth/month  
✅ Persistent ChromaDB data  
✅ Automatic restarts  
✅ Production-ready setup  

**Estimated deployment time:** 15-20 minutes

**Monthly cost:** $0 (Always Free tier)

Enjoy! 🚀

