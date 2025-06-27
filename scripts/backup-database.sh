#!/bin/bash

# Formula PM - Database Backup Script
# Automated PostgreSQL backup with compression and S3 upload

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backups"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="formula-pm-postgres-prod"

# Environment variables
POSTGRES_DB=${POSTGRES_DB:-formula_pm}
POSTGRES_USER=${POSTGRES_USER:-formula_pm}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
AWS_S3_BUCKET=${AWS_S3_BUCKET}
BACKUP_RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if required variables are set
check_requirements() {
    log "Checking backup requirements..."
    
    if [ -z "$POSTGRES_PASSWORD" ]; then
        error "POSTGRES_PASSWORD environment variable is not set"
        exit 1
    fi
    
    # Check if Docker container is running
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        error "PostgreSQL container '$CONTAINER_NAME' is not running"
        exit 1
    fi
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    log "Requirements check passed"
}

# Perform database backup
backup_database() {
    local backup_file="$BACKUP_DIR/formula_pm_backup_$DATE.sql"
    local compressed_file="$backup_file.gz"
    
    log "Starting database backup..."
    log "Backup file: $backup_file"
    
    # Create PostgreSQL dump
    if docker exec "$CONTAINER_NAME" pg_dump \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        --no-password \
        --verbose \
        --clean \
        --create \
        --if-exists \
        --format=plain > "$backup_file"; then
        
        log "Database dump completed successfully"
        
        # Compress the backup
        log "Compressing backup file..."
        gzip "$backup_file"
        
        if [ -f "$compressed_file" ]; then
            local file_size=$(du -h "$compressed_file" | cut -f1)
            log "Backup compressed successfully. Size: $file_size"
            echo "$compressed_file"
        else
            error "Failed to compress backup file"
            exit 1
        fi
    else
        error "Database backup failed"
        exit 1
    fi
}

# Upload backup to S3 (if configured)
upload_to_s3() {
    local backup_file="$1"
    
    if [ -z "$AWS_S3_BUCKET" ]; then
        warning "AWS_S3_BUCKET not configured, skipping S3 upload"
        return 0
    fi
    
    log "Uploading backup to S3..."
    
    local s3_key="database-backups/$(basename "$backup_file")"
    
    if command -v aws >/dev/null 2>&1; then
        if aws s3 cp "$backup_file" "s3://$AWS_S3_BUCKET/$s3_key" \
            --storage-class STANDARD_IA \
            --metadata "environment=production,backup-type=database,created=$(date -u +%Y-%m-%dT%H:%M:%SZ)"; then
            log "Backup uploaded to S3: s3://$AWS_S3_BUCKET/$s3_key"
        else
            error "Failed to upload backup to S3"
            return 1
        fi
    else
        warning "AWS CLI not found, skipping S3 upload"
    fi
}

# Clean up old backups
cleanup_old_backups() {
    log "Cleaning up old backups (keeping last $BACKUP_RETENTION_DAYS days)..."
    
    # Local cleanup
    find "$BACKUP_DIR" -name "formula_pm_backup_*.sql.gz" -type f -mtime +$BACKUP_RETENTION_DAYS -delete
    
    local deleted_count=$(find "$BACKUP_DIR" -name "formula_pm_backup_*.sql.gz" -type f -mtime +$BACKUP_RETENTION_DAYS | wc -l)
    if [ "$deleted_count" -gt 0 ]; then
        log "Deleted $deleted_count old local backup files"
    fi
    
    # S3 cleanup (if configured)
    if [ -n "$AWS_S3_BUCKET" ] && command -v aws >/dev/null 2>&1; then
        log "Cleaning up old S3 backups..."
        
        # Note: This would require a more sophisticated script to handle S3 lifecycle policies
        # For now, we'll rely on S3 lifecycle rules configured in the bucket
        warning "S3 cleanup should be handled by bucket lifecycle policies"
    fi
}

# Verify backup integrity
verify_backup() {
    local backup_file="$1"
    
    log "Verifying backup integrity..."
    
    # Check if file exists and is not empty
    if [ ! -f "$backup_file" ]; then
        error "Backup file does not exist: $backup_file"
        return 1
    fi
    
    if [ ! -s "$backup_file" ]; then
        error "Backup file is empty: $backup_file"
        return 1
    fi
    
    # Test gunzip on compressed file
    if ! gunzip -t "$backup_file" >/dev/null 2>&1; then
        error "Backup file is corrupted: $backup_file"
        return 1
    fi
    
    log "Backup integrity verification passed"
}

# Send notification (placeholder)
send_notification() {
    local status="$1"
    local backup_file="$2"
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        local message
        if [ "$status" = "success" ]; then
            message="✅ Formula PM database backup completed successfully: $(basename "$backup_file")"
        else
            message="❌ Formula PM database backup failed"
        fi
        
        # Send to Slack
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            "$SLACK_WEBHOOK_URL" >/dev/null 2>&1 || true
    fi
}

# Main backup function
main() {
    log "Starting Formula PM database backup process..."
    
    # Check requirements
    check_requirements
    
    # Perform backup
    local backup_file
    backup_file=$(backup_database)
    
    if [ -n "$backup_file" ]; then
        # Verify backup
        if verify_backup "$backup_file"; then
            # Upload to S3
            upload_to_s3 "$backup_file"
            
            # Clean up old backups
            cleanup_old_backups
            
            # Send success notification
            send_notification "success" "$backup_file"
            
            log "Database backup process completed successfully"
            log "Backup location: $backup_file"
        else
            error "Backup verification failed"
            send_notification "failure"
            exit 1
        fi
    else
        error "Backup creation failed"
        send_notification "failure"
        exit 1
    fi
}

# Handle script interruption
trap 'error "Backup process interrupted"; exit 1' INT TERM

# Run main function
main "$@"