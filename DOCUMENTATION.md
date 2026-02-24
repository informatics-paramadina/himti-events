# EventHub - Campus Event System

**Platform event kampus terbaik** — gratis, fun, dan accessible untuk semua mahasiswa.

---

## 🎯 Project Overview

**EventHub** adalah sistem manajemen event kampus yang dirancang untuk memudahkan mahasiswa menemukan, mendaftar, dan mengikuti berbagai acara di kampus like workshops, hackathons, seminars, dan kompetisi — **semuanya gratis tanpa login wajib**.

### Key Features
- ✅ Event discovery & filtering
- ✅ Real-time participant tracking
- ✅ Status management (Draft, Open, Closed)
- ✅ Quota visualization with progress bars
- ✅ Responsive design (mobile-first)
- ✅ Admin event management dashboard
- ✅ Auto-scrolling carousel (hero section)
- ✅ 3D card flip animation
- ✅ Neo-Brutalism design system

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | Laravel | 10.x |
| **Frontend** | React + Inertia.js | 18 + latest |
| **Styling** | Tailwind CSS | 3.x |
| **Build Tool** | Vite | 5.x |
| **Database** | MySQL / PostgreSQL | Via Prisma |
| **ORM** | Prisma | Latest |
| **UI Icons** | Heroicons | @24/outline |
| **Testing** | PHPUnit | Via Laravel |

---

## 📁 Project Structure

```
event-system/
├── app/
│   ├── Models/
│   │   └── User.php
│   ├── Http/
│   │   ├── Controllers/         # API & page controllers
│   │   ├── Requests/            # Form validation
│   │   ├── Middleware/
│   │   └── Kernel.php
│   ├── Providers/
│   │   ├── EventServiceProvider.php  # Register event listeners
│   │   └── RouteServiceProvider.php
│   └── Console/
│       └── Kernel.php           # Scheduled commands
│
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Events/
│   │   │   │   ├── Index.jsx    # ★ MAIN: Guest hero + event grid
│   │   │   │   ├── Show.jsx     # Event detail page
│   │   │   │   ├── Create.jsx   # Admin: create form
│   │   │   │   └── Edit.jsx     # Admin: edit form
│   │   │   └── Auth/
│   │   ├── Layouts/
│   │   │   └── AuthenticatedLayout.jsx
│   │   ├── Components/
│   │   ├── app.jsx              # Entry point
│   │   └── bootstrap.js         # Inertia setup
│   ├── css/
│   │   └── app.css              # Global styles
│   └── views/
│       └── app.blade.php        # Blade layout
│
├── routes/
│   ├── web.php                  # Web routes
│   ├── api.php                  # API routes
│   ├── auth.php                 # Auth routes
│   └── channels.php             # Broadcasting
│
├── config/
│   ├── app.php                  # App configuration
│   ├── database.php             # DB config
│   └── ... (other configs)
│
├── database/
│   ├── migrations/              # Schema changes
│   ├── factories/               # Model factories
│   └── seeders/                 # Test data
│
├── prisma/
│   └── schema.prisma            # Prisma schema
│
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite bundler config
├── package.json                 # NPM dependencies
├── composer.json                # PHP dependencies
└── README.md (this file)

```

---

## 🎨 Design System: Neo-Brutalism

EventHub menggunakan **Neo-Brutalism** — aesthetic yang bold, unapologetic, dengan strong borders, shadows, dan monochromatic typography.

