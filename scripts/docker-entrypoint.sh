#!/usr/bin/env bash
# =============================================================================
# Docker Entrypoint Script - Auto-generate secrets on first run
# =============================================================================
# This script runs before the main application and ensures secrets are set.
# If secrets don't exist, it generates them automatically and persists them.
# =============================================================================

set -euo pipefail

SECRETS_DIR="/app/secrets"
SECRETS_FILE="$SECRETS_DIR/.secrets"

# Colors for logging
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Generate a secure random string
generate_secret() {
    local length=$1
    openssl rand -base64 "$length" | tr -d '\n'
}

# Initialize secrets directory
init_secrets_dir() {
    if [[ ! -d "$SECRETS_DIR" ]]; then
        log_info "Creating secrets directory..."
        mkdir -p "$SECRETS_DIR"
        chmod 700 "$SECRETS_DIR"
    fi
}

# Check if secrets file exists
secrets_exist() {
    [[ -f "$SECRETS_FILE" ]]
}

# Generate and save secrets
generate_and_save_secrets() {
    log_info "Generating new secrets..."
    
    local jwt_secret=$(generate_secret 64)
    local postgres_password=$(generate_secret 32)
    
    # Save to secrets file
    cat > "$SECRETS_FILE" <<EOF
# Auto-generated secrets - DO NOT EDIT MANUALLY
# Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
JWT_SECRET=$jwt_secret
POSTGRES_PASSWORD=$postgres_password
EOF
    
    chmod 600 "$SECRETS_FILE"
    
    log_success "Secrets generated and saved to $SECRETS_FILE"
    
    # Export to environment
    export JWT_SECRET="$jwt_secret"
    export POSTGRES_PASSWORD="$postgres_password"
}

# Load existing secrets
load_secrets() {
    log_info "Loading existing secrets from $SECRETS_FILE"
    
    # Source the secrets file
    set -a
    source "$SECRETS_FILE"
    set +a
    
    log_success "Secrets loaded successfully"
}

# Display secret info (masked)
display_secret_info() {
    if [[ -n "${JWT_SECRET:-}" ]]; then
        local masked_jwt="${JWT_SECRET:0:8}...${JWT_SECRET: -8}"
        log_info "JWT_SECRET: $masked_jwt (${#JWT_SECRET} chars)"
    fi
    
    if [[ -n "${POSTGRES_PASSWORD:-}" ]]; then
        local masked_pg="${POSTGRES_PASSWORD:0:6}...${POSTGRES_PASSWORD: -6}"
        log_info "POSTGRES_PASSWORD: $masked_pg (${#POSTGRES_PASSWORD} chars)"
    fi
}

# Main secret initialization
init_secrets() {
    log_info "Initializing secrets..."
    
    init_secrets_dir
    
    # Check if JWT_SECRET is already set in environment (from .env or docker-compose)
    if [[ -n "${JWT_SECRET:-}" ]] && [[ "${JWT_SECRET}" != *"change"* ]]; then
        log_success "JWT_SECRET already set in environment"
        return 0
    fi
    
    # Check if secrets file exists
    if secrets_exist; then
        log_info "Secrets file found, loading..."
        load_secrets
    else
        log_warn "No secrets found, generating new ones..."
        generate_and_save_secrets
        
        # Show generated secrets on first run
        echo ""
        log_info "=== AUTO-GENERATED SECRETS ==="
        echo ""
        echo "JWT_SECRET=$JWT_SECRET"
        echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
        echo ""
        log_warn "These secrets have been saved to: $SECRETS_FILE"
        log_warn "Back up this file securely for disaster recovery!"
        echo ""
    fi
    
    display_secret_info
}

# Wait for PostgreSQL to be ready
wait_for_postgres() {
    # If DATABASE_URL is not set, try to construct it from individual components
    if [[ -z "${DATABASE_URL:-}" ]]; then
        if [[ -n "${POSTGRES_USER:-}" ]] && [[ -n "${POSTGRES_PASSWORD:-}" ]] && [[ -n "${POSTGRES_DB:-}" ]]; then
            # Construct DATABASE_URL from docker-compose environment variables
            export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}"
            log_info "Constructed DATABASE_URL from environment variables"
        else
            log_warn "DATABASE_URL not set and cannot construct from env vars"
            log_warn "Available: POSTGRES_USER=${POSTGRES_USER:-'not set'}, POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-'not set'}, POSTGRES_DB=${POSTGRES_DB:-'not set'}"
            return 0
        fi
    fi
    
    log_info "Waiting for PostgreSQL to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    # Extract postgres host from DATABASE_URL
    local pg_host=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\).*/\1/p')
    local pg_port=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    
    if [[ -z "$pg_port" ]]; then
        pg_port=5432
    fi
    
    while ! nc -z "$pg_host" "$pg_port" 2>/dev/null; do
        if [[ $attempt -ge $max_attempts ]]; then
            log_error "PostgreSQL not ready after $max_attempts attempts"
            exit 1
        fi
        
        log_info "Attempt $attempt/$max_attempts: Waiting for PostgreSQL at $pg_host:$pg_port..."
        sleep 2
        ((attempt++))
    done
    
    log_success "PostgreSQL is ready!"
}

# Main entrypoint
main() {
    echo ""
    log_info "================================================"
    log_info "  Philosophizer Docker Entrypoint"
    log_info "================================================"
    echo ""
    
    # Initialize secrets
    init_secrets
    
    # Wait for dependencies
    wait_for_postgres
    
    echo ""
    log_success "Initialization complete, starting application..."
    echo ""
    
    # Execute the main command (passed as arguments to this script)
    exec "$@"
}

main "$@"

