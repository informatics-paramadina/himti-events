<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user && isset($user->role) && $user->role === 'admin') {
            return $this->adminDashboard();
        }

        return $this->userDashboard();
    }

    protected function adminDashboard()
    {
        // DUMMY DATA untuk development
        $activeEvents = [
            [
                'id' => 1,
                'title' => 'Tech Workshop 2024',
                'description' => 'Workshop tentang teknologi terkini',
                'date' => '2024-03-15T10:00:00',
                'location' => 'Auditorium Kampus',
                'quota' => 100,
                'status' => 'PUBLISHED',
                '_count' => ['participants' => 45]
            ],
            [
                'id' => 2,
                'title' => 'Seminar Kewirausahaan',
                'description' => 'Seminar tentang memulai bisnis dari nol',
                'date' => '2024-03-20T13:00:00',
                'location' => 'Zoom Meeting',
                'quota' => 200,
                'status' => 'PUBLISHED',
                '_count' => ['participants' => 150]
            ],
            [
                'id' => 3,
                'title' => 'Hackathon Competition',
                'description' => 'Kompetisi coding 24 jam non-stop',
                'date' => '2024-04-01T08:00:00',
                'location' => 'Lab Komputer Gedung A',
                'quota' => 50,
                'status' => 'PUBLISHED',
                '_count' => ['participants' => 30]
            ]
        ];

        $recentParticipants = [
            [
                'id' => 1,
                'name' => 'Ahmad Fauzi',
                'nim' => '2101001',
                'email' => 'ahmad.fauzi@student.ac.id',
                'status' => 'REGISTERED',
                'createdAt' => '2024-02-20T10:30:00',
                'event' => [
                    'id' => 1,
                    'title' => 'Tech Workshop 2024'
                ]
            ],
            [
                'id' => 2,
                'name' => 'Siti Nurhaliza',
                'nim' => '2101002',
                'email' => 'siti.nur@student.ac.id',
                'status' => 'ATTENDED',
                'createdAt' => '2024-02-19T14:20:00',
                'event' => [
                    'id' => 2,
                    'title' => 'Seminar Kewirausahaan'
                ]
            ],
            [
                'id' => 3,
                'name' => 'Budi Santoso',
                'nim' => '2101003',
                'email' => 'budi.santoso@student.ac.id',
                'status' => 'REGISTERED',
                'createdAt' => '2024-02-19T09:15:00',
                'event' => [
                    'id' => 1,
                    'title' => 'Tech Workshop 2024'
                ]
            ],
            [
                'id' => 4,
                'name' => 'Dewi Kartika',
                'nim' => '2101004',
                'email' => 'dewi.kartika@student.ac.id',
                'status' => 'REGISTERED',
                'createdAt' => '2024-02-18T16:45:00',
                'event' => [
                    'id' => 3,
                    'title' => 'Hackathon Competition'
                ]
            ]
        ];

        return Inertia::render('Dashboard/Admin', [
            'stats' => [
                'totalEvents' => 5,
                'totalParticipants' => 225,
                'activeEvents' => 3,
            ],
            'recentParticipants' => $recentParticipants,
            'registrationStats' => [],
            'activeEvents' => $activeEvents,
        ]);
    }

    protected function userDashboard()
    {
        // DUMMY DATA untuk development
        $myEvents = [
            [
                'id' => 1,
                'name' => 'Ahmad Fauzi',
                'status' => 'REGISTERED',
                'event' => [
                    'id' => 1,
                    'title' => 'Tech Workshop 2024',
                    'date' => '2024-03-15T10:00:00',
                    'location' => 'Auditorium Kampus'
                ]
            ],
            [
                'id' => 2,
                'name' => 'Ahmad Fauzi',
                'status' => 'ATTENDED',
                'event' => [
                    'id' => 2,
                    'title' => 'Seminar Kewirausahaan',
                    'date' => '2024-02-10T13:00:00',
                    'location' => 'Zoom Meeting'
                ]
            ]
        ];

        $availableEvents = [
            [
                'id' => 1,
                'title' => 'Tech Workshop 2024',
                'description' => 'Workshop tentang teknologi terkini termasuk AI, Web3, dan Cloud Computing',
                'date' => '2024-03-15T10:00:00',
                'location' => 'Auditorium Kampus',
                'quota' => 100,
                'status' => 'PUBLISHED',
                '_count' => ['participants' => 45]
            ],
            [
                'id' => 2,
                'title' => 'Seminar Kewirausahaan',
                'description' => 'Seminar tentang memulai bisnis dari nol bersama founder startup sukses',
                'date' => '2024-03-20T13:00:00',
                'location' => 'Zoom Meeting',
                'quota' => 200,
                'status' => 'PUBLISHED',
                '_count' => ['participants' => 150]
            ],
            [
                'id' => 3,
                'title' => 'Hackathon Competition',
                'description' => 'Kompetisi coding 24 jam non-stop dengan hadiah total 50 juta',
                'date' => '2024-04-01T08:00:00',
                'location' => 'Lab Komputer Gedung A',
                'quota' => 50,
                'status' => 'PUBLISHED',
                '_count' => ['participants' => 30]
            ],
            [
                'id' => 4,
                'title' => 'Career Fair 2024',
                'description' => 'Bursa kerja tahunan dengan 50+ perusahaan ternama',
                'date' => '2024-04-15T09:00:00',
                'location' => 'Hall Utama Kampus',
                'quota' => 500,
                'status' => 'PUBLISHED',
                '_count' => ['participants' => 200]
            ],
            [
                'id' => 5,
                'title' => 'Workshop Design Thinking',
                'description' => 'Belajar metodologi design thinking untuk inovasi produk',
                'date' => '2024-05-01T14:00:00',
                'location' => 'Ruang Seminar',
                'quota' => 40,
                'status' => 'PUBLISHED',
                '_count' => ['participants' => 15]
            ]
        ];

        return Inertia::render('Dashboard/User', [
            'myEvents' => $myEvents,
            'availableEvents' => $availableEvents,
        ]);
    }
}
