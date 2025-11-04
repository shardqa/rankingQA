# Deployment Guide

This guide covers deploying QA Influencers Ranking to various platforms.

## Table of Contents
1. [VPS Deployment (Your Own Server)](#vps-deployment)
2. [Vercel Deployment (Easiest)](#vercel-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Netlify Deployment](#netlify-deployment)

---

## VPS Deployment

Deploy to your own VPS (Ubuntu/Debian) with Docker.

### Prerequisites
- Ubuntu 22.04+ or Debian 11+
- Root or sudo access
- Domain name (optional)
- Docker installed

### Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Nginx
sudo apt install nginx -y
```

### Step 2: Clone Repository

```bash
# Clone to /var/www
cd /var/www
sudo git clone https://github.com/yourusername/qa-influencers-ranking.git
cd qa-influencers-ranking

# Set permissions
sudo chown -R $USER:$USER /var/www/qa-influencers-ranking
```

### Step 3: Install & Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build
npm run start
```

### Step 4: Setup PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start npm --name "qa-ranking" -- start

# Save PM2 config
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs
```

### Step 5: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/qa-ranking
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/qa-ranking /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 6: Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

### Step 7: Setup Automatic Git Pull & Rebuild

Create a deploy script:

```bash
nano /var/www/qa-influencers-ranking/deploy.sh
```

Add:

```bash
#!/bin/bash
cd /var/www/qa-influencers-ranking
git pull origin main
npm install
npm run build
pm2 restart qa-ranking
```

Make it executable:

```bash
chmod +x deploy.sh
```

### Update Process

To update with new data:

```bash
cd /var/www/qa-influencers-ranking
./deploy.sh
```

---

## Vercel Deployment

Easiest option for Next.js projects.

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js settings
5. Click "Deploy"

That's it! Vercel handles everything.

### Custom Domain

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Auto-Deploy

Every push to `main` automatically deploys.

---

## Docker Deployment

### Create Dockerfile

```dockerfile
# /home/user/rankingQA/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Create docker-compose.yml

```yaml
# /home/user/rankingQA/docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

### Build & Run

```bash
# Build image
docker-compose build

# Run container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Netlify Deployment

### Step 1: Create netlify.toml

```toml
# /home/user/rankingQA/netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Deploy

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. "New site from Git"
4. Select repository
5. Deploy

---

## Environment Variables

For all deployment methods, set these if needed:

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Monitoring & Maintenance

### Check Application Health

```bash
# PM2 status
pm2 status

# View logs
pm2 logs qa-ranking

# Restart if needed
pm2 restart qa-ranking
```

### Monitor Server Resources

```bash
# Install htop
sudo apt install htop

# Run
htop
```

### Backup Data

```bash
# Backup JSON data
cp data/qa-professionals.json data/backup-$(date +%Y%m%d).json
```

---

## Performance Optimization

### Enable Gzip Compression (Nginx)

Add to Nginx config:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### Enable Caching

Next.js automatically handles caching. For static assets:

```nginx
location /_next/static/ {
    alias /var/www/qa-influencers-ranking/.next/static/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Troubleshooting

### Port 3000 Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

### Nginx Not Starting

```bash
# Check config
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

---

## Recommended VPS Providers

- **DigitalOcean** - $6/month droplet sufficient for MVP
- **Linode** - $5/month Nanode
- **Vultr** - $5-6/month instances
- **Hetzner** - €4/month (Europe)
- **AWS Lightsail** - $5/month

---

## Cost Estimate

### Free Options:
- **Vercel** - Free tier (recommended for MVP)
- **Netlify** - Free tier

### VPS Options:
- **Server:** $5-10/month
- **Domain:** $10-15/year
- **SSL:** Free (Let's Encrypt)
- **Total:** ~$70-130/year

---

## Next Steps After Deployment

1. Test all features on production
2. Setup monitoring (UptimeRobot, Pingdom)
3. Configure analytics (Google Analytics, Plausible)
4. Setup error tracking (Sentry)
5. Plan data update schedule
6. Promote to QA community!
