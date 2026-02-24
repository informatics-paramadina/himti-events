<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ParticipantController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/events');
});

// Admin shortcut — redirect to login
Route::get('/admin', function () {
    return redirect('/login');
});

// Dashboard - differentiated by role
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Public event routes (view only)
Route::get('/events', [EventController::class, 'index'])->name('events.index');

// Public registration - guest dapat register tanpa login
Route::post('/events/{eventId}/register', [ParticipantController::class, 'store'])
    ->name('events.register');

// Authenticated event routes
Route::middleware(['auth'])->group(function () {
    // Admin-only event management (must be BEFORE the show route!)
    Route::middleware(['admin'])->group(function () {
        Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
        Route::post('/events', [EventController::class, 'store'])->name('events.store');
        Route::get('/events/{id}/edit', [EventController::class, 'edit'])->name('events.edit');
        Route::put('/events/{id}', [EventController::class, 'update'])->name('events.update');
        Route::delete('/events/{id}', [EventController::class, 'destroy'])->name('events.destroy');
        Route::post('/events/{id}/publish', [EventController::class, 'publish'])->name('events.publish');
        Route::post('/events/{id}/close', [EventController::class, 'close'])->name('events.close');
        
        // Participant management
        Route::get('/events/{eventId}/participants', [ParticipantController::class, 'index'])
            ->name('participants.index');
        Route::get('/events/{eventId}/participants/export', [ParticipantController::class, 'export'])
            ->name('participants.export');
        Route::post('/events/{eventId}/participants/mark-attendance', [ParticipantController::class, 'markAttendance'])
            ->name('participants.mark-attendance');
        Route::put('/events/{eventId}/participants/{participantId}/status', [ParticipantController::class, 'updateStatus'])
            ->name('participants.update-status');
    });
});

// Public event show route (must be AFTER all admin routes!)
Route::get('/events/{id}', [EventController::class, 'show'])->name('events.show');

// Profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
