# Formula PM - Operations Runbook

## Overview

This runbook provides step-by-step procedures for operating and maintaining Formula PM in production environments. It includes incident response procedures, maintenance tasks, and troubleshooting guides.

## Table of Contents

1. [Emergency Contacts](#emergency-contacts)
2. [Service Architecture](#service-architecture)
3. [Monitoring and Alerts](#monitoring-and-alerts)
4. [Incident Response](#incident-response)
5. [Maintenance Procedures](#maintenance-procedures)
6. [Performance Optimization](#performance-optimization)
7. [Security Operations](#security-operations)
8. [Backup and Recovery](#backup-and-recovery)
9. [Troubleshooting Playbooks](#troubleshooting-playbooks)
10. [Change Management](#change-management)

## Emergency Contacts

### On-Call Rotation
- **Primary**: DevOps Engineer (Phone: +1-XXX-XXX-XXXX)
- **Secondary**: Senior Developer (Phone: +1-XXX-XXX-XXXX)
- **Escalation**: Engineering Manager (Phone: +1-XXX-XXX-XXXX)

### Communication Channels
- **Slack**: #formula-pm-alerts
- **Email**: alerts@formulapm.com
- **Status Page**: status.formulapm.com

## Service Architecture

### Production Services
```
Frontend (Nginx) → Backend (Node.js) → Database (PostgreSQL)
                 ↓                   ↓
              Redis Cache          File Storage (AWS S3)
```

### Service Dependencies
- **Frontend**: Depends on Backend API
- **Backend**: Depends on PostgreSQL, Redis, AWS S3
- **Database**: Independent service
- **Monitoring**: Prometheus, Grafana

### Health Check Endpoints
- **Frontend**: `https://formulapm.com/health`
- **Backend**: `https://api.formulapm.com/health`
- **Database**: Internal health check via backend

## Monitoring and Alerts

### Key Metrics to Monitor

#### Application Metrics
- Response time (95th percentile < 500ms)
- Error rate (< 1%)
- Request volume
- Active users
- Database connection pool usage

#### Infrastructure Metrics
- CPU usage (< 80%)
- Memory usage (< 85%)
- Disk usage (< 80%)
- Network I/O
- Container health status

#### Business Metrics
- User registrations
- Project creation rate
- Report generation success rate
- File upload success rate

### Alert Thresholds

#### Critical Alerts (Immediate Response)
- Service completely down
- Error rate > 5%
- Response time > 2 seconds
- Database connection failures
- Disk usage > 95%

#### Warning Alerts (Response within 30 minutes)
- Error rate > 1%
- Response time > 1 second
- CPU usage > 80%
- Memory usage > 85%
- Disk usage > 80%

## Incident Response

### Severity Levels

#### P0 - Critical (Response: Immediate)
- Complete service outage
- Data loss or corruption
- Security breach
- Payment system down

#### P1 - High (Response: 15 minutes)
- Partial service outage
- Significant performance degradation
- Critical feature unavailable

#### P2 - Medium (Response: 1 hour)
- Minor performance issues
- Non-critical feature issues
- Intermittent errors

#### P3 - Low (Response: Next business day)
- Cosmetic issues
- Enhancement requests
- Documentation updates

### Incident Response Procedures

#### 1. Initial Response
```bash
# Check overall system status
curl https://formulapm.com/health
curl https://api.formulapm.com/health

# Check service status
docker-compose -f docker-compose.prod.yml ps

# Check recent logs
docker-compose -f docker-compose.prod.yml logs --tail=100 -f
```

#### 2. Assessment
- Identify affected services
- Determine impact scope
- Estimate affected user count
- Check for related alerts

#### 3. Communication
- Post in #formula-pm-alerts
- Update status page
- Notify stakeholders if P0/P1

#### 4. Resolution
- Follow specific playbooks (see below)
- Implement temporary fixes if needed
- Deploy permanent fixes
- Verify resolution

#### 5. Post-Incident
- Document timeline
- Conduct post-mortem
- Implement preventive measures

## Maintenance Procedures

### Daily Maintenance

#### Health Check Routine
```bash
#!/bin/bash
# Daily health check script

echo "=== Formula PM Daily Health Check ==="
echo "Date: $(date)"

# Check service status
echo "Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# Check disk usage
echo "Checking disk usage..."
df -h

# Check memory usage
echo "Checking memory usage..."
free -h

# Check recent errors
echo "Checking recent errors..."
docker-compose -f docker-compose.prod.yml logs --since=24h | grep -i error | tail -10

# Check backup status
echo "Checking backup status..."
ls -la backups/ | tail -3

echo "=== Health Check Complete ==="
```

### Weekly Maintenance

#### Security Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose -f docker-compose.prod.yml pull

# Restart services with new images
docker-compose -f docker-compose.prod.yml up -d

# Verify services are healthy
sleep 30
curl https://formulapm.com/health
```

#### Log Rotation and Cleanup
```bash
# Clean up old logs
find /var/log -name "*.log" -mtime +30 -delete

# Clean up old Docker images
docker system prune -f

# Clean up old backups (keep last 30 days)
find backups/ -name "*.sql.gz" -mtime +30 -delete
```

### Monthly Maintenance

#### Performance Review
```bash
# Generate performance report
k6 run scripts/performance-test.js > monthly-performance-$(date +%Y%m).json

# Database maintenance
docker-compose -f docker-compose.prod.yml exec postgres psql -U formula_pm -d formula_pm -c "VACUUM ANALYZE;"

# Check slow queries
docker-compose -f docker-compose.prod.yml exec postgres psql -U formula_pm -d formula_pm -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

## Performance Optimization

### Database Optimization

#### Query Performance
```sql
-- Check for slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check for missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
AND n_distinct > 100;

-- Analyze table statistics
ANALYZE;
```

#### Connection Pool Tuning
```bash
# Check connection pool status
docker-compose -f docker-compose.prod.yml exec backend node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log('Connection pool status:', prisma._engine._connectionState);
"
```

### Application Performance

#### Memory Usage Optimization
```bash
# Check Node.js memory usage
docker-compose -f docker-compose.prod.yml exec backend node -e "
console.log('Memory usage:', process.memoryUsage());
setInterval(() => {
  global.gc && global.gc();
  console.log('After GC:', process.memoryUsage());
}, 5000);
"
```

#### Cache Performance
```bash
# Check Redis cache hit rate
docker-compose -f docker-compose.prod.yml exec redis redis-cli info stats | grep cache

# Check cache memory usage
docker-compose -f docker-compose.prod.yml exec redis redis-cli info memory
```

## Security Operations

### Security Monitoring

#### Log Analysis
```bash
# Check for suspicious activity
docker-compose -f docker-compose.prod.yml logs | grep -E "(failed|unauthorized|403|401)" | tail -20

# Check for repeated failed logins
docker-compose -f docker-compose.prod.yml logs | grep "login.*failed" | cut -d' ' -f1-3 | sort | uniq -c | sort -nr
```

#### Vulnerability Scanning
```bash
# Run Trivy security scan
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image formula-pm-backend:latest

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image formula-pm-frontend:latest
```

### Access Control Audit

#### User Access Review
```sql
-- Check active user sessions
SELECT id, email, last_login, created_at 
FROM users 
WHERE last_login > NOW() - INTERVAL '30 days'
ORDER BY last_login DESC;

-- Check admin users
SELECT id, email, role, created_at 
FROM users 
WHERE role = 'admin';
```

## Backup and Recovery

### Backup Procedures

#### Automated Daily Backup
```bash
# Backup script runs automatically via cron
# Manual execution:
./scripts/backup-database.sh

# Verify backup integrity
gunzip -t backups/latest_backup.sql.gz
```

#### File Storage Backup
```bash
# Sync uploaded files to backup location
aws s3 sync s3://formula-pm-storage s3://formula-pm-backup/files/$(date +%Y%m%d)/
```

### Recovery Procedures

#### Database Recovery
```bash
# Stop application services
docker-compose -f docker-compose.prod.yml stop backend frontend

# Restore database from backup
gunzip -c backups/formula_pm_backup_YYYYMMDD_HHMMSS.sql.gz | \
  docker-compose -f docker-compose.prod.yml exec -T postgres psql -U formula_pm -d formula_pm

# Start application services
docker-compose -f docker-compose.prod.yml start backend frontend

# Verify application functionality
curl https://formulapm.com/health
```

#### Point-in-Time Recovery
```bash
# For PostgreSQL PITR (if configured)
# Stop PostgreSQL
docker-compose -f docker-compose.prod.yml stop postgres

# Restore base backup
# Restore WAL files up to desired point

# Start PostgreSQL
docker-compose -f docker-compose.prod.yml start postgres
```

## Troubleshooting Playbooks

### Service Down Playbook

#### Frontend Service Down
```bash
# Check frontend container status
docker-compose -f docker-compose.prod.yml ps frontend

# Check frontend logs
docker-compose -f docker-compose.prod.yml logs frontend --tail=50

# Check Nginx configuration
docker-compose -f docker-compose.prod.yml exec frontend nginx -t

# Restart frontend service
docker-compose -f docker-compose.prod.yml restart frontend

# Verify health
curl https://formulapm.com/health
```

#### Backend Service Down
```bash
# Check backend container status
docker-compose -f docker-compose.prod.yml ps backend

# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend --tail=50

# Check database connectivity
docker-compose -f docker-compose.prod.yml exec backend npm run db:test

# Check Redis connectivity
docker-compose -f docker-compose.prod.yml exec backend node -e "
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });
client.connect().then(() => console.log('Redis connected')).catch(console.error);
"

# Restart backend service
docker-compose -f docker-compose.prod.yml restart backend

# Verify health
curl https://api.formulapm.com/health
```

### Database Issues Playbook

#### High Database Load
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

-- Kill long-running queries if necessary
SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '30 minutes';
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Check connection limits
docker-compose -f docker-compose.prod.yml exec postgres psql -U formula_pm -d formula_pm -c "
SELECT setting FROM pg_settings WHERE name = 'max_connections';
SELECT count(*) FROM pg_stat_activity;
"

# Restart PostgreSQL if necessary
docker-compose -f docker-compose.prod.yml restart postgres
```

### Performance Issues Playbook

#### High Response Times
```bash
# Check CPU and memory usage
docker stats

# Check database performance
docker-compose -f docker-compose.prod.yml exec postgres psql -U formula_pm -d formula_pm -c "
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 5;
"

# Check cache hit rate
docker-compose -f docker-compose.prod.yml exec redis redis-cli info stats | grep cache_hits

# Run performance test
k6 run --duration=2m --vus=10 scripts/performance-test.js
```

## Change Management

### Deployment Process

#### Pre-Deployment Checklist
- [ ] Code review completed
- [ ] Tests passing in CI/CD
- [ ] Security scan passed
- [ ] Performance tests passed
- [ ] Backup completed
- [ ] Rollback plan prepared
- [ ] Stakeholders notified

#### Deployment Steps
```bash
# 1. Backup current state
./scripts/backup-database.sh

# 2. Pull latest images
docker-compose -f docker-compose.prod.yml pull

# 3. Deploy with zero downtime
docker-compose -f docker-compose.prod.yml up -d --no-deps backend
sleep 30
docker-compose -f docker-compose.prod.yml up -d --no-deps frontend

# 4. Verify deployment
curl https://formulapm.com/health
curl https://api.formulapm.com/health

# 5. Run smoke tests
npm run test:smoke
```

#### Post-Deployment Checklist
- [ ] Health checks passing
- [ ] Smoke tests passed
- [ ] Monitoring alerts normal
- [ ] Performance within acceptable range
- [ ] Error rates normal
- [ ] User acceptance verification

### Rollback Procedures

#### Application Rollback
```bash
# 1. Identify previous working version
docker images | grep formula-pm

# 2. Tag current version for potential re-deployment
docker tag formula-pm-backend:latest formula-pm-backend:rollback-$(date +%Y%m%d)

# 3. Deploy previous version
docker-compose -f docker-compose.prod.yml down
# Edit docker-compose.prod.yml to use previous image tags
docker-compose -f docker-compose.prod.yml up -d

# 4. Verify rollback
curl https://formulapm.com/health
```

#### Database Rollback
```bash
# Only if schema changes were made
# 1. Stop application
docker-compose -f docker-compose.prod.yml stop backend frontend

# 2. Restore from pre-deployment backup
gunzip -c backups/pre_deployment_backup.sql.gz | \
  docker-compose -f docker-compose.prod.yml exec -T postgres psql -U formula_pm -d formula_pm

# 3. Start application
docker-compose -f docker-compose.prod.yml start backend frontend
```

## Contact Information

### Team Contacts
- **DevOps Lead**: devops-lead@formulapm.com
- **Backend Team**: backend-team@formulapm.com
- **Frontend Team**: frontend-team@formulapm.com
- **Database Admin**: dba@formulapm.com

### External Vendors
- **AWS Support**: Your AWS Support Plan
- **Domain Registrar**: Your domain provider
- **SSL Certificate Provider**: Let's Encrypt or your SSL provider

---

**Document Version**: 1.0.0
**Last Updated**: January 2025
**Next Review**: April 2025
**Owner**: DevOps Team