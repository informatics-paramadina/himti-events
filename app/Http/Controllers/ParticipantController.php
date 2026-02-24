<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ParticipantController extends Controller
{
    // DUMMY DATA untuk development
    protected function getDummyParticipants($eventId = null)
    {
        $allParticipants = [
            [
                'id' => 1,
                'name' => 'Ahmad Fauzi',
                'nim' => '2101001',
                'email' => 'ahmad.fauzi@student.ac.id',
                'phone' => '081234567890',
                'jurusan' => 'Teknik Informatika',
                'angkatan' => '2021',
                'status' => 'REGISTERED',
                'eventId' => 1,
                'createdAt' => '2024-02-20T10:30:00'
            ],
            [
                'id' => 2,
                'name' => 'Siti Nurhaliza',
                'nim' => '2101002',
                'email' => 'siti.nur@student.ac.id',
                'phone' => '081234567891',
                'jurusan' => 'Sistem Informasi',
                'angkatan' => '2021',
                'status' => 'ATTENDED',
                'eventId' => 1,
                'createdAt' => '2024-02-19T14:20:00'
            ],
            [
                'id' => 3,
                'name' => 'Budi Santoso',
                'nim' => '2101003',
                'email' => 'budi.santoso@student.ac.id',
                'phone' => '081234567892',
                'jurusan' => 'Teknik Informatika',
                'angkatan' => '2021',
                'status' => 'REGISTERED',
                'eventId' => 1,
                'createdAt' => '2024-02-19T09:15:00'
            ],
            [
                'id' => 4,
                'name' => 'Dewi Kartika',
                'nim' => '2101004',
                'email' => 'dewi.kartika@student.ac.id',
                'phone' => '081234567893',
                'jurusan' => 'Teknik Elektro',
                'angkatan' => '2021',
                'status' => 'REGISTERED',
                'eventId' => 1,
                'createdAt' => '2024-02-18T16:45:00'
            ],
            [
                'id' => 5,
                'name' => 'Eko Prasetyo',
                'nim' => '2101005',
                'email' => 'eko.prasetyo@student.ac.id',
                'phone' => '081234567894',
                'jurusan' => 'Manajemen',
                'angkatan' => '2021',
                'status' => 'CANCELLED',
                'eventId' => 1,
                'createdAt' => '2024-02-18T11:20:00'
            ],
            [
                'id' => 6,
                'name' => 'Fitri Handayani',
                'nim' => '2001015',
                'email' => 'fitri.handayani@student.ac.id',
                'phone' => '081234567895',
                'jurusan' => 'Akuntansi',
                'angkatan' => '2020',
                'status' => 'ATTENDED',
                'eventId' => 2,
                'createdAt' => '2024-02-17T13:00:00'
            ],
            [
                'id' => 7,
                'name' => 'Gilang Ramadhan',
                'nim' => '2201020',
                'email' => 'gilang.ramadhan@student.ac.id',
                'phone' => '081234567896',
                'jurusan' => 'Desain Komunikasi Visual',
                'angkatan' => '2022',
                'status' => 'REGISTERED',
                'eventId' => 3,
                'createdAt' => '2024-02-16T15:30:00'
            ],
            [
                'id' => 8,
                'name' => 'Hana Safitri',
                'nim' => '2101008',
                'email' => 'hana.safitri@student.ac.id',
                'phone' => '081234567897',
                'jurusan' => 'Sistem Informasi',
                'angkatan' => '2021',
                'status' => 'REGISTERED',
                'eventId' => 3,
                'createdAt' => '2024-02-16T10:00:00'
            ]
        ];

        if ($eventId !== null) {
            return array_filter($allParticipants, function($p) use ($eventId) {
                return $p['eventId'] === (int)$eventId;
            });
        }

        return $allParticipants;
    }

    protected function getDummyEvent($id)
    {
        $events = [
            1 => ['id' => 1, 'title' => 'Tech Workshop 2024'],
            2 => ['id' => 2, 'title' => 'Seminar Kewirausahaan'],
            3 => ['id' => 3, 'title' => 'Hackathon Competition'],
            4 => ['id' => 4, 'title' => 'Career Fair 2024'],
            5 => ['id' => 5, 'title' => 'Workshop Design Thinking'],
        ];

        return $events[$id] ?? null;
    }

    /**
     * Display participants for an event
     */
    public function index(Request $request, $eventId)
    {
        $event = $this->getDummyEvent($eventId);

        if (!$event) {
            abort(404, 'Event not found');
        }

        $participants = $this->getDummyParticipants($eventId);

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $status = strtoupper($request->status);
            $participants = array_filter($participants, function($p) use ($status) {
                return $p['status'] === $status;
            });
        }

        // Search by name, NIM, or email
        if ($request->has('search') && $request->search !== '') {
            $search = strtolower($request->search);
            $participants = array_filter($participants, function($p) use ($search) {
                return str_contains(strtolower($p['name']), $search) ||
                       str_contains(strtolower($p['nim']), $search) ||
                       str_contains(strtolower($p['email']), $search);
            });
        }

        return Inertia::render('Participants/Index', [
            'event' => $event,
            'participants' => array_values($participants),
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Store a new participant registration (DUMMY - tidak menyimpan)
     */
    public function store(Request $request, $eventId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'required|string|max:50',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'jurusan' => 'nullable|string|max:100',
            'angkatan' => 'nullable|string|max:10',
        ]);

        // DUMMY: Simulasi sukses
        return redirect()->route('events.show', $eventId)
            ->with('success', 'Registration successful! (DUMMY MODE - Data tidak tersimpan)');
    }

    /**
     * Update participant status (DUMMY)
     */
    public function updateStatus(Request $request, $eventId, $participantId)
    {
        $validated = $request->validate([
            'status' => 'required|in:REGISTERED,ATTENDED,CANCELLED'
        ]);

        return back()->with('success', 'Participant status updated successfully! (DUMMY MODE)');
    }

    /**
     * Export participants to CSV
     */
    public function export($eventId)
    {
        $event = $this->getDummyEvent($eventId);

        if (!$event) {
            abort(404, 'Event not found');
        }

        $participants = $this->getDummyParticipants($eventId);

        $filename = "participants_{$event['title']}_{$eventId}.csv";
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($participants) {
            $file = fopen('php://output', 'w');
            
            // Header row
            fputcsv($file, ['ID', 'Name', 'NIM', 'Email', 'Phone', 'Jurusan', 'Angkatan', 'Status', 'Registered At']);

            // Data rows
            foreach ($participants as $participant) {
                fputcsv($file, [
                    $participant['id'],
                    $participant['name'],
                    $participant['nim'],
                    $participant['email'],
                    $participant['phone'],
                    $participant['jurusan'] ?? '',
                    $participant['angkatan'] ?? '',
                    $participant['status'],
                    $participant['createdAt'],
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Mark attendance (DUMMY)
     */
    public function markAttendance(Request $request, $eventId)
    {
        $validated = $request->validate([
            'participant_ids' => 'required|array',
            'participant_ids.*' => 'integer'
        ]);

        return back()->with('success', count($validated['participant_ids']) . ' participants marked as attended! (DUMMY MODE)');
    }
}

