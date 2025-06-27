# Formula PM - Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying Formula PM to production environments using Docker containers, CI/CD pipelines, and monitoring infrastructure.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Docker Deployment](#docker-deployment)
4. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
5. [SSL/TLS Configuration](#ssltls-configuration)
6. [Monitoring and Logging](#monitoring-and-logging)
7. [Backup and Recovery](#backup-and-recovery)
8. [Security Hardening](#security-hardening)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **OS**: Ubuntu 20.04 LTS or later, CentOS 8+, or Amazon Linux 2
- **CPU**: Minimum 4 cores, Recommended 8+ cores
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: Minimum 100GB SSD, Recommended 500GB+ SSD
- **Network**: Stable internet connection with public IP

### Required Software

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git 2.30+
- Node.js 18+ (for development)
- PostgreSQL 15+ (or Docker container)
- Redis 7+ (or Docker container)

### Domain and SSL

- Registered domain name
- SSL certificate (Let's Encrypt recommended)
- DNS configuration pointing to server

## Environment Configuration

### 1. Clone Repository

```bash
git clone https://github.com/your-org/formula-pm.git
cd formula-pm
```

### 2. Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env.production

# Edit production environment file
nano .env.production
```

### 3. Required Environment Variables

```bash
# Database Configuration
POSTGRES_DB=formula_pm
POSTGRES_USER=formula_pm
POSTGRES_PASSWORD=your_secure_postgres_password

# JWT Secrets (Generate strong random strings)
JWT_SECRET=your_jwt_secret_minimum_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_different_from_jwt

# Application URLs
CORS_ORIGIN=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# AWS Configuration (for file storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your-formula-pm-bucket

# Monitoring
GRAFANA_PASSWORD=secure_grafana_password
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

## Docker Deployment

### 1. Production Deployment

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 2. Individual Service Management

```bash
# Start specific services
docker-compose -f docker-compose.prod.yml up -d postgres redis
docker-compose -f docker-compose.prod.yml up -d backend
docker-compose -f docker-compose.prod.yml up -d frontend

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3

# Update services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --no-deps backend frontend
```

### 3. Database Initialization

```bash
# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate:deploy

# Seed initial data (optional)
docker-compose -f docker-compose.prod.yml exec backend npm run db:seed
```

## CI/CD Pipeline Setup

### 1. GitHub Actions Configuration

The CI/CD pipeline is automatically configured in `.github/workflows/ci-cd.yml`. Configure the following secrets in your GitHub repository:

```bash
# GitHub Repository Secrets
STAGING_HOST=your.staging.server.com
STAGING_USER=deploy
STAGING_PRIVATE_KEY=your_staging_ssh_private_key

PRODUCTION_HOST=your.production.server.com
PRODUCTION_USER=deploy
PRODUCTION_PRIVATE_KEY=your_production_ssh_private_key
PRODUCTION_DOMAIN=yourdomain.com

SLACK_WEBHOOK_URL=your_slack_webhook_for_notifications
```

### 2. Pipeline Stages

1. **Security Analysis**: Trivy vulnerability scanning
2. **Frontend Tests**: ESLint, unit tests, build
3. **Backend Tests**: ESLint, API tests, database tests
4. **Integration Tests**: End-to-end testing
5. **Docker Build**: Multi-platform image builds
6. **Performance Tests**: Load testing with k6
7. **Staging Deployment**: Automated deployment to staging
8. **Production Deployment**: Manual approval required

### 3. Manual Deployment Commands

```bash
# Deploy to staging
ssh deploy@staging.server.com 'cd /opt/formula-pm && docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d'

# Deploy to production
ssh deploy@production.server.com 'cd /opt/formula-pm && docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d'
```

## SSL/TLS Configuration

### 1. Let's Encrypt Setup

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

### 2. SSL Configuration Files

Place your SSL certificates in:
```
ssl/
├── formulapm.com.crt
├── formulapm.com.key
└── dhparam.pem
```

### 3. Generate DH Parameters

```bash
# Generate strong DH parameters (takes time)
openssl dhparam -out ssl/dhparam.pem 4096
```

## Monitoring and Logging

### 1. Enable Monitoring Stack

```bash
# Start monitoring services
docker-compose -f docker-compose.prod.yml --profile monitoring up -d

# Access monitoring dashboards
# Grafana: http://your-server:3000 (admin/your_grafana_password)
# Prometheus: http://your-server:9090
```

### 2. Log Management

```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Log rotation is handled automatically
# Logs are stored in Docker volumes and rotated based on size
```

### 3. Health Monitoring

```bash
# Check application health
curl http://your-server:5014/health
curl http://your-server:3003/health

# Monitor system resources
docker stats
```

## Backup and Recovery

### 1. Automated Database Backups

```bash
# Make backup script executable
chmod +x scripts/backup-database.sh

# Run manual backup
./scripts/backup-database.sh

# Setup automated backups (crontab)
crontab -e
# Add: 0 2 * * * /opt/formula-pm/scripts/backup-database.sh
```

### 2. Backup Verification

```bash
# List available backups
ls -la backups/

# Test backup restoration
docker-compose -f docker-compose.prod.yml exec postgres psql -U formula_pm -d postgres -c "CREATE DATABASE formula_pm_test;"
gunzip -c backups/formula_pm_backup_YYYYMMDD_HHMMSS.sql.gz | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U formula_pm -d formula_pm_test
```

### 3. Disaster Recovery

```bash
# Complete system restoration
# 1. Deploy infrastructure
docker-compose -f docker-compose.prod.yml up -d postgres redis

# 2. Restore database
gunzip -c backups/latest_backup.sql.gz | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U formula_pm -d formula_pm

# 3. Start application services
docker-compose -f docker-compose.prod.yml up -d backend frontend
```

## Security Hardening

### 1. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 5014/tcp   # Block direct backend access
sudo ufw deny 5432/tcp   # Block direct database access
```

### 2. System Updates

```bash
# Regular system updates
sudo apt update && sudo apt upgrade -y

# Docker security updates
sudo apt update docker-ce docker-ce-cli containerd.io
```

### 3. Access Control

```bash
# Disable root SSH login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
# Set: PasswordAuthentication no

# Restart SSH service
sudo systemctl restart ssh
```

## Performance Optimization

### 1. Database Optimization

```bash
# Connect to PostgreSQL and optimize
docker-compose -f docker-compose.prod.yml exec postgres psql -U formula_pm -d formula_pm

-- Analyze and optimize tables
ANALYZE;
VACUUM;

-- Check performance
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

### 2. Redis Optimization

```bash
# Connect to Redis and check memory usage
docker-compose -f docker-compose.prod.yml exec redis redis-cli info memory

# Configure memory policy in redis.conf
maxmemory 512mb
maxmemory-policy allkeys-lru
```

### 3. Application Performance

```bash
# Run performance tests
k6 run scripts/performance-test.js

# Monitor application metrics
docker-compose -f docker-compose.prod.yml exec backend npm run monitor
```

## Troubleshooting

### 1. Common Issues

#### Service Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs service-name

# Check container status
docker-compose -f docker-compose.prod.yml ps

# Restart service
docker-compose -f docker-compose.prod.yml restart service-name
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Check connection from backend
docker-compose -f docker-compose.prod.yml exec backend npm run db:test
```

#### Performance Issues
```bash
# Check resource usage
docker stats

# Check database queries
docker-compose -f docker-compose.prod.yml exec postgres psql -U formula_pm -d formula_pm -c "SELECT * FROM pg_stat_activity;"

# Check application logs for slow operations
docker-compose -f docker-compose.prod.yml logs backend | grep "slow"
```

### 2. Log Analysis

```bash
# Search logs for errors
docker-compose -f docker-compose.prod.yml logs | grep ERROR

# Monitor real-time logs
docker-compose -f docker-compose.prod.yml logs -f --tail=100

# Export logs for analysis
docker-compose -f docker-compose.prod.yml logs > application.log
```

### 3. Emergency Procedures

#### Complete Service Restart
```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Start essential services first
docker-compose -f docker-compose.prod.yml up -d postgres redis

# Wait for databases to be ready
sleep 30

# Start application services
docker-compose -f docker-compose.prod.yml up -d backend frontend
```

#### Database Recovery
```bash
# Stop application
docker-compose -f docker-compose.prod.yml stop backend frontend

# Restore from backup
gunzip -c backups/latest_backup.sql.gz | docker-compose -f docker-compose.prod.yml exec -T postgres psql -U formula_pm -d formula_pm

# Start application
docker-compose -f docker-compose.prod.yml start backend frontend
```

## Support and Maintenance

### 1. Regular Maintenance Schedule

- **Daily**: Monitor logs and performance metrics
- **Weekly**: Update system packages, review security logs
- **Monthly**: Update Docker images, run security scans
- **Quarterly**: Review and update SSL certificates, performance optimization

### 2. Contact Information

- **Development Team**: dev@formulapm.com
- **DevOps Team**: devops@formulapm.com
- **Emergency Contact**: +1-XXX-XXX-XXXX

### 3. Documentation Updates

This guide should be updated whenever:
- New deployment procedures are added
- Configuration changes are made
- New monitoring tools are integrated
- Security procedures are updated

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintained By**: Formula PM DevOps Team