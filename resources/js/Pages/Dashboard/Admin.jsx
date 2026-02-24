import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    CalendarIcon, 
    UsersIcon, 
    CheckCircleIcon,
    ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function AdminDashboard({ auth, stats, recentParticipants, activeEvents }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CalendarIcon className="h-12 w-12 text-blue-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Events</h3>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <UsersIcon className="h-12 w-12 text-green-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Participants</h3>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalParticipants}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CheckCircleIcon className="h-12 w-12 text-purple-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-gray-500 text-sm font-medium">Active Events</h3>
                                    <p className="text-3xl font-bold text-gray-900">{stats.activeEvents}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Active Events */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">Active Events</h3>
                                    <Link
                                        href="/events/create"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Create Event
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                {activeEvents && activeEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        {activeEvents.map((event) => (
                                            <Link
                                                key={event.id}
                                                href={`/events/${event.id}`}
                                                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition"
                                            >
                                                <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(event.date).toLocaleDateString()}
                                                </p>
                                                <div className="flex items-center mt-2">
                                                    <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                    <span className="text-sm text-gray-600">
                                                        {event._count?.participants || 0} / {event.quota}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No active events</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Participants */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Registrations</h3>
                            </div>
                            <div className="p-6">
                                {recentParticipants && recentParticipants.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentParticipants.map((participant) => (
                                            <div key={participant.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                                <div>
                                                    <p className="font-medium text-gray-900">{participant.name}</p>
                                                    <p className="text-sm text-gray-500">{participant.event?.title}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    participant.status === 'ATTENDED' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : participant.status === 'REGISTERED'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {participant.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No recent registrations</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
