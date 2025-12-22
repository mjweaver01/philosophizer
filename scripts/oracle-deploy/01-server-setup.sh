#!/bin/bash

set -e

echo "=========================================="
echo "Philosophizer - Oracle Cloud Server Setup"
echo "=========================================="
echo ""

if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
fi

echo "Starting server setup..."
echo ""

echo "[1/7] Updating system packages..."
apt-get update
apt-get upgrade -y

echo ""
echo "[2/7] Installing essential packages..."
apt-get install -y \
    curl \
    wget \
    git \
    ufw \
    htop \
    vim \
    ca-certificates \
    gnupg \
    lsb-release

echo ""
echo "[3/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    usermod -aG docker ubuntu
    
    systemctl enable docker
    systemctl start docker
    
    echo "Docker installed successfully"
else
    echo "Docker already installed"
fi

echo ""
echo "[4/7] Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po '"tag_name": "\K.*?(?=")')
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed successfully"
else
    echo "Docker Compose already installed"
fi

echo ""
echo "[5/7] Configuring firewall (UFW)..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 1738/tcp
ufw status

echo ""
echo "[6/7] Setting up swap space (4GB)..."
if [ ! -f /swapfile ]; then
    fallocate -l 4G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "Swap space created"
else
    echo "Swap file already exists"
fi

echo ""
echo "[7/7] Creating deployment directories..."
mkdir -p /opt/philosophizer
mkdir -p /opt/philosophizer/data
mkdir -p /opt/philosophizer/backups
chown -R ubuntu:ubuntu /opt/philosophizer

echo ""
echo "=========================================="
echo "Server setup completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Exit and log back in for Docker group changes to take effect"
echo "2. Clone or upload your application code to /opt/philosophizer"
echo "3. Run the deployment script: ./02-deploy.sh"
echo ""
echo "Useful commands:"
echo "  docker ps              - List running containers"
echo "  docker compose logs -f - View application logs"
echo "  htop                   - Monitor system resources"
echo ""

