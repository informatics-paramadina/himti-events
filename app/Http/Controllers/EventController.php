<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    // DUMMY DATA untuk development
    protected function getDummyEvents()
    {
        return [
            [
                'id' => 1,
                'title' => 'Tech Workshop 2024',
                'description' => 'Workshop tentang teknologi terkini termasuk AI, Web3, dan Cloud Computing. Peserta akan mendapat materi lengkap dan sertifikat.',
                'date' => '2024-03-15T10:00:00',
                'location' => 'Auditorium Kampus',
                'quota' => 100,
                'status' => 'PUBLISHED',
                'poster' => null,
                'creatorId' => 1,
                'createdAt' => '2024-02-01T10:00:00',
                'creator' => ['id' => 1, 'name' => 'Admin'],
                '_count' => ['participants' => 45],
                'participants' => []
            ],
            [
                'id' => 2,
                'title' => 'Seminar Kewirausahaan',
                'description' => 'Seminar tentang memulai bisnis dari nol bersama founder startup sukses. Dapatkan tips dan strategi membangun bisnis.',
                'date' => '2024-03-20T13:00:00',
                'location' => 'Zoom Meeting',
                'quota' => 200,
                'status' => 'PUBLISHED',
                'poster' => null,
                'creatorId' => 1,
                'createdAt' => '2024-02-05T10:00:00',
                'creator' => ['id' => 1, 'name' => 'Admin'],
                '_count' => ['participants' => 150],
                'participants' => []
            ],
            [
                'id' => 3,
                'title' => 'Hackathon Competition',
                'description' => 'Kompetisi coding 24 jam non-stop dengan hadiah total 50 juta. Terbuka untuk semua mahasiswa aktif.',
                'date' => '2024-04-01T08:00:00',
                'location' => 'Lab Komputer Gedung A',
                'quota' => 50,
                'status' => 'PUBLISHED',
                'poster' => null,
                'creatorId' => 1,
                'createdAt' => '2024-02-10T10:00:00',
                'creator' => ['id' => 1, 'name' => 'Admin'],
                '_count' => ['participants' => 30],
                'participants' => []
            ],
            [
                'id' => 4,
                'title' => 'Career Fair 2024',
                'description' => 'Bursa kerja tahunan dengan 50+ perusahaan ternama dari berbagai industri. Kesempatan emas untuk fresh graduate!',
                'date' => '2024-04-15T09:00:00',
                'location' => 'Hall Utama Kampus',
                'quota' => 500,
                'status' => 'PUBLISHED',
                'poster' => null,
                'creatorId' => 1,
                'createdAt' => '2024-02-12T10:00:00',
                'creator' => ['id' => 1, 'name' => 'Admin'],
                '_count' => ['participants' => 200],
                'participants' => []
            ],
            [
                'id' => 5,
                'title' => 'Workshop Design Thinking',
                'description' => 'Belajar metodologi design thinking untuk inovasi produk. Cocok untuk mahasiswa yang ingin jadi product designer.',
                'date' => '2024-05-01T14:00:00',
                'location' => 'Ruang Seminar Lantai 3',
                'quota' => 40,
                'status' => 'DRAFT',
                'poster' => null,
                'creatorId' => 1,
                'createdAt' => '2024-02-15T10:00:00',
                'creator' => ['id' => 1, 'name' => 'Admin'],
                '_count' => ['participants' => 0],
                'participants' => []
            ]
        ];
    }

    /**
     * Display a listing of events
     */
    public function index(Request $request)
    {
        $events = $this->getDummyEvents();
        
        // Filter by status if provided
        if ($request->has('status')) {
            $status = strtoupper($request->status);
            $events = array_filter($events, function($event) use ($status) {
                return $event['status'] === $status;
            });
        }

        // If not admin, only show published events
        if (!Auth::check() || (Auth::user()->role ?? 'user') !== 'admin') {
            $events = array_filter($events, function($event) {
                return $event['status'] === 'PUBLISHED';
            });
        }

        return Inertia::render('Events/Index', [
            'events' => array_values($events),
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Show the form for creating a new event
     */
    public function create()
    {
        return Inertia::render('Events/Create');
    }

    /**
     * Store a newly created event (DUMMY - tidak menyimpan ke database)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'location' => 'required|string',
            'quota' => 'required|integer|min:1',
            'status' => 'in:DRAFT,PUBLISHED,CLOSED',
            'poster' => 'nullable|image|max:2048',
        ]);

        // DUMMY: Simulasi sukses tanpa menyimpan
        return redirect()->route('events.index')
            ->with('success', 'Event created successfully! (DUMMY MODE - Data tidak tersimpan)');
    }

    /**
     * Display the specified event
     */
    public function show($id)
    {
        $events = $this->getDummyEvents();
        $event = collect($events)->firstWhere('id', (int)$id);

        if (!$event) {
            abort(404, 'Event not found');
        }

        // Calculate remaining quota
        $remainingQuota = $event['quota'] - ($event['_count']['participants'] ?? 0);

        return Inertia::render('Events/Show', [
            'event' => $event,
            'remainingQuota' => $remainingQuota,
            'canRegister' => $remainingQuota > 0 && $event['status'] === 'PUBLISHED',
        ]);
    }

    /**
     * Show the form for editing the specified event
     */
    public function edit($id)
    {
        $events = $this->getDummyEvents();
        $event = collect($events)->firstWhere('id', (int)$id);

        if (!$event) {
            abort(404, 'Event not found');
        }

        return Inertia::render('Events/Edit', [
            'event' => $event,
        ]);
    }

    /**
     * Update the specified event (DUMMY - tidak menyimpan ke database)
     */
    public function update(Request $request, $id)
    {
        $events = $this->getDummyEvents();
        $event = collect($events)->firstWhere('id', (int)$id);

        if (!$event) {
            abort(404, 'Event not found');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'location' => 'required|string',
            'quota' => 'required|integer|min:1',
            'status' => 'in:DRAFT,PUBLISHED,CLOSED',
            'poster' => 'nullable|image|max:2048',
        ]);

        // DUMMY: Simulasi sukses
        return redirect()->route('events.show', $id)
            ->with('success', 'Event updated successfully! (DUMMY MODE - Data tidak tersimpan)');
    }

    /**
     * Remove the specified event (DUMMY - tidak menghapus dari database)
     */
    public function destroy($id)
    {
        $events = $this->getDummyEvents();
        $event = collect($events)->firstWhere('id', (int)$id);

        if (!$event) {
            abort(404, 'Event not found');
        }

        // DUMMY: Simulasi sukses
        return redirect()->route('events.index')
            ->with('success', 'Event deleted successfully! (DUMMY MODE - Data tidak terhapus)');
    }

    /**
     * Publish an event (DUMMY)
     */
    public function publish($id)
    {
        return back()->with('success', 'Event published successfully! (DUMMY MODE)');
    }

    /**
     * Close an event (DUMMY)
     */
    public function close($id)
    {
        return back()->with('success', 'Event closed successfully! (DUMMY MODE)');
    }
}

