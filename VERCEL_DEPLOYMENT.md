# Vercel Deployment Guide

**Configure EventHub for Vercel serverless hosting.**

---

## ⚠️ Important: Vercel + Laravel Consideration

Vercel is primarily optimized for **Node.js, Python, and static sites**. Running full Laravel with PHP on Vercel requires special configuration and may have limitations.

### Best Options for EventHub:

| Option | Best For | Cost | Complexity |
|--------|----------|------|-----------|
| **Railway.app** | Full Laravel + React | $5-20/mo | ⭐ Low |
| **Render.com** | Full stack | Free-$7/mo | ⭐ Low |
| **Vercel (Frontend) + Railway (Backend)** | Separated | Free + $5/mo | ⭐⭐ Medium |
| **Heroku** | Full Laravel | $7+/mo | ⭐ Low |
| **DigitalOcean App Platform** | Full stack | $5-12/mo | ⭐⭐ Medium |
| **Traditional VPS** | Full control | $3-6/mo | ⭐⭐⭐ High |

---

## Option 1: Railway.app (Recommended ✅)

Railway is **the easiest** for Laravel + React apps.

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Create new project

### Step 2: Connect Repository
1. Click "Deploy from GitHub"
2. Select your repository
3. Grant permission

### Step 3: Configure Environment
Railway auto-detects Laravel. But set variables:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-app.railway.app
DB_CONNECTION=postgresql
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_DATABASE=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
```

### Step 4: Add PostgreSQL Database
1. In Railway dashboard, click "Add Plugin"
2. Select "PostgreSQL"
3. Variables auto-populate

### Step 5: Deploy
1. Push to GitHub: `git push origin main`
2. Railway auto-deploys on push
3. Check build logs in dashboard

**Build time:** ~3-5 minutes  
**Cost:** ~$5/month (PostgreSQL) + compute  
**Support:** Excellent docs + community

---

## Option 2: Render.com (Free Tier Available)

Similar to Railway but with generous free tier.

### Step 1: Create Account
Go to [render.com](https://render.com) → Sign in with GitHub

### Step 2: Deploy Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select branch (main)

### Step 3: Build Configuration
```
Build Command:        npm install && npm run build && composer install --no-dev
Start Command:        php artisan serve --host 0.0.0.0 --port 8080
Root Directory:       (leave empty)
```

### Step 4: Environment Variables
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-app.onrender.com
DB_CONNECTION=postgresql
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_DATABASE=$DB_NAME
DB_USERNAME=$DB_USER
DB_PASSWORD=$DB_PASSWORD
```

### Step 5: Create Database
Free PostgreSQL database included. Configure in environment.

**Cost:** Free (with limitations) or $7+/month  
**Build time:** 5-10 minutes

---

## Option 3: Heroku (Still Available ✅)

Heroku discontinued free tier but still viable for full-stack apps.

### Step 1: Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

### Step 2: Create Heroku App
```bash
heroku create my-event-system
```

### Step 3: Add Procfile
Create `Procfile` in project root:

```
web: vendor/bin/heroku-php-apache2 public/
release: php artisan migrate --force
```

### Step 4: Configure Environment
```bash
heroku config:set APP_ENV=production
heroku config:set APP_DEBUG=false
heroku config:set APP_KEY=$(php artisan key:generate --show)
```

### Step 5: Add PostgreSQL
```bash
heroku addons:create heroku-postgresql:essential-0
```

### Step 6: Deploy
```bash
git push heroku main

# Run migrations
heroku run php artisan migrate --force

# View logs
heroku logs --tail
```

**Cost:** $7-50+/month depending on dynos  
**Build time:** 2-3 minutes

---

## Option 4: Vercel (JavaScript Only)

For Vercel, you'd deploy **only the React frontend** and host **Laravel backend separately**.

### Step 4a: Deploy Frontend Only to Vercel

1. Create `public/.vercelignore`:
```
*
!build/
!index.html
!robots.txt
!favicon.ico
```

2. Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "public",
  "routes": [
    { "src": "/build/(.*)", "dest": "/build/$1" },
    { "src": "/(.*)", "status": 404 }
  ]
}
```

3. Deploy:
```bash
npm install -g vercel
vercel
```

### Step 4b: Deploy Laravel Backend to Railway/Render

See Option 1 or 2 above for backend setup.

### Step 4c: Configure CORS

In `config/cors.php`:
```php
'allowed_origins' => [
    'https://your-vercel-app.vercel.app',
],
```

Update API calls in React to point to backend URL:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://your-railway-app.railway.app/api';
```

**Pros:** Fast frontend deployment  
**Cons:** Complex setup, need two hosting providers

---

## Recommended: Use Railway.app

Here's the **simplest complete setup**:

### Quick Start (5 minutes)

1. **Create Railway Account**
   ```
   https://railroad.app → Sign with GitHub
   ```

2. **Create New Project**
   - Click "New Project"
   - "Deploy from GitHub repo"
   - Select `event-system` repo

3. **Add PostgreSQL**
   - Click "Add Plugin"
   - Search "PostgreSQL"
   - Select "PostgreSQL"