### Core Principles
1. **Bold Borders** — 4px solid black (`border: 4px solid #000`)
2. **Offsetted Shadows** — 12px shadows dengan 45° angle (`box-shadow: 12px 12px 0px #000`)
3. **High Contrast** — White backgrounds, black text, vibrant accents
4. **Playful Colors** — Yellow (#FACC15), Indigo (#5865F2), Pink, Green as accents
5. **Typography** — Fredoka (display) + Plus Jakarta Sans (body)

### CSS Utility Classes
```css
.b-border      { border: 4px solid #000; }
.b-border-2    { border: 2px solid #000; }
.b-shadow      { box-shadow: 12px 12px 0px #000; }
.b-shadow-md   { box-shadow: 8px 8px 0px #000; }
.b-shadow-sm   { box-shadow: 4px 4px 0px #000; }
.b-btn         { transition: all 0.12s ease; }
  .b-btn:hover { transform: translate(2px,2px); box-shadow: 0; }
```

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Primary | Indigo | `#5865F2` |
| Accent | Yellow | `#FACC15` |
| Background | Cream | `#FFFDF0` |
| Text | Black | `#000000` |
| Muted | Gray | `#64748B` |

### Typography
```
Display (Headlines):   Fredoka 700 — bold, friendly, human
Body Text:             Plus Jakarta Sans 600 — clean, modern, legible
```

---

## 📄 Core Pages

### 1. **Events/Index.jsx** - Guest Homepage
**File**: `resources/js/Pages/Events/Index.jsx` (666 lines)

#### Layout: Hero + Event Grid

```
┌─────────────────────────────────────────────────┐
│ Header (Sticky)                                 │
├─────────────────────────────────────────────────┤
│                  HERO SECTION                   │
│  Blue Panel (7 col)  │  Carousel (5 col)        │
│  • Headline          │  • Featured event card   │
│  • CTA button        │  • Navigation arrows     │
│  • Stats boxes (3)   │  • Progress bar          │
│  • Avatar row        │                          │
├─────────────────────────────────────────────────┤
│           YELLOW TICKER (Auto-scroll)           │
├─────────────────────────────────────────────────┤
│        EVENT GRID (Responsive)                  │
│  Events cards (1 col mobile > 3 cols desktop)   │
├─────────────────────────────────────────────────┤
│ Footer                                          │
└─────────────────────────────────────────────────┘
```

#### Hero Left Panel (Blue #5865F2)
**User sees:**
- 🚀 Glass badge: "KAMPUS LIFE IS FUN!"
- H1 headline: "Upgrade Skill" (white) + "Di Event Kampus." (yellow, underlined)
- P: "Workshop, hackathon, dan seminar terbaik daftar langsung, **gratis, tanpa login.**"
- CTA: White button "EXPLORE EVENTS →" (links to #events)
- 3 Glass stat boxes:
  - "04" Total Events
  - "04" Open Now
  - "100%" Gratis
- Avatar row: 3 colored circles, "+2k teman bergabung!"

#### Hero Carousel (Right Panel)
- **Auto-rotates** every 4 seconds (pauses on hover)
- **3D flip animation** when switching cards
- Shows featured event card with:
  - Poster image (or gradient fallback)
  - Event title, location, date
  - "AMBIL TIKET SEKARANG" button
- **Progress bar** at bottom: `01 [===] 04`
- **Navigation arrows** to manual browse

#### Event Grid
- **Cards per event:**
  - Poster image / gradient cover
  - Status badge (Open/Draft/Closed)
  - Date widget (top-right)
  - Location pill (bottom-left)
  - Title (line-clamped)
  - Quota bar with color coding:
    - 🟢 Green (0-79%)
    - 🟡 Yellow (80-99%)
    - 🔴 Red (100% — "Penuh!")
  - "Lihat Detail" button
  - Animated on scroll in (staggered `.c-up`)

#### Ticker Section
- **Yellow bar** (#FACC15) with auto-scrolling event names
- **Continuous loop** with duplicated items
- **Pauses on hover**
- Syntax: `★ Event Name | ★ Event Name | ...`

#### Search & Filter (Guest)
- Text input for event/location search
- Real-time filtering

#### Authenticated View (Admin Dashboard)
- Same layout but with **admin actions:**
  - Edit button on each event card
  - Status filter buttons (All/Open/Draft/Closed)
  - Create Event button
  - Admin-only create/edit forms

---

### 2. **Events/Show.jsx** - Event Detail Page
**Purpose:** Single event view with full info, similar neo-brutalism styling

---

### 3. **Events/Create.jsx & Edit.jsx** - Event Management Forms
**Purpose:** Admin-only forms to create/edit events

---

## 🧩 Key Components

### `HeroCarousel({ events })`
Props:
- `events` (Array) — list of Event objects

Logic:
- Filters for PUBLISHED + future events, fallback to first 6 events
- Auto-rotates every 4s (unless paused)
- Increments `flipKey` state to trigger 3D flip animation
- Shows progress bar: `current / total`

**3D Flip Animation:**
```javascript
@keyframes flipIn {
  0%   { transform: rotateY(-90deg) scale(0.95); opacity: 0; }
  60%  { transform: rotateY(8deg) scale(1.02); opacity: 1; }
  100% { transform: rotateY(0deg) scale(1); opacity: 1; }
}
```

---

### `EventCard({ event, idx, showAdminActions })`
Props:
- `event` (Object) — Event data
- `idx` (Number) — Index for animation stagger
- `showAdminActions` (Boolean) — Show edit button?

Features:
- Animated entrance (`.c-up` with staggered delay)
- Color-coded accents from `CARD_ACCENT` array (5 color schemes)
- Quota progress bar with color states
- Status badge (green/yellow/red)

---

### `Ticker({ events })`
Props:
- `events` (Array) — PUBLISHED events to scroll

**Animation:**
```css
animation: ticker 22s linear infinite;
@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
```

---

## 📊 Data Model

### Event Schema
```prisma
model Event {
  id          String   @id @default(cuid())
  title       String   @db.VarChar(255)
  description String   @db.Text
  date        DateTime
  location    String   @db.VarChar(255)
  poster      String?  @db.VarChar(255)
  quota       Int      @default(50)
  status      String   @default("DRAFT")  // PUBLISHED, DRAFT, CLOSED
  
  participants Participant[]
  _count      Count?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Participant {
  id      String @id @default(cuid())
  eventId String
  userId  String
  event   Event  @relation(fields: [eventId], references: [id])
  user    User   @relation(fields: [userId], references: [id])
}
```

### Status States
- `PUBLISHED` — Open for registration (visible publicly)
- `DRAFT` — Under preparation (admin only)
- `CLOSED` — Registration ended (archived)

---

## 🎭 Animations

### 1. Float Animation (Hero Emojis)
```css
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50%      { transform: translateY(-18px) rotate(3deg); }
}
```

### 2. Staggered Entrance (Event Cards)
```css
@keyframes up {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Applied with animation-delay: idx * 60ms */
```

### 3. 3D Card Flip (Carousel)
```css
@keyframes flipIn {
  0%   { transform: rotateY(-90deg) scale(0.95); opacity: 0; }
  60%  { transform: rotateY(8deg) scale(1.02); opacity: 1; }
  100% { transform: rotateY(0deg) scale(1); opacity: 1; }
}
/* Triggered by flipKey state change */
```

### 4. Button Hover (Neo-Brutalism)
```css
.b-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #000 !important;
}
/* Simulates "pressed" effect */
```

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
PHP 8.1+
Composer
MySQL/PostgreSQL
```

### Installation

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd event-system
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Setup database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed   # Optional: populate test data
   ```

5. **Run development server**
   ```bash
   # Terminal 1: Laravel dev server
   php artisan serve
   
   # Terminal 2: Vite dev server
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:8000
   ```

### Build for Production
```bash
npm run build
php artisan optimize
```

---

## 🔐 Authentication & Authorization

### Routes
- `GET /events` — Public event listing
- `GET /events/{id}` — Public event detail
- `POST /events` — Admin: create event (requires auth + admin role)
- `PUT /events/{id}` — Admin: update event
- `DELETE /events/{id}` — Admin: delete event

### Middleware
- `auth` — Requires authentication
- `admin` — Requires admin role
- Guest route — No authentication needed

---

## 🎨 Customization Guide

### Change Primary Color
1. Find `#5865F2` in code
2. Replace in:
   - `const CARD_ACCENT` (line ~70)
   - CSS gradients
   - Button colors

Example:
```javascript
// Before
{ btn: '#5865F2', bar: '#f97316', cover: 'from-violet-400 to-indigo-600' }

// After (for purple)
{ btn: '#7c3aed', bar: '#f97316', cover: 'from-purple-400 to-violet-600' }
```

### Add New Event Status
1. Update database schema:
   ```prisma
   // In schema.prisma, update status field options
   status String @default("DRAFT") // Add new value
   ```

2. Update `STATUS_CFG` object:
   ```javascript
   const STATUS_CFG = {
     PUBLISHED: { color: '#4ade80', textColor: '#052e16', label: 'Open' },
     UPCOMING:  { color: '#60a5fa', textColor: '#0c2340', label: 'Upcoming' },  // NEW
     DRAFT:     { color: '#fef08a', textColor: '#713f12', label: 'Draft' },
     CLOSED:    { color: '#fca5a5', textColor: '#7f1d1d', label: 'Closed' },
   };
   ```

### Modify Carousel Auto-Rotate Interval
```javascript
// In HeroCarousel component, change: 4000 → milliseconds
useEffect(() => {
  if (paused || total <= 1) return;
  const t = setInterval(() => goTo(cur + 1), 4000);  // ← Change this
  return () => clearInterval(t);
}, [paused, total, cur]);
```

---

## 🧪 Testing

### Unit Tests (PHP)
```bash
php artisan test
# or
./vendor/bin/phpunit
```

### React Component Testing
```bash
npm test
```

---

## 📱 Responsive Breakpoints

Using Tailwind CSS breakpoints:

| Screen | Cols | CSS |
|--------|------|-----|
| Mobile | 1 | `grid-cols-1` |
| Tablet | 2 | `sm:grid-cols-2` |
| Desktop | 3 | `lg:grid-cols-3` |
| Hero Grid | Change at lg | `lg:grid-cols-12` |

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 2026 | Initial launch |
| | | • Neo-brutalism design |
| | | • Hero carousel with 3D flip |
| | | • Event grid with quota visualization |
| | | • Admin dashboard |

---

## 📞 Support & Issues

### Common Issues

**Q: Carousel not rotating?**
A: Check if `paused` state is true or `events` array is empty.

**Q: Colors not applying?**
A: Clear browser cache, rebuild CSS: `npm run build`

**Q: Event cards missing images?**
A: Upload poster via admin panel, or check `poster` column in database.

---

## 📚 Additional Resources

- [Tailwind CSS Docs](https://tailwindcss.com)
- [Heroicons](https://heroicons.com)
- [Inertia.js Guide](https://inertiajs.com)
- [Laravel Docs](https://laravel.com/docs)
- [React 18 Docs](https://react.dev)

---

**Created with ❤️ for campus life** — EventHub 2026
