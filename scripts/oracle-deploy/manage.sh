#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.production.yml"
BACKUP_DIR="/opt/philosophizer/backups"

show_usage() {
    echo "Philosophizer Management Script"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  status    - Show status of all services"
    echo "  logs      - Follow logs from all services"
    echo "  restart   - Restart all services"
    echo "  stop      - Stop all services"
    echo "  start     - Start all services"
    echo "  backup    - Backup ChromaDB data"
    echo "  restore   - Restore ChromaDB data from backup"
    echo "  stats     - Show resource usage statistics"
    echo "  shell     - Open shell in app container"
    echo "  index     - Run RAG indexing"
    echo ""
}

if [ $# -eq 0 ]; then
    show_usage
    exit 1
fi

COMMAND=$1

case $COMMAND in
    status)
        echo "Service Status:"
        echo "==============="
        docker compose -f "$COMPOSE_FILE" ps
        echo ""
        echo "Docker Stats:"
        docker stats --no-stream philosophizer-app philosophizer-chroma philosophizer-nginx
        ;;
        
    logs)
        if [ -n "$2" ]; then
            docker compose -f "$COMPOSE_FILE" logs -f "$2"
        else
            docker compose -f "$COMPOSE_FILE" logs -f
        fi
        ;;
        
    restart)
        echo "Restarting services..."
        docker compose -f "$COMPOSE_FILE" restart
        echo "Services restarted"
        ;;
        
    stop)
        echo "Stopping services..."
        docker compose -f "$COMPOSE_FILE" stop
        echo "Services stopped"
        ;;
        
    start)
        echo "Starting services..."
        docker compose -f "$COMPOSE_FILE" up -d
        echo "Services started"
        ;;
        
    backup)
        echo "Backing up ChromaDB data..."
        mkdir -p "$BACKUP_DIR"
        BACKUP_FILE="$BACKUP_DIR/chroma-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
        
        docker run --rm \
            -v philosophizer-chroma-data:/data \
            -v "$BACKUP_DIR":/backup \
            alpine tar czf "/backup/$(basename $BACKUP_FILE)" -C /data .
        
        echo "Backup created: $BACKUP_FILE"
        echo ""
        echo "Existing backups:"
        ls -lh "$BACKUP_DIR"
        ;;
        
    restore)
        if [ -z "$2" ]; then
            echo "Available backups:"
            ls -1 "$BACKUP_DIR"/*.tar.gz 2>/dev/null || echo "No backups found"
            echo ""
            echo "Usage: $0 restore <backup-file>"
            exit 1
        fi
        
        BACKUP_FILE="$BACKUP_DIR/$2"
        if [ ! -f "$BACKUP_FILE" ]; then
            echo "Error: Backup file not found: $BACKUP_FILE"
            exit 1
        fi
        
        echo "⚠️  This will replace all current ChromaDB data!"
        read -p "Are you sure? (yes/no): " confirm
        
        if [ "$confirm" != "yes" ]; then
            echo "Restore cancelled"
            exit 0
        fi
        
        echo "Stopping ChromaDB..."
        docker compose -f "$COMPOSE_FILE" stop chroma
        
        echo "Restoring backup..."
        docker run --rm \
            -v philosophizer-chroma-data:/data \
            -v "$BACKUP_DIR":/backup \
            alpine sh -c "rm -rf /data/* && tar xzf /backup/$(basename $BACKUP_FILE) -C /data"
        
        echo "Starting ChromaDB..."
        docker compose -f "$COMPOSE_FILE" start chroma
        
        echo "Restore completed"
        ;;
        
    stats)
        echo "System Resources:"
        echo "================="
        echo ""
        echo "Memory Usage:"
        free -h
        echo ""
        echo "Disk Usage:"
        df -h /
        echo ""
        echo "Docker Container Stats:"
        docker stats --no-stream
        ;;
        
    shell)
        SERVICE=${2:-app}
        echo "Opening shell in $SERVICE container..."
        docker exec -it philosophizer-$SERVICE /bin/sh
        ;;
        
    index)
        echo "Running RAG indexing..."
        docker exec philosophizer-app bun run rag:index
        echo "Indexing completed"
        ;;
        
    *)
        echo "Unknown command: $COMMAND"
        echo ""
        show_usage
        exit 1
        ;;
esac

