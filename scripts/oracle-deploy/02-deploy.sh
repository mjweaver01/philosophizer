#!/bin/bash

set -e

DEPLOY_DIR="/opt/philosophizer"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

UPDATE_MODE=false
if [ "$1" = "--update" ]; then
    UPDATE_MODE=true
fi

echo "=========================================="
echo "Philosophizer - Application Deployment"
echo "=========================================="
echo ""

if [ "$UPDATE_MODE" = true ]; then
    echo "Running in UPDATE mode..."
else
    echo "Running in INITIAL DEPLOYMENT mode..."
fi
echo ""

cd "$DEPLOY_DIR"

if [ "$UPDATE_MODE" = true ]; then
    echo "[1/6] Pulling latest changes..."
    if [ -d .git ]; then
        git pull
    else
        echo "Not a git repository. Skipping pull."
    fi
else
    echo "[1/6] Setting up application files..."
    if [ ! -f .env ]; then
        if [ -f "$PROJECT_ROOT/scripts/oracle-deploy/env.production.template" ]; then
            cp "$PROJECT_ROOT/scripts/oracle-deploy/env.production.template" .env
            echo "Created .env file from template"
            echo "⚠️  IMPORTANT: Edit .env and add your API keys before continuing!"
            echo ""
            read -p "Press Enter after you've configured .env..."
        else
            echo "Error: env.production.template not found"
            exit 1
        fi
    fi
fi

echo ""
echo "[2/6] Validating environment configuration..."
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi

if grep -q "your_openai_api_key_here" .env || grep -q "your_embedding_api_key_here" .env; then
    echo "⚠️  Warning: .env file still contains placeholder values"
    echo "Please update your API keys in .env"
    exit 1
fi

echo "Environment configuration validated ✓"

echo ""
echo "[3/6] Creating SSL directory (for future use)..."
mkdir -p "$SCRIPT_DIR/ssl"

echo ""
echo "[4/6] Stopping existing containers..."
docker compose -f scripts/oracle-deploy/docker-compose.production.yml down || true

echo ""
echo "[5/6] Building and starting services..."
docker compose -f scripts/oracle-deploy/docker-compose.production.yml up -d --build

echo ""
echo "[6/6] Waiting for services to be healthy..."
sleep 5

echo ""
echo "Checking service status..."
docker compose -f scripts/oracle-deploy/docker-compose.production.yml ps

echo ""
echo "=========================================="
echo "Deployment completed successfully!"
echo "=========================================="
echo ""
echo "Your application should be accessible at:"
echo "  http://$(curl -s ifconfig.me)"
echo ""
echo "Next steps:"
echo "1. Test the application in your browser"
echo "2. Index RAG data: docker exec philosophizer-app bun run rag:index"
echo "3. Monitor logs: docker compose -f scripts/oracle-deploy/docker-compose.production.yml logs -f"
echo ""
echo "Useful commands:"
echo "  ./scripts/oracle-deploy/manage.sh logs     - View logs"
echo "  ./scripts/oracle-deploy/manage.sh restart  - Restart services"
echo "  ./scripts/oracle-deploy/manage.sh status   - Check status"
echo ""

