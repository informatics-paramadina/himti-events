# Vercel Build Error - Resolution Guide

**Your build succeeded but deployment failed.** Here's how to fix it.

---

## Error Message

```
Error: No Output Directory named "dist" found after the Build completed.
Configure the Output Directory in your Project Settings.
```

---

## Why This Happened

Vercel's default configuration expects a **frontend-only project** with output in a `dist/` folder. Your project is a **full-stack Laravel + React app** with output in `public/build/`.

```
Your structure:
├── public/
│   ├── build/           ← Vite outputs here
│   │   ├── manifest.json
│   │   ├── assets/
│   │   └── index.html
│   ├── index.php        ← Laravel entry point
│   └── ...
├── app/
├── package.json
└── vercel.json          ← We created this
```

---

## Solution

### Option A: Use vercel.json (Quick Fix)

We already created a `vercel.json` in your project root. It tells Vercel:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "public",
  "env": {
    "APP_ENV": "production",
    "APP_DEBUG": "false",
    "APP_URL": "@VERCEL_PROJECT_PRODUCTION_URL"
  },
  "framework": "laravel"
}
```

**What to do:**
1. ✅ File already created at `c:\event-system\vercel.json`
2. Push to GitHub: `git add vercel.json && git commit -m "Add Vercel config" && git push`
3. Redeploy on Vercel dashboard
4. Build should complete successfully

---

### Option B: Recommended - Use Railway Instead ⭐

**Railway.app is better for full-stack Laravel apps.** Vercel has limitations for PHP-based projects.

**Why Railway is better:**
- ✅ Native Laravel support (auto-detects)
- ✅ Integrated PostgreSQL database
- ✅ Simple environment setup
- ✅ Better build caching
- ✅ Easier secret management
- ✅ $5-10/month (very affordable)
- ✅ Excellent documentation

**Switch to Railway:**

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Create new project → Deploy from GitHub
4. Select your `event-system` repo
5. Wait for auto-detection (it will recognize Laravel)
6. Add PostgreSQL plugin
7. Set environment variables (template below)
8. Push to GitHub branch to auto-deploy

---

## Environment Variables to Set

If continuing with Vercel, set these in **Project Settings → Environment Variables**:

```
APP_ENV = production
APP_DEBUG = false
APP_URL = https://your-app.vercel.app
APP_KEY = <run locally: php artisan key:generate --show>
DB_HOST = <your-database-host>
DB_PORT = 5432
DB_DATABASE = event_system
DB_USERNAME = <your-db-username>
DB_PASSWORD = <your-db-password>
```

---

## If Using Vercel: Additional Setup Required

**⚠️ Warning:** Vercel has limited PHP support. You would need:

1. **Create API routes** to handle Laravel separately
2. **Deploy frontend-only** to Vercel (React part)
3. **Deploy backend** to Railway/Render (Laravel API)
4. **Configure CORS** to allow frontend to call backend

This is complex. **Railway is simpler for your need.**

---

## Step-by-Step: Switch to Railway (Recommended)

### 1. Create Railway Account
```
1. Visit https://railway.app
2. Click "Start New Project"
3. Sign in with GitHub
4. Authorize Railway to access your repos
```

### 2. Deploy Your Repository
```
1. "New Project" → "Deploy from GitHub repo"
2. Select Yogaprtamaa/event-system
3. Wait for detection (shows "Laravel detected ✓")
4. Click "Deploy"
```

### 3. Add Database
```
1. In Railway dashboard, click "Add Plugin"
2. Search "PostgreSQL" and select
3. Confirm creation
4. Variables automatically added to environment
```

### 4. Set Secrets
```
In Railway dashboard, go to Variables:

APP_KEY = <run this locally and copy>
$ php artisan key:generate --show
# Copy the output and paste into Railway

APP_ENV = production
APP_DEBUG = false
```

### 5. Deploy
```bash
# Just push to GitHub - Railway auto-deploys
git push origin main

# Watch logs in Railway dashboard
# Takes ~3-5 minutes
# Done!
```

### 6. Get Your URL
```
In Railway dashboard:
Your App → Domains → Copy URL
Visit: https://your-app.railway.app
```

---

## Verify Deployment Works

After deploying (whether Vercel or Railway):

```bash
# Check homepage loads
curl https://your-app-domain.com

# Check API endpoint
curl https://your-app-domain.com/api/events

# Check for errors
# (View logs in platform dashboard)
```

---

## If Staying with Vercel

### After Adding vercel.json:

1. **Commit and push:**
   ```bash
   git add vercel.json
   git commit -m "Add Vercel configuration"
   git push origin main
   ```

2. **Redeploy in Vercel:**
   - Go to Vercel dashboard
   - Select your project
   - Click "Redeploy" button
   - Wait for build to complete

3. **Check build logs:**
   - If still fails, click "Build" tab
   - Look for error messages
   - Share logs if issues persist

4. **Common issues with Vercel + Laravel:**
   - ❌ PHP functions not available
   - ❌ `.env` file not accessible
   - ❌ Database migrations limited
   - ❌ File storage challenges

---

## Recommended Path Forward

```
Option 1 (Easiest ⭐⭐⭐):
  Railway.app
  → 5 minute setup
  → $5-10/month
  → Full Laravel support
  → Best for your use case

Option 2 (Current ⭐):
  Fix Vercel config
  → May work but limited
  → Need PHP runtime configured
  → More complex setup
  → Not ideal for full-stack

Option 3 (Professional ⭐⭐⭐):
  DigitalOcean App Platform
  → Full control
  → $21/month minimum
  → Best documentation
  → Recommended for production
```

---

## Quick Checklist

### For Railway (Recommended):
- [ ] Create account at railway.app
- [ ] Connect GitHub repo
- [ ] Select event-system repo
- [ ] Confirm Laravel auto-detection
- [ ] Add PostgreSQL plugin
- [ ] Set APP_KEY environment variable
- [ ] Push to GitHub (auto-deploys)
- [ ] Copy Railway domain and test

### For Vercel (Current):
- [ ] ✅ vercel.json created
- [ ] Push vercel.json to GitHub
- [ ] Redeploy from Vercel dashboard
- [ ] Check build logs for errors
- [ ] Set environment variables if needed
- [ ] Test homepage and API endpoints

---

## Support Resources

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Laravel Deployment:** https://laravel.com/docs/10.x/deployment
- **Render.com Guide:** https://render.com/docs/deploy-laravel

---

## Contact Support

If deployment still fails:

1. **Check build logs** in platform dashboard
2. **Copy full error message**
3. **Check environment variables** match .env
4. **Ensure database is running/connected**
5. **Check app key is set**

Or switch to **Railway.app** (truly recommended) for a hassle-free experience.

---

**Created: February 24, 2026**
