# Setup & Deployment Guide

**Step-by-step instructions to install, configure, and deploy EventHub.**

---

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Running the Development Server](#running-the-development-server)
5. [Building for Production](#building-for-production)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

**System Requirements:**
- Windows 10+ / macOS 10.14+ / Linux (Ubuntu 20.04+)
- 4GB RAM minimum (8GB recommended)
- 5GB disk space

**Software Requirements:**

| Software | Version | Download |
|----------|---------|----------|
| PHP | 8.1+ | https://www.php.net/downloads |
| Node.js | 18+ | https://nodejs.org |
| Composer | Latest | https://getcomposer.org |
| MySQL/PostgreSQL | 5.7+ / 12+ | https://www.mysql.com or https://www.postgresql.org |
| Git | Latest | https://git-scm.com |

---

### Step 1: Clone Repository

```bash
# Navigate to desired folder
cd ~/projects

# Clone the repository
git clone https://github.com/your-org/event-system.git
cd event-system

# (Optional) Create a local branch
git checkout -b develop
```

---

### Step 2: Install PHP Dependencies

```bash
# Install Composer packages
composer install

# (If first setup) Initialize database
php artisan migrate:fresh --seed
```

**What this does:**
- Downloads all PHP packages listed in `composer.json`
- Installs Laravel framework
- Sets up database schema
- Seeds test data

**Troubleshoot:**
```bash
# If composer install fails, clear cache
composer clear-cache

# Ensure PHP is in PATH
php --version
```

---

### Step 3: Install Node Dependencies

```bash
# Install npm packages
npm install

# Check installation
npm --version
```

**Packages installed:**
- React 18
- TailwindCSS 3
- Inertia.js
- Vite bundler
- ESLint, Prettier

---

### Step 4: Create Environment File

```bash
# Copy .env.example to .env
cp .env.example .env

# Generate application key
php artisan key:generate
```

---

### Step 5: Configure Database

**Option A: MySQL (Recommended for beginners)**

1. Open MySQL client (or Workbench):
   ```bash
   mysql -u root -p
   ```

2. Create database:
   ```sql
   CREATE DATABASE event_system;
   ```

3. Update `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=event_system
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

**Option B: PostgreSQL**

1. Create database:
   ```bash
   createdb event_system
   ```

2. Update `.env`:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=event_system
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   ```

**Option C: SQLite (Quick testing)**

1. Update `.env`:
   ```env
   DB_CONNECTION=sqlite
   DB_DATABASE=database.sqlite
   ```

2. Create database file:
   ```bash
   touch database/database.sqlite
   ```

---

### Step 6: Run Database Migrations

```bash
# Run all migrations
php artisan migrate

# Seed test data
php artisan db:seed

# Verify
php artisan tinker
Event::count()
// Returns: 10 (or number of seeded events)
```

---

## Environment Configuration

### Key Environment Variables

Create/Edit `.env` file:

```env
# App
APP_NAME="EventHub"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_TIMEZONE=Asia/Jakarta

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=event_system
DB_USERNAME=root
DB_PASSWORD=root

# Cache & Session
CACHE_DRIVER=file
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Queue
QUEUE_CONNECTION=sync

# Mail (Optional)
MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@eventhub.local

# App-specific
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=mt1
```

### Environment by Stage

**Local Development (`APP_ENV=local`):**
- `APP_DEBUG=true` — Show error details
- `LOG_CHANNEL=single` — Log to single file
- Use SQLite or local MySQL

**Staging (`APP_ENV=staging`):**
- `APP_DEBUG=true` — For debugging
- `LOG_CHANNEL=stack` — Multiple log files
- Use staging database

**Production (`APP_ENV=production`):**
- `APP_DEBUG=false` — Hide error details
- `LOG_CHANNEL=stack` — Comprehensive logging
- Use production database

---

## Database Setup

### Create Database

```bash
# MySQL
mysql -u root -p -e "CREATE DATABASE event_system;"

# PostgreSQL
sudo -u postgres createdb event_system
```

### Run Migrations

```bash
# Fresh migration (careful! drops all tables)
php artisan migrate:fresh

# Regular migration
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# See migration status
php artisan migrate:status
```

### Seed Test Data

```bash
# Run all seeders
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=EventSeeder

# Fresh + seed
php artisan migrate:fresh --seed
```

### Access Database Directly

```bash
# Laravel Tinker (interactive shell)
php artisan tinker

# Inside tinker:
Event::limit(5)->get()
Event::create(['title' => 'Test', 'date' => now(), ...])
User::first()->email
Participant::count()
```

---

## Running the Development Server

### Terminal Setup

**Terminal 1: Laravel Server**
```bash
cd event-system
php artisan serve
```

Output:
```
Starting Laravel development server: http://127.0.0.1:8000
[timestamp] Local:   http://127.0.0.1:8000
```

**Terminal 2: Vite (React build)**
```bash
cd event-system
npm run dev
```

Output:
```
VITE v5.4.21  ready in 245 ms

➜ Local:   http://localhost:5173/
➜ Network: use --host to access the network
```

### Now Open Browser

```
http://localhost:8000
```

You should see EventHub homepage with hero section, carousel, and event grid.

### Hot Module Replacement (HMR)

The Vite dev server automatically:
- Recompiles React/CSS on file changes
- Refreshes browser (hot reload)
- Preserves component state when possible

---

## Building for Production

### 1. Optimize PHP Code

```bash
# Cache Laravel config
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache service providers
php artisan optimize

# Precompile views (optional)
php artisan view:cache
```

### 2. Build Frontend Assets

```bash
# Minify React/CSS/JS
npm run build

# Output goes to: public/build/
# Generated files:
#   - app-XXXXX.css
#   - app-XXXXX.js
#   - manifest.json
```

### 3. Prepare Environment

```bash
# Copy .env to .env.production
cp .env .env.production

# Update .env.production:
APP_DEBUG=false
APP_ENV=production
```

### 4. Test Production Build Locally

```bash
# Disable config/route cache
php artisan config:clear
php artisan route:clear

# Serve with production build
php artisan serve

# Visit http://localhost:8000 to verify
```

---

## Deployment

### Hosting Options

#### Option 1: Shared Hosting (cPanel)

**Steps:**
1. Upload files via FTP to `public_html/`
2. Set document root to `public/`
3. Create MySQL database via cPanel
4. Update `.env` with database credentials
5. Run migrations via SSH: `php artisan migrate`

**Issues & Fixes:**
```bash
# Fix file permissions
chmod -R 755 storage bootstrap/cache

# Check PHP version (need 8.1+)
php -v

# Enable required extensions
# Via cPanel: Multiphp Manager
```

#### Option 2: VPS / Dedicated Server

**Setup Example (Ubuntu 22.04):**

```bash
# 1. Install system packages
sudo apt update && sudo apt upgrade
sudo apt install php8.1-fpm php8.1-mysql php8.1-xml php8.1-curl
sudo apt install nginx mysql-server nodejs npm

# 2. Clone repository
cd /var/www
git clone <repo-url> event-system
cd event-system

# 3. Install dependencies
composer install --optimize-autoloader --no-dev
npm ci --production

# 4. Setup environment
cp .env.example .env
php artisan key:generate

# 5. Database
mysql -u root -p -e "CREATE DATABASE event_system;"
php artisan migrate --force

# 6. Build assets
npm run build

# 7. Setup Nginx
# Create /etc/nginx/sites-available/event-system
```

**Sample Nginx Config:**
```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/event-system/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.html index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### Option 3: Heroku / Vercel / Railway

**Deploy to Heroku:**

```bash
# 1. Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# 2. Login
heroku login

# 3. Create app
heroku create my-event-system

# 4. Set environment variables
heroku config:set APP_ENV=production APP_DEBUG=false

# 5. Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 6. Deploy
git push heroku main

# 7. Run migrations
heroku run php artisan migrate --force
```

---

## Troubleshooting

### Common Issues

#### 1. **"Fatal error: Uncaught PDOException"**

**Problem:** Database connection failed

**Solution:**
```bash
# Check MySQL is running
# Windows: Services → MySQL
# macOS: System Preferences → MySQL
# Linux: sudo service mysql status

# Verify .env database credentials
cat .env | grep DB_

# Test connection
php artisan tinker
DB::connection()->getPdo()
```

#### 2. **"Vite Manifest not found"**

**Problem:** Frontend assets not built

**Solution:**
```bash
# Rebuild assets
npm run build

# Clear Laravel cache
php artisan cache:clear

# Should see public/build/manifest.json
ls public/build/
```

#### 3. **"Class 'Event' not found"**

**Problem:** Model not registered

**Solution:**
```bash
# Ensure class exists
ls app/Models/Event.php

# Run Tinker to test
php artisan tinker
Event::count()
```

#### 4. **CSRF Token Mismatch**

**Problem:** Form submission fails

**Solution:**
```blade
<!-- Add to all forms -->
@csrf

<!-- Or in React: -->
<input type="hidden" name="_token" value={csrfToken} />
```

#### 5. **Storage Folder Permission Denied**

**Problem:** Cannot upload files

**Solution:**
```bash
# Fix permissions
sudo chmod -R 755 storage bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache

# On local/Windows: skip permission issues
```

#### 6. **npm install Stuck**

**Problem:** Dependencies resolving slowly

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Install with legacy peer deps
npm install --legacy-peer-deps

# Or use alternative: pnpm
npm install -g pnpm
pnpm install
```

### Debug Mode

**Enable Detailed Logging:**

```php
// In .env
APP_DEBUG=true
LOG_LEVEL=debug

// In config/logging.php
'channels' => [
    'single' => [
        'driver' => 'single',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
    ],
],
```

**View Logs:**
```bash
# Real-time log tail
tail -f storage/logs/laravel.log

# Or using Tinker
php artisan tinker
Log::getMonolog()->popHandler()
```

---

## Running Tests

### PHP Unit Tests

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/EventControllerTest.php

# Run with coverage report
php artisan test --coverage

# Generate HTML coverage
php artisan test --coverage --coverage-html=coverage
```

### React Tests

```bash
# Run Jest tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## Performance Optimization

### 1. Cache Configuration

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. Database Optimization

```php
// Use indexes
Schema::table('events', function (Blueprint $table) {
    $table->index('status');
    $table->index('date');
});

// Use proper relationships
Event::with('participants')->get();  // ✅ Good
Event::leftJoin('participants', ...)->get();  // ❌ Bad
```

### 3. Asset Optimization

```javascript
// In vite.config.js
export default defineConfig({
  build: {
    minify: 'terser',  // Minify JS
    cssCodeSplit: true,  // Split CSS
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
        }
      }
    }
  }
});
```

### 4. Enable Gzip Compression

```nginx
# In Nginx config
gzip on;
gzip_types text/css application/javascript;
gzip_vary on;
```

---

## Monitoring & Maintenance

### Daily Tasks

```bash
# Monitor logs
tail -f storage/logs/laravel.log

# Check database size
SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) as size_mb
FROM information_schema.tables
WHERE table_schema = 'event_system'
ORDER BY (data_length + index_length) DESC;
```

### Weekly Tasks

```bash
# Clear old logs
php artisan log:clear

# Prune old jobs/logs
php artisan schedule:run

# Update dependencies (with testing)
composer update --dry-run
npm outdated
```

### Monthly Tasks

```bash
# Database backup
mysqldump event_system > backup-$(date +%Y%m%d).sql

# Update dependencies
composer update
npm update

# Run full test suite
php artisan test --coverage
npm test -- --coverage
```

---

## Security Checklist

Before production deployment:

- [ ] Set `APP_DEBUG=false`
- [ ] Update `APP_KEY` via `php artisan key:generate`
- [ ] Set strong database password
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure CORS properly
- [ ] Setup WebACL/firewall
- [ ] Enable Laravel security headers
- [ ] Regular backups (daily)
- [ ] Monitor error logs
- [ ] Update dependencies regularly

---

## Useful Commands Cheatsheet

```bash
# Laravel Artisan Commands
php artisan serve                    # Start dev server
php artisan migrate                  # Run migrations
php artisan migrate:fresh --seed     # Reset + seed
php artisan db:seed                  # Run seeders
php artisan cache:clear              # Clear cache
php artisan config:cache             # Cache config
php artisan tinker                   # Interactive shell
php artisan make:migration <name>    # Create migration
php artisan make:seeder <name>       # Create seeder
php artisan make:controller <name>   # Create controller

# NPM Commands
npm install                          # Install packages
npm run dev                          # Dev server with HMR
npm run build                        # Production build
npm test                             # Run tests
npm run lint                         # Lint code

# Composer Commands
composer install                     # Install packages
composer install --no-dev            # Prod (no dev packages)
composer dump-autoload               # Regenerate autoloader
composer update                      # Update packages
```

---

**Last updated:** February 24, 2026  
For technical support, see [Laravel Docs](https://laravel.com/docs) and [Deployment Guides](https://laravel.com/docs/10.x/deployment)
