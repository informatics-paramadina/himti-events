# API & Database Reference

**Complete guide to EventHub backend routes, data models, and API endpoints.**

---

## Table of Contents
1. [Database Schema](#database-schema)
2. [API Routes](#api-routes)
3. [Controllers](#controllers)
4. [Validation Rules](#validation-rules)
5. [Response Format](#response-format)

---

## Database Schema

### Event Model

```prisma
model Event {
  id          String   @id @default(cuid())
  title       String   @db.VarChar(255)
  description String   @db.Text
  date        DateTime
  location    String   @db.VarChar(255)
  poster      String?  @db.VarChar(255)
  quota       Int      @default(50)
  status      String   @default("DRAFT")
  
  // Relations
  participants Participant[]
  organizer    User?     @relation("EventOrganizer", fields: [organizerId], references: [id])
  organizerId  String?
  
  // Metadata
  _count      Count?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Fields Explained

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `id` | CUID | Yes | Auto | Unique identifier |
| `title` | String (255) | Yes | — | Event name |
| `description` | Text | Yes | — | Long-form event details |
| `date` | DateTime | Yes | — | Event start time |
| `location` | String (255) | Yes | — | Event venue (e.g., "Aula Utama") |
| `poster` | String (255) | No | NULL | Storage path: `/storage/posters/...` |
| `quota` | Int | Yes | 50 | Max participants |
| `status` | String | Yes | DRAFT | `PUBLISHED`, `DRAFT`, or `CLOSED` |
| `organizerId` | String (FK) | No | NULL | User who created event |
| `createdAt` | DateTime | Auto | now() | Creation timestamp |
| `updatedAt` | DateTime | Auto | now() | Last modified timestamp |

#### Status Values
```
PUBLISHED  → Event is live and accepting registrations
DRAFT      → Event under preparation (admin only visible)
CLOSED     → Registration ended, event archived
```

---

### User Model

```prisma
model User {
  id                     String  @id @default(cuid())
  name                   String  @db.VarChar(255)
  email                  String  @unique
  email_verified_at      DateTime?
  password               String  @db.Text
  remember_token         String?
  role                   String  @default("user")
  
  // Relations
  participants           Participant[]
  organizedEvents        Event?  @relation("EventOrganizer")
  
  // Metadata
  created_at             DateTime @default(now())
  updated_at             DateTime @updatedAt
}
```

#### Roles
```
user   → Standard user, can register for events
admin  → Can create, edit, delete events
```

---

### Participant Model

```prisma
model Participant {
  id        String  @id @default(cuid())
  eventId   String
  userId    String
  
  event     Event   @relation(fields: [eventId], references: [id])
  user      User    @relation(fields: [userId], references: [id])
  
  createdAt DateTime @default(now())
  
  @@unique([eventId, userId])  // Prevent duplicate registrations
}
```

---

## API Routes

### Base URL
```
http://localhost:8000/api
```

### Event Endpoints

#### GET `/api/events`
Retrieve all events with optional filtering

**Query Parameters:**
```
?status=PUBLISHED          // Filter by status
?search=workshop           // Search by title/location
?page=1&per_page=12       // Pagination
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "cj7m2k9d4p0q2r",
      "title": "Web Development Workshop",
      "description": "Learn modern web dev with React and Tailwind",
      "date": "2026-03-15T10:00:00Z",
      "location": "Lab A, Building 3",
      "poster": "/storage/posters/web-workshop.jpg",
      "quota": 50,
      "status": "PUBLISHED",
      "_count": {
        "participants": 23
      },
      "createdAt": "2026-02-20T14:30:00Z",
      "updatedAt": "2026-02-24T09:15:00Z"
    }
  ],
  "meta": {
    "total": 42,
    "per_page": 12,
    "current_page": 1
  }
}
```

**Status Codes:**
- `200` — Success
- `401` — Unauthenticated
- `500` — Server error

---

#### GET `/api/events/{id}`
Retrieve single event details

**Response (200 OK):**
```json
{
  "id": "cj7m2k9d4p0q2r",
  "title": "Web Development Workshop",
  "description": "Learn modern web dev with React and Tailwind",
  "date": "2026-03-15T10:00:00Z",
  "location": "Lab A, Building 3",
  "poster": "/storage/posters/web-workshop.jpg",
  "quota": 50,
  "status": "PUBLISHED",
  "organizer": {
    "id": "user123",
    "name": "Dr. Ahmad",
    "email": "ahmad@campus.edu"
  },
  "_count": {
    "participants": 23
  },
  "createdAt": "2026-02-20T14:30:00Z",
  "updatedAt": "2026-02-24T09:15:00Z"
}
```

---

#### POST `/api/events` *(Admin only)*
Create new event

**Authentication:** Required + Admin role

**Request Body:**
```json
{
  "title": "AI & Machine Learning Seminar",
  "description": "Explore latest trends in AI/ML with industry experts",
  "date": "2026-04-10T14:00:00Z",
  "location": "Auditorium, Blok D",
  "quota": 100,
  "status": "DRAFT"
}
```

**Response (201 Created):**
```json
{
  "id": "cj7m2k9d4p0q2r",
  "title": "AI & Machine Learning Seminar",
  "description": "Explore latest trends in AI/ML with industry experts",
  "date": "2026-04-10T14:00:00Z",
  "location": "Auditorium, Blok D",
  "poster": null,
  "quota": 100,
  "status": "DRAFT",
  "organizerId": "user123",
  "createdAt": "2026-02-24T10:00:00Z",
  "updatedAt": "2026-02-24T10:00:00Z"
}
```

**Errors:**
- `422` — Validation failed (missing required fields)
- `401` — Not authenticated
- `403` — Insufficient permissions

---

#### PUT `/api/events/{id}` *(Admin only)*
Update event details

**Request Body** (partial update):
```json
{
  "title": "Advanced AI Workshop",
  "quota": 150,
  "status": "PUBLISHED"
}
```

**Response (200 OK):**
```json
{
  "id": "cj7m2k9d4p0q2r",
  "title": "Advanced AI Workshop",
  "quota": 150,
  "status": "PUBLISHED",
  "updatedAt": "2026-02-24T11:30:00Z"
}
```

---

#### DELETE `/api/events/{id}` *(Admin only)*
Delete event

**Response (204 No Content):**
```
(empty body)
```

---

### Participant Endpoints

#### POST `/api/events/{eventId}/register`
Register user for event

**Authentication:** Required

**Response (200 OK):**
```json
{
  "id": "participant123",
  "eventId": "cj7m2k9d4p0q2r",
  "userId": "user456",
  "createdAt": "2026-02-24T10:15:00Z"
}
```

**Errors:**
- `404` — Event not found
- `409` — User already registered
- `422` — Event quota full

---

#### DELETE `/api/events/{eventId}/register`
Unregister from event

**Response (204 No Content):**
```
(empty body)
```

---

### Upload Endpoints

#### POST `/api/upload/poster`
Upload event poster image

**Content-Type:** `multipart/form-data`

**Fields:**
```
poster: File (image/jpeg, image/png, max 5MB)
```

**Response (200 OK):**
```json
{
  "path": "/storage/posters/web-workshop-1708752600.jpg",
  "url": "http://localhost:8000/storage/posters/web-workshop-1708752600.jpg"
}
```

**Errors:**
- `422` — Invalid file format or size > 5MB

---

## Controllers

### EventController

**Location:** `app/Http/Controllers/EventController.php`

```php
class EventController extends Controller {
  public function index()          // GET /events
  public function show($id)        // GET /events/{id}
  public function create()         // Show create form
  public function store(Request $request)  // POST /events
  public function edit($id)        // Show edit form
  public function update(Request $request, $id)  // PUT /events/{id}
  public function destroy($id)     // DELETE /events/{id}
}
```

### ParticipantController

```php
class ParticipantController extends Controller {
  public function register(Event $event)     // POST /events/{id}/register
  public function unregister(Event $event)   // DELETE /events/{id}/register
  public function participants(Event $event) // GET /events/{id}/participants
}
```

---

## Validation Rules

### Event Storage Validation

```php
$validated = $request->validate([
    'title' => 'required|string|max:255',
    'description' => 'required|string|min:10',
    'date' => 'required|date|after:now',
    'location' => 'required|string|max:255',
    'quota' => 'required|integer|min:1|max:500',
    'status' => 'in:DRAFT,PUBLISHED,CLOSED',
    'poster' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',  // 5MB
]);
```

### Error Response (422 Validation Error)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "title": ["The title field is required."],
    "date": ["The date must be a date after now."],
    "quota": ["The quota must be at least 1."]
  }
}
```

---

## Response Format

### Success Response

**Format:**
```json
{
  "data": {},
  "message": "Request successful"
}
```

**HTTP Status:**
- `200` — OK (GET, PUT, PATCH)
- `201` — Created (POST)
- `204` — No Content (DELETE)

---

### Error Response

**Format:**
```json
{
  "message": "Error description",
  "errors": {
    "field": ["Error message 1", "Error message 2"]
  }
}
```

**HTTP Status:**
- `400` — Bad Request
- `401` — Unauthorized (missing auth)
- `403` — Forbidden (insufficient permissions)
- `404` — Not Found
- `422` — Unprocessable Entity (validation error)
- `429` — Too Many Requests (rate limited)
- `500` — Internal Server Error

---

## Authentication

### How It Works

1. User logs in via `/login`
2. Laravel creates authenticated session (cookie-based)
3. Inertia.js sends `auth` prop to frontend
4. Frontend can check `auth.user.role` to show/hide admin features

### Protected Routes

**Middleware Stack:**
```php
// Guest only
Route::middleware('guest')->group(function () {
  Route::get('/login', LoginController::class);
  Route::get('/register', RegisterController::class);
});

// Authenticated only
Route::middleware('auth')->group(function () {
  Route::get('/profile', ProfileController::class);
  Route::post('/events', EventController::class . '@store');
});

// Admin only
Route::middleware(['auth', 'admin'])->group(function () {
  Route::put('/events/{id}', EventController::class . '@update');
  Route::delete('/events/{id}', EventController::class . '@destroy');
});
```

### Check User Role in Frontend

```jsx
const isAdmin = auth && auth.user && auth.user.role === 'admin';

if (isAdmin) {
  // Show admin controls
}
```

---

## Database Queries

### Commonly Used Queries

#### Get all published events
```laravel
$events = Event::where('status', 'PUBLISHED')
  ->where('date', '>', now())
  ->with('_count.participants')
  ->orderBy('date')
  ->get();
```

#### Get event with participant count
```laravel
$event = Event::with('_count.participants')
  ->findOrFail($id);

$participantCount = $event->_count->participants;
```

#### Check if user is registered
```laravel
$isRegistered = Participant::where('eventId', $eventId)
  ->where('userId', auth()->id())
  ->exists();
```

#### Get user's registered events
```laravel
$events = auth()->user()
  ->participants()
  ->with('event')
  ->get()
  ->pluck('event');
```

---

## Migration Guide

### Create Events Table

```php
Schema::create('events', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('description');
    $table->dateTime('date');
    $table->string('location');
    $table->string('poster')->nullable();
    $table->integer('quota')->default(50);
    $table->string('status')->default('DRAFT');
    $table->foreignId('organizer_id')->nullable()->constrained('users');
    $table->timestamps();
});
```

### Create Participants Table

```php
Schema::create('participants', function (Blueprint $table) {
    $table->id();
    $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
    $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
    $table->timestamps();
    
    $table->unique(['event_id', 'user_id']);
});
```

---

## Seeding Test Data

### EventSeeder

```php
namespace Database\Seeders;

use App\Models\Event, App\Models\User;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder {
    public function run() {
        $admin = User::first();
        
        Event::create([
            'title' => 'Web Development Workshop',
            'description' => 'Learn React and Tailwind CSS',
            'date' => now()->addDays(7)->setTime(10, 0),
            'location' => 'Lab A, Blok B',
            'quota' => 50,
            'status' => 'PUBLISHED',
            'organizer_id' => $admin->id,
        ]);
    }
}
```

**Run:**
```bash
php artisan db:seed --class=EventSeeder
# or all seeders:
php artisan db:seed
```

---

## Debugging Tips

### Check Routes
```bash
php artisan route:list | grep event
```

### Check Database
```bash
php artisan tinker
Event::all();
Event::find($id)->_count;
```

### Enable Query Logging
```php
DB::enableQueryLog();
// ... your code ...
dd(DB::getQueryLog());
```

### Laravel Telescope (optional)
```bash
composer require laravel/telescope --dev
php artisan telescope:install
```

---

## Performance Optimization

### 1. Use `_count` for participant counts
```php
// Instead of: $event->participants()->count()
// Use: $event->_count->participants
```

### 2. Paginate large datasets
```php
Event::paginate(12);  // 12 per page
```

### 3. Index database columns
```php
$table->index('status');
$table->index('date');
```

### 4. Cache event listings
```php
Cache::remember('events.published', 3600, function () {
    return Event::where('status', 'PUBLISHED')->get();
});
```

---

## Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 401 | Not authenticated | Login first |
| 403 | Not authorized | Need admin role |
| 404 | Not found | Check event ID |
| 422 | Invalid data | Check field validation |
| 429 | Rate limited | Wait before retrying |
| 500 | Server error | Check Laravel logs |

---

## Testing

### Test Event Creation
```php
$this->actingAs($admin)->post('/events', [
    'title' => 'Test Event',
    'description' => 'A test event',
    'date' => now()->addDay(),
    'location' => 'Test Location',
    'quota' => 50,
])->assertStatus(201);
```

### Test Authorization
```php
$this->post('/events', [...])->assertStatus(401);  // Not logged in
$this->actingAs($user)->post('/events', [...])->assertStatus(403);  // Not admin
```

---

**Last updated:** February 24, 2026  
For more help, see [Laravel Docs](https://laravel.com) and [Inertia.js Docs](https://inertiajs.com)
