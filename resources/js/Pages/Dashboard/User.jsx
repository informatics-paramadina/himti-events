import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function UserDashboard({ auth, myEvents, availableEvents }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* My Registered Events */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-2xl font-bold text-gray-900">My Registered Events</h3>
                        {myEvents && myEvents.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {myEvents.map((registration) => (
                                    <div key={registration.id} className="overflow-hidden bg-white rounded-lg shadow-sm">
                                        <div className="p-6">
                                            <h4 className="mb-2 text-lg font-semibold text-gray-900">
                                                {registration.event?.title}
                                            </h4>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                                    {new Date(registration.event?.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPinIcon className="w-4 h-4 mr-2" />
                                                    {registration.event?.location}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                    registration.status === 'ATTENDED' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : registration.status === 'REGISTERED'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {registration.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500">You haven't registered for any events yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Available Events */}
                    <div>
                        <h3 className="mb-4 text-2xl font-bold text-gray-900">Available Events</h3>
                        {availableEvents && availableEvents.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {availableEvents.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={`/events/${event.id}`}
                                        className="overflow-hidden transition bg-white rounded-lg shadow-sm hover:shadow-md"
                                    >
                                        <div className="p-6">
                                            <h4 className="mb-2 text-lg font-semibold text-gray-900">
                                                {event.title}
                                            </h4>
                                            <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                                                {event.description}
                                            </p>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                                    {new Date(event.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPinIcon className="w-4 h-4 mr-2" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <UsersIcon className="w-4 h-4 mr-2" />
                                                    {event._count?.participants || 0} / {event.quota}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                                    View Details →
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500">No events available at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
