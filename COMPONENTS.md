# Component Reference Guide

**Detailed documentation for EventHub components** — usage, props, and examples.

---

## Table of Contents
1. [HeroCarousel](#herocarousel)
2. [EventCard](#eventcard)
3. [Ticker](#ticker)
4. [Layout Components](#layout-components)

---

## HeroCarousel

**Location:** `resources/js/Pages/Events/Index.jsx` (lines 75-195)

### Purpose
Displays a featured event in a rotating carousel with 3D flip animation and manual navigation.

### Props

```typescript
interface HeroCarouselProps {
  events: Event[]  // Array of event objects
}
```

### Event Object Structure
```typescript
interface Event {
  id: string
  title: string
  location: string
  date: string         // ISO 8601 date
  poster?: string      // Path to /storage/...
  status: 'PUBLISHED' | 'DRAFT' | 'CLOSED'
  _count?: {
    participants: number
  }
}
```

### Component Logic

```javascript
const HeroCarousel = ({ events }) => {
  // Filter for visible events
  const upcoming = events.filter(e => 
    e.status === 'PUBLISHED' && 
    new Date(e.date) > new Date()
  );
  const items = upcoming.length > 0 ? upcoming : events.slice(0, 6);
  
  // State management
  const [cur, setCur] = useState(0);           // Current card index
  const [flipKey, setFlipKey] = useState(0);   // Triggers 3D flip animation
  const [paused, setPaused] = useState(false); // Pause auto-rotation
  
  // Navigate to card
  const goTo = (n) => {
    setCur((n + total) % total);     // Wrap around
    setFlipKey(k => k + 1);          // Trigger flip
  };
  
  // Auto-rotate every 4 seconds (if not paused)
  useEffect(() => {
    if (paused || total <= 1) return;
    const t = setInterval(() => goTo(cur + 1), 4000);
    return () => clearInterval(t);
  }, [paused, total, cur]);
  
  return (...)
};
```

### Features

#### 1. Auto-Rotation
- **Interval:** 4 seconds
- **Behavior:** Wraps around (after last card → first card)
- **Pause:** Hovering on carousel pauses auto-rotation

#### 2. 3D Flip Animation
- **Trigger:** `flipKey` state increment
- **Duration:** 0.55s
- **Effect:** rotateY(-90deg → 0deg) with scale
- **CSS:**
  ```css
  @keyframes flipIn {
    0%   { transform: rotateY(-90deg) scale(0.95); opacity: 0; }
    60%  { transform: rotateY(8deg) scale(1.02); opacity: 1; }
    100% { transform: rotateY(0deg) scale(1); opacity: 1; }
  }
  ```

#### 3. Layered Card Design
```
Layer 1 (Bottom): Black layer, offset 12px down-right
Layer 2 (Middle): Yellow layer, offset 24px down-right, rotated 3deg
Layer 3 (Top):   White card (actual content), flip animation
```

#### 4. Manual Navigation
- **Left Arrow Button** — Previous card
- **Right Arrow Button** — Next card
- **Click Effect** — Invokes `goTo()` and triggers flip

#### 5. Progress Bar
Shows current position: `01 / 04`
```
[01] [========] [04]
```

### Usage Example

```jsx
import HeroCarousel from '@/Components/HeroCarousel';

function MyPage({ events }) {
  return (
    <HeroCarousel events={events || []} />
  );
}

export default MyPage;
```

### Styling Notes
- **Container:** `w-full max-w-sm` (responsive max-width)
- **Card Border Radius:** `rounded-[2.5rem]`
- **Poster Image:** `object-cover w-full h-full`
- **Poster Height:** `h-60` (240px)
- **Card Aspect:** Tall-ish for featured display

---

## EventCard

**Location:** `resources/js/Pages/Events/Index.jsx` (lines 207-270)

### Purpose
Displays a single event in a grid with poster, status, quota bar, and action buttons.

### Props

```typescript
interface EventCardProps {
  event: Event
  idx: number                    // Card index (for animation stagger)
  showAdminActions?: boolean     // Show edit button?
}
```

### Component Logic

```javascript
const EventCard = ({ event, idx, showAdminActions = false }) => {
  // Get color accent for this card
  const acc = CARD_ACCENT[idx % CARD_ACCENT.length];
  
  // Get status config
  const status = STATUS_CFG[event.status] || STATUS_CFG.DRAFT;
  
  // Calculate quota percentage
  const filled = event._count?.participants || 0;
  const pct = Math.min(Math.round((filled / event.quota) * 100), 100);
  const isFull = pct >= 100;
  
  // Parse event date
  const d = new Date(event.date);
  
  return (...)
};
```

### Features

#### 1. Animated Entrance
```css
@keyframes up {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
- **Delay:** `idx * 60ms` (staggered per card position)
- **Duration:** 0.5s
- **Easing:** cubic-bezier(.22,1,.36,1) — bouncy

#### 2. Color Accents
Cards cycle through 5 color schemes:

```javascript
const CARD_ACCENT = [
  { btn: '#5865F2', bar: '#f97316', cover: 'from-violet-400 to-indigo-600' },   // 0
  { btn: '#111827', bar: '#f87171', cover: 'from-rose-400 to-pink-600' },       // 1
  { btn: '#059669', bar: '#4ade80', cover: 'from-emerald-400 to-teal-600' },    // 2
  { btn: '#2563eb', bar: '#60a5fa', cover: 'from-blue-400 to-cyan-600' },       // 3
  { btn: '#7c3aed', bar: '#c084fc', cover: 'from-purple-400 to-violet-600' },   // 4
];
```

**Usage:** `CARD_ACCENT[idx % 5]` — loops through colors

#### 3. Poster Image
```jsx
{event.poster
  ? <img src={`/storage/${event.poster}`} alt={event.title}
      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
  : <div className={`bg-gradient-to-br ${acc.cover} ...`}>
      <span>{event.title.charAt(0)}</span>
    </div>
}
```
- **Height:** `h-52` (208px)
- **Hover Effect:** `scale-110` (zoom in)
- **Fallback:** Gradient with first letter of title

#### 4. Status Badge
```javascript
const STATUS_CFG = {
  PUBLISHED: { color: '#4ade80', textColor: '#052e16', label: 'Open' },
  DRAFT:     { color: '#fef08a', textColor: '#713f12', label: 'Draft' },
  CLOSED:    { color: '#fca5a5', textColor: '#7f1d1d', label: 'Closed' },
};
```
- **Position:** Top-left corner
- **Style:** Pill-shaped, small border, shadow

#### 5. Date Widget
```jsx
<div className="bg-white b-border-2 rounded-2xl px-3 py-2">
  <p className="text-base font-black">{d.getDate()}</p>
  <p className="text-[9px] font-black text-slate-400 uppercase">
    {d.toLocaleDateString('id-ID', { month: 'short' })}
  </p>
</div>
```
- **Position:** Top-right corner
- **Format:** `23 Jan` (day + abbreviated month)

#### 6. Location Pill
```jsx
<span className="inline-flex items-center gap-1.5 bg-white/95 b-border-2 rounded-full">
  <MapPinIcon className="w-3 h-3" strokeWidth={3} />
  <span className="truncate">{event.location}</span>
</span>
```
- **Position:** Bottom-left corner
- **Truncate:** Long locations cut with ellipsis
- **Max Width:** 200px

#### 7. Quota Progress Bar
```javascript
<div className="relative h-3 overflow-hidden rounded-full bg-slate-100 b-border-2">
  <div style={{
    width: `${pct}%`,
    background: isFull ? '#f87171' : pct >= 80 ? '#fbbf24' : acc.bar,
    borderRight: '3px solid rgba(0,0,0,0.5)',
    transition: 'width 0.55s cubic-bezier(.22,1,.36,1)',
  }} />
</div>
```

**Color States:**
- 🔴 Red (#f87171) — 100% full
- 🟡 Yellow (#fbbf24) — 80-99% full
- 🟢 Custom accent bar — 0-79%

**Display:**
```
03 / 50 peserta  |  6%
```

#### 8. Action Buttons
- **"Lihat Detail"** — Links to `/events/{id}` (always shown)
- **"Edit"** — Links to `/events/{id}/edit` (admin only, if `showAdminActions=true`)

### Usage Example

```jsx
{filteredEvents.map((event, idx) => (
  <EventCard 
    key={event.id} 
    event={event} 
    idx={idx} 
    showAdminActions={isAdmin} 
  />
))}
```

### Hover Effects
- **Image:** Zoom in (`scale-110`)
- **Card:** Lift up (`translate(-3px, -5px)` + shadow boost)
- **Title:** Color change (`text-indigo-600`)

---

## Ticker

**Location:** `resources/js/Pages/Events/Index.jsx` (lines 301-314)

### Purpose
Auto-scrolling marquee displaying event names in a yellow bar.

### Props

```typescript
interface TickerProps {
  events: Event[]  // Array of events to display
}
```

### Component Logic

```javascript
const Ticker = ({ events }) => {
  const items = [...events, ...events];  // Duplicate for seamless loop
  if (events.length === 0) return null;
  
  return (
    <div className="ticker-wrap py-4 overflow-hidden" 
         style={{ background: '#FACC15', borderTop: '4px solid #000', borderBottom: '4px solid #000' }}>
      <div className="ticker-inner">
        {items.map((e, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6 text-sm font-black">
            <span>★</span>
            <span>{e.title}</span>
            <span className="opacity-40 mx-2">|</span>
          </span>
        ))}
      </div>
    </div>
  );
};
```

### Features

#### 1. Auto-Scroll Animation
```css
@keyframes ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.ticker-inner {
  animation: ticker 22s linear infinite;
}
```
- **Duration:** 22 seconds (full loop)
- **Speed:** Linear (constant)
- **Loop:** Infinite

#### 2. Pause on Hover
```css
.ticker-inner:hover {
  animation-play-state: paused;
}
```

#### 3. Seamless Seam
Events list is duplicated internally:
```javascript
const items = [...events, ...events];
```
This creates a seamless loop — when animation reaches 50%, it jumps back to start (invisible operation) but seamlessly continues.

#### 4. Styling
- **Background:** Yellow (#FACC15)
- **Borders:** 4px black top & bottom
- **Text:** Star separator (★) + event name + divider (|)
- **Gap:** 3 units between icon/name/divider

### Usage Example

```jsx
<Ticker events={(events||[]).filter(e => e.status === 'PUBLISHED')} />
```

### Rendering
```
★ Web Development Workshop | ★ Design Hackathon | ★ AI Seminar | ★ Web Development Workshop | ★ Design Hackathon | ★ AI Seminar | ...
(scrolling continuously)
```

---

## Layout Components

### Hero Section
**Location:** `Index.jsx` lines 410-490

#### Structure
```jsx
<div className="grid grid-cols-1 lg:grid-cols-12" style={{ minHeight: '680px' }}>
  {/* Left Panel: Blue, 7 cols on desktop, full width on mobile */}
  <div className="lg:col-span-7 p-8 md:p-14 text-white" style={{ background: '#5865F2' }}>
    {/* Badge, headline, paragraph, CTA, stats, avatars */}
  </div>
  
  {/* Right Panel: Carousel, 5 cols on desktop, full width on mobile */}
  <div className="lg:col-span-5 bg-slate-50 p-8 md:p-12">
    <HeroCarousel events={events} />
  </div>
</div>
```

#### Left Panel Content

1. **Glass Badge**
   ```jsx
   <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255,255,255,0.3)',
        }}>
     🚀 KAMPUS LIFE IS FUN!
   </div>
   ```

2. **Headline**
   ```jsx
   <div className="-space-y-2">
     <h1 style={{ fontSize: 'clamp(3.2rem, 6.5vw, 5.5rem)' }}>
       Upgrade Skill
     </h1>
     <h1 style={{ fontSize: 'clamp(3.2rem, 6.5vw, 5.5rem)' }} 
         className="text-yellow-400 underline decoration-4">
       Di Event Kampus.
     </h1>
   </div>
   ```

3. **Paragraph**
   ```jsx
   <p className="text-base leading-relaxed text-white/90 font-bold">
     Workshop, hackathon, dan seminar terbaik daftar langsung,{' '}
     <span className="text-yellow-300 font-black">gratis, tanpa login.</span>
   </p>
   ```

4. **CTA Button**
   ```jsx
   <a href="#events" className="inline-flex items-center gap-2.5 bg-white text-black font-black text-sm uppercase b-border"
      style={{ padding: '14px 28px', borderRadius: '2rem', boxShadow: '5px 5px 0 rgba(0,0,0,0.3)' }}>
     EXPLORE EVENTS
     <ArrowRightIcon className="w-4 h-4" strokeWidth={3} />
   </a>
   ```

5. **Stats Boxes (3 Glass Boxes)**
   ```jsx
   <div className="flex flex-wrap items-center gap-3 pt-1">
     <div className="bg-white/20 backdrop-blur-sm b-border-2 px-4 py-2.5 rounded-2xl text-center">
       <p style={{ fontSize: '1.8rem' }}>{String((events||[]).length).padStart(2,'0')}</p>
       <p>Total Events</p>
     </div>
     {/* Repeat for "Open Now" and "Gratis" */}
   </div>
   ```

6. **Avatar Row**
   ```jsx
   <div className="flex items-center gap-4 pt-2">
     <div className="flex -space-x-2">
       {['#fecaca', '#bfdbfe', '#bbf7d0'].map((bg, i) => (
         <div key={i} className="w-9 h-9 rounded-full b-border-2" style={{ background: bg }} />
       ))}
     </div>
     <span className="text-sm font-black text-white">+2k teman bergabung!</span>
   </div>
   ```

#### Floating Decorations
```jsx
{/* Fire emoji, top-left */}
<div className="c-float absolute top-10 left-10 w-18 h-18 bg-yellow-400 b-border rounded-2xl flex items-center justify-center text-4xl"
     style={{ width: '72px', height: '72px', boxShadow: '6px 6px 0 #000' }}>
  🔥
</div>

{/* Sparkle emoji, bottom-right */}
<div className="c-floatB absolute bottom-16 right-16 bg-pink-400 b-border rounded-full"
     style={{ width: '60px', height: '60px', boxShadow: '6px 6px 0 #000' }}>
  ✨
</div>
```

Animation:
```css
@keyframes float  { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
@keyframes floatB { 0%,100%{transform:translateY(0) rotate(5deg)} 50%{transform:translateY(-10px) rotate(-3deg)} }
```

---

## Responsive Grid

### Event Card Grid
```css
grid-cols-1           /* Mobile: 1 column */
sm:grid-cols-2        /* Tablet: 2 columns */
lg:grid-cols-3        /* Desktop: 3 columns */
gap-8 sm:gap-10       /* Spacing */
```

### Hero Grid
```css
grid-cols-1           /* Mobile: stacked */
lg:grid-cols-12       /* Desktop: 12-column grid */
lg:col-span-7         /* Hero left: 7 cols */
lg:col-span-5         /* Hero right: 5 cols */
```

---

## State Management Summary

| Component | State | Type | Purpose |
|-----------|-------|------|---------|
| EventsIndex | `statusFilter` | string | Current status filter |
| EventsIndex | `search` | string | Search query |
| HeroCarousel | `cur` | number | Current card index |
| HeroCarousel | `flipKey` | number | Trigger for 3D flip |
| HeroCarousel | `paused` | boolean | Pause auto-rotation |

---

## Common Patterns

### Conditional Rendering
```jsx
{isAuthenticated ? <AdminView /> : <GuestView />}
```

### Map & Filter
```jsx
const filtered = events.filter(e => e.status === 'PUBLISHED');
filtered.map((event, idx) => <EventCard key={event.id} event={event} idx={idx} />)
```

### Dynamic Styling
```jsx
<div style={{
  background: status.color,
  color: status.textColor,
  boxShadow: '4px 4px 0 #000'
}}>
  {status.label}
</div>
```

### Animation Delays
```jsx
style={{ animationDelay: `${idx * 60}ms` }}
```

---

## Tips & Tricks

✅ **Do:**
- Use Tailwind utilities first before inline styles
- Keep component props simple and focused
- Use semantic HTML elements (`<button>`, `<a>`, etc.)
- Leverage Inertia `Link` component for internal navigation

❌ **Don't:**
- Use inline styles for repetitive styling (extract to CSS)
- Pass too many props to a component
- Hardcode color values (use constants like `CARD_ACCENT`)
- Use `setTimeout` for animations (use CSS `@keyframes`)

---

**Last updated:** February 24, 2026