4. **Set Environment Variables**
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=<run locally: php artisan key:generate --show>
   APP_URL=${{ Railway.appDomain }}
   ```

5. **Deploy**
   - Push to GitHub: `git push origin main`
   - Railway auto-deploys
   - Done! ✅

**Total time:** ~5 minutes  
**Total cost:** ~$5-10/month  
**Support quality:** ⭐⭐⭐⭐⭐

---

## Troubleshooting Common Errors

### Error: "No Output Directory named 'dist'"

**Cause:** Vercel looking for frontend-only output  
**Solution:** Use Railway/Render (they support full Laravel) or deploy frontend separately

### Error: "PHP Fatal error: Uncaught PDOException"

**Cause:** Database not configured  
**Solution:** 
```bash
# Ensure env variables are set
railway run sh -c 'php artisan migrate --force'
```

### Error: "Class not found: App\Models\Event"

**Cause:** Autoloader not regenerated  
**Solution:**
```bash
railway run composer dump-autoload
```

### Error: "SQLSTATE[HY000] [2002] Connection refused"

**Cause:** Database not running  
**Solution:**
- Check database plugin is added
- Ensure `DB_HOST` matches plugin name
- Restart application

### Build Times > 15 minutes

**Cause:** Dependencies taking too long  
**Solution:**
```bash
# Add .railwayignore or .vercelignore
node_modules/
.git/
storage/logs/
```

---

## Environment Variables by Platform

### Railway.app
```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=${{ Railway.appDomain }}
DB_HOST=${{ Postgres.PGHOST }}
DB_PORT=${{ Postgres.PGPORT }}
DB_DATABASE=${{ Postgres.PGDATABASE }}
DB_USERNAME=${{ Postgres.PGUSER }}
DB_PASSWORD=${{ Postgres.PGPASSWORD }}
```

### Render.com
```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=${{ RENDER_EXTERNAL_URL }}
DATABASE_URL=${{ DATABASE_URL }}
# Render auto-parses DATABASE_URL
```

### Heroku
```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=${{ app domain}}
DATABASE_URL=${{ auto-generated }}
```

---

## Production Checklist

Before deploying:

- [ ] Set `APP_ENV=production`, `APP_DEBUG=false`
- [ ] Generate unique `APP_KEY`: `php artisan key:generate --show`
- [ ] Set `APP_URL` to correct domain
- [ ] Database configured and running
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Seed data (optional): `php artisan db:seed`
- [ ] Clear caches: `php artisan cache:clear`
- [ ] Test locally first: `php artisan serve`
- [ ] Check CORS settings
- [ ] Update `.env.production` if using different profile

---

## Deploy Command Examples

### First Deployment
```bash
# Run all setup
php artisan migrate --force
php artisan db:seed
php artisan cache:clear
```

### Redeployment (after push)
```bash
# Usually automatic, but if needed:
git push origin main
# Platform auto-detects and redeploys
```

### Manual Database Reset
```bash
# WARNING: This deletes all data!
database:migrate:fresh --force --seed
```

---

## Monitoring & Logs

### Railway
```
Dashboard → Your App → Deployments → View Logs
```

### Render
```
Services → Your Service → Logs
```

### Heroku
```bash
heroku logs --tail
heroku logs --num=100
```

---

## Post-Deployment Testing

1. **Homepage loads:** Visit `https://your-app.com`
2. **Hero displays:** Check carousel and stats
3. **Events load:** Grid should show events
4. **Can search:** Type in search box
5. **Admin panel:** Login as admin (if credentials set)
6. **Database:** Check data in dashboard

---

## Auto-Scaling Configuration

For high traffic:

**Railway:** Automatically scales (pay per use)  
**Render:** Configure in service settings
**Heroku:** Add dynos via dashboard

---

## Rollback Previous Deployment

### Railway
1. Dashboard → Deployments tab
2. Click previous deployment
3. Click "Rollback"

### Render
1. Services → Your Service
2. Deployment History
3. Select previous → Redeploy

---

## Domain Configuration

### Custom Domain on Railway
1. Settings → Custom Domains
2. Add domain
3. Copy CNAME record
4. Add to DNS provider

### Custom Domain on Render
1. Settings → Custom Domain
2. Add domain
3. Copy CNAME record
4. Add to DNS provider

---

## Cost Summary

| Platform | Database | Compute | Monthly |
|----------|----------|---------|---------|
| Railway | $5 | Auto | $5-15 |
| Render | Free-$7 | $7 | $7-14 |
| Heroku | Built-in | $7+ | $7-50+ |
| DigitalOcean | $15 | $6 | $21 |

**Recommendation:** Start with Railway free tier, scale as needed.

---

## Next Steps

1. **Choose platform** (Railway recommended)
2. **Create account** on chosen platform
3. **Connect GitHub** repository
4. **Set environment variables**
5. **Deploy** (usually automatic on push)
6. **Test** in production
7. **Monitor** logs for errors

---

**Last updated:** February 24, 2026
