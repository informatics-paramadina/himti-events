import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { MapPinIcon, UsersIcon, MagnifyingGlassIcon, PlusIcon, FunnelIcon, BoltIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
    body { background-color: #FFFDF0; font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-fredoka { font-family: 'Fredoka', sans-serif; }

    .b-border    { border: 4px solid #000; }
    .b-border-2  { border: 2px solid #000; }
    .b-shadow    { box-shadow: 12px 12px 0px #000; }
    .b-shadow-md { box-shadow: 8px 8px 0px #000; }
    .b-shadow-sm { box-shadow: 4px 4px 0px #000; }
    .b-btn       { transition: all 0.12s ease; }
    .b-btn:hover  { transform: translate(2px,2px); box-shadow: 0px 0px 0px #000 !important; }

    .bg-dots {
        background-image: radial-gradient(circle, #000 1px, transparent 1px);
        background-size: 24px 24px;
        opacity: 0.04;
        pointer-events: none;
    }

    @keyframes float  { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
    @keyframes floatB { 0%,100%{transform:translateY(0) rotate(5deg)} 50%{transform:translateY(-10px) rotate(-3deg)} }
    @keyframes up     { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes heroIn { from{opacity:0;transform:scale(0.97) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes bar    { from{width:0} }
    @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

    .c-float  { animation: float  5s ease-in-out infinite; }
    .c-floatB { animation: floatB 7s ease-in-out infinite; }
    .c-up     { animation: up     0.5s cubic-bezier(.22,1,.36,1) both; }
    .c-heroIn { animation: heroIn 0.65s cubic-bezier(.22,1,.36,1) both; }
    .c-bar    { animation: bar    1.2s ease both; }

    .event-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
    .event-card:hover { transform: translate(-3px,-5px); box-shadow: 14px 14px 0px #000; }

    .ticker-wrap  { overflow: hidden; }
    .ticker-inner { display:flex; animation: ticker 22s linear infinite; white-space:nowrap; }
    .ticker-inner:hover { animation-play-state:paused; }

    .card-layer-yellow { transition: transform 0.45s cubic-bezier(.22,1,.36,1); }
    .hero-card-wrap:hover .card-layer-yellow { transform: translateX(28px) translateY(28px) rotate(6deg) !important; }

    /* 3D card flip */
    .card-3d-scene { perspective: 1200px; }
    @keyframes flipIn  { 0%   { transform: rotateY(-90deg) scale(0.95); opacity: 0; }
                         60%  { transform: rotateY(8deg)  scale(1.02); opacity: 1; }
                         100% { transform: rotateY(0deg)  scale(1);    opacity: 1; } }
    .flip-in  { animation: flipIn  0.55s cubic-bezier(.22,1,.36,1) both; transform-origin: center center; }
`;

const CARD_ACCENT = [
    { btn: '#5865F2', bar: '#f97316', cover: 'from-violet-400 to-indigo-600' },
    { btn: '#111827', bar: '#f87171', cover: 'from-rose-400 to-pink-600'    },
    { btn: '#059669', bar: '#4ade80', cover: 'from-emerald-400 to-teal-600' },
    { btn: '#2563eb', bar: '#60a5fa', cover: 'from-blue-400 to-cyan-600'    },
    { btn: '#7c3aed', bar: '#c084fc', cover: 'from-purple-400 to-violet-600'},
];

const STATUS_CFG = {
    PUBLISHED: { color: '#4ade80', textColor: '#052e16', label: 'Open'   },
    DRAFT:     { color: '#fef08a', textColor: '#713f12', label: 'Draft'  },
    CLOSED:    { color: '#fca5a5', textColor: '#7f1d1d', label: 'Closed' },
};

function HeroCarousel({ events }) {
    const upcoming = events.filter(e => e.status === 'PUBLISHED' && new Date(e.date) > new Date());
    const items    = upcoming.length > 0 ? upcoming : events.slice(0, 6);
    const [cur, setCur]       = useState(0);
    const [flipKey, setFlipKey] = useState(0);
    const [paused, setPaused] = useState(false);
    const total = items.length;

    const goTo = (n) => {
        setCur((n + total) % total);
        setFlipKey(k => k + 1);
    };

    useEffect(() => {
        if (paused || total <= 1) return;
        const t = setInterval(() => goTo(cur + 1), 4000);
        return () => clearInterval(t);
    }, [paused, total, cur]);

    if (total === 0) return (
        <div className="w-full max-w-sm py-16 font-bold text-center text-slate-400">
            Belum ada event tersedia
        </div>
    );

    const item = items[cur];
    const d    = new Date(item.date);

    return (
        <div className="w-full max-w-sm"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}>

            <div className="flex items-end justify-between mb-8">
                <h3 className="font-fredoka text-[2rem] font-bold leading-none text-slate-900">
                    Mendatang<span style={{ color: '#5865F2' }}>.</span>
                </h3>
                {total > 1 && (
                    <div className="flex gap-2.5">
                        {[ChevronLeftIcon, ChevronRightIcon].map((Icon, i) => (
                            <button key={i}
                                onClick={() => goTo(i === 0 ? cur - 1 : cur + 1)}
                                className="flex items-center justify-center w-12 h-12 transition-colors duration-150 bg-white b-border rounded-2xl hover:bg-black hover:text-white"
                                style={{ boxShadow: '4px 4px 0 #000' }}>
                                <Icon className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="relative card-3d-scene hero-card-wrap">
                <div className="card-layer-yellow absolute inset-0 bg-yellow-400 b-border rounded-[2.5rem]"
                    style={{ transform: 'translateX(24px) translateY(24px) rotate(3deg)' }} />
                <div className="absolute inset-0 bg-black b-border rounded-[2.5rem]"
                    style={{ transform: 'translateX(12px) translateY(12px)' }} />

                <div key={flipKey} className="flip-in relative bg-white b-border rounded-[2.5rem] overflow-hidden">
                    <div className="relative overflow-hidden h-60" style={{ borderBottom: '4px solid #000' }}>
                        {item.poster
                            ? <img src={`/storage/${item.poster}`} alt={item.title}
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                            : <div className={`w-full h-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-end pb-5 pl-6`}>
                                <span className="font-bold leading-none select-none font-fredoka text-white/20"
                                    style={{ fontSize: '7.5rem' }}>
                                    {item.title.charAt(0)}
                                </span>
                              </div>
                        }
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-5 left-5">
                            <span className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                                Featured
                            </span>
                        </div>
                    </div>

                    <div className="p-7">
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <h4 className="font-fredoka text-[1.6rem] font-bold leading-snug text-slate-900 flex-1 line-clamp-2">
                                {item.title}
                            </h4>
                            <span className="text-3xl flex-shrink-0 mt-0.5"></span>
                        </div>

                        <div className="space-y-2 mb-7">
                            <p className="flex items-center gap-2.5 text-sm font-bold text-slate-500">
                                <MapPinIcon className="flex-shrink-0 w-4 h-4" strokeWidth={2.5} />
                                <span className="truncate">{item.location}</span>
                            </p>
                            <p className="flex items-center gap-2.5 text-sm font-bold text-slate-500">
                                <CalendarIcon className="flex-shrink-0 w-4 h-4" strokeWidth={2.5} />
                                {d.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
                            </p>
                        </div>

                        <Link href={`/events/${item.id}`}
                            className="b-btn block w-full text-center text-white py-4 rounded-[1.5rem] b-border font-black text-sm uppercase tracking-[0.15em]"
                            style={{ background: '#5865F2', boxShadow: '4px 4px 0 #000' }}>
                            AMBIL TIKET SEKARANG
                        </Link>
                    </div>
                </div>
            </div>

            {total > 1 && (
                <div className="flex items-center gap-4 mt-10">
                    <span className="w-6 text-sm font-black text-center text-slate-500 tabular-nums">
                        {String(cur + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 h-3 overflow-hidden rounded-full b-border-2 bg-slate-200">
                        <div className="h-full rounded-full"
                            style={{
                                width: `${((cur + 1) / total) * 100}%`,
                                background: '#5865F2',
                                borderRight: '3px solid #000',
                                transition: 'width 0.55s cubic-bezier(.22,1,.36,1)',
                            }} />
                    </div>
                    <span className="w-6 text-sm font-black text-center text-slate-400 tabular-nums">
                        {String(total).padStart(2, '0')}
                    </span>
                </div>
            )}
        </div>
    );
}

function EventCard({ event, idx, showAdminActions = false }) {
    const acc    = CARD_ACCENT[idx % CARD_ACCENT.length];
    const status = STATUS_CFG[event.status] || STATUS_CFG.DRAFT;
    const filled = event._count?.participants || 0;
    const pct    = Math.min(Math.round((filled / event.quota) * 100), 100);
    const d      = new Date(event.date);
    const isFull = pct >= 100;

    return (
        <div className="c-up event-card group bg-white rounded-[2rem] b-border b-shadow-md flex flex-col overflow-hidden"
            style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}>

            <div className="relative flex-shrink-0 overflow-hidden h-52">
                {event.poster
                    ? <img src={`/storage/${event.poster}`} alt={event.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                    : <div className={`w-full h-full bg-gradient-to-br ${acc.cover} flex items-end pb-4 pl-5`}>
                        <span className="font-bold leading-none select-none font-fredoka text-white/20"
                            style={{ fontSize: '7rem' }}>
                            {event.title.charAt(0)}
                        </span>
                      </div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between">
                    <span className="b-border-2 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider"
                        style={{ background: status.color, color: status.textColor, boxShadow: '2px 2px 0 #000' }}>
                        {status.label}
                    </span>
                    <div className="bg-white b-border-2 rounded-2xl px-3 py-2 text-center min-w-[46px]"
                        style={{ boxShadow: '2px 2px 0 #000' }}>
                        <p className="text-base font-black leading-none text-slate-900">{d.getDate()}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase mt-0.5">
                            {d.toLocaleDateString('id-ID', { month: 'short' })}
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-3.5 left-3.5">
                    <span className="inline-flex items-center gap-1.5 bg-white/95 b-border-2 px-3 py-1.5 rounded-full text-[10px] font-black text-slate-700 max-w-[200px]"
                        style={{ boxShadow: '2px 2px 0 #000' }}>
                        <MapPinIcon className="flex-shrink-0 w-3 h-3" strokeWidth={3} />
                        <span className="truncate">{event.location}</span>
                    </span>
                </div>
            </div>

            <div className="flex flex-col flex-1 gap-3 p-5">
                <h3 className="font-fredoka text-[1.45rem] font-bold leading-snug text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {event.title}
                </h3>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wide">
                        <span className="flex items-center gap-1.5 text-slate-500">
                            <UsersIcon className="w-3.5 h-3.5" strokeWidth={3} />
                            {filled} / {event.quota} peserta
                        </span>
                        <span className={isFull ? 'text-red-500' : pct >= 80 ? 'text-amber-500' : 'text-emerald-600'}>
                            {isFull ? 'Penuh!' : `${pct}%`}
                        </span>
                    </div>
                    <div className="relative w-full h-3 overflow-hidden rounded-full bg-slate-100 b-border-2">
                        <div className="absolute inset-y-0 left-0 rounded-full c-bar"
                            style={{
                                width: `${pct}%`,
                                borderRight: '3px solid rgba(0,0,0,0.5)',
                                background: isFull ? '#f87171' : pct >= 80 ? '#fbbf24' : acc.bar,
                            }} />
                    </div>
                </div>

                <div className="flex gap-2 pt-1 mt-auto">
                    <Link href={`/events/${event.id}`}
                        className="b-btn b-border flex-1 py-3.5 rounded-2xl text-xs font-black text-white text-center uppercase tracking-widest flex items-center justify-center gap-1.5"
                        style={{ background: acc.btn, boxShadow: '4px 4px 0 #000' }}>
                        Lihat Detail
                        <ArrowRightIcon className="w-3.5 h-3.5" strokeWidth={3} />
                    </Link>
                    {showAdminActions && (
                        <Link href={`/events/${event.id}/edit`}
                            className="b-btn b-border px-4 py-3.5 rounded-2xl text-xs font-black bg-white text-slate-700 uppercase tracking-wider"
                            style={{ boxShadow: '4px 4px 0 #000' }}>
                            Edit
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

function Ticker({ events }) {
    const items = [...events, ...events];
    if (events.length === 0) return null;
    return (
        <div className="py-4 overflow-hidden ticker-wrap"
            style={{ background: '#FACC15', borderTop: '4px solid #000', borderBottom: '4px solid #000' }}>
            <div className="ticker-inner">
                {items.map((e, i) => (
                    <span key={i} className="inline-flex items-center gap-3 px-6 text-sm font-black tracking-wider text-black uppercase">
                        <span></span>
                        <span>{e.title}</span>
                        <span className="mx-2 opacity-40">|</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function EventsIndex({ auth, events, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [search, setSearch]             = useState('');
    const isAuthenticated = auth && auth.user;
    const isAdmin         = isAuthenticated && auth.user.role === 'admin';

    const handleFilterChange = (s) => {
        setStatusFilter(s);
        router.get('/events', { status: s }, { preserveState: true });
    };

    const filteredEvents = search
        ? (events || []).filter(e =>
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.location.toLowerCase().includes(search.toLowerCase()))
        : (events || []);

    const filterButtons = [
        { key: '', label: 'Semua' },
        { key: 'PUBLISHED', label: 'Open' },
        { key: 'DRAFT', label: 'Draft' },
        { key: 'CLOSED', label: 'Closed' },
    ];

    const publishedCount = (events || []).filter(e => e.status === 'PUBLISHED').length;

    if (!isAuthenticated) return (
        <>
            <Head title="Campus Events" />
            <style>{CSS}</style>
            <div className="min-h-screen overflow-x-hidden" style={{ background: '#FFFDF0' }}>
                <div className="fixed inset-0 bg-dots" />

                <header className="sticky top-0 z-50 px-4 pt-4 pb-3 sm:px-6">
                    <nav className="flex items-center justify-between px-5 mx-auto bg-white max-w-7xl b-border rounded-2xl sm:px-7"
                        style={{ height: '68px', boxShadow: '6px 6px 0 #000' }}>
                        <Link href="/events" className="flex items-center gap-2.5">
                            <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 b-border rounded-xl b-btn"
                                style={{ boxShadow: '3px 3px 0 #000' }}>
                                <BoltIcon className="w-5 h-5 text-black" strokeWidth={3} />
                            </div>
                            <span className="font-fredoka text-[1.5rem] font-bold tracking-tight">EventHub.</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Link href="/login"
                                className="hidden sm:block px-5 py-2 text-[13px] font-black uppercase tracking-wider hover:text-indigo-600 transition-colors">
                                Sign In
                            </Link>
                            <Link href="/register"
                                className="b-btn b-border text-white px-5 py-2.5 rounded-xl text-[13px] font-black uppercase tracking-wider"
                                style={{ background: '#5865F2', boxShadow: '4px 4px 0 #000' }}>
                                Daftar
                            </Link>
                        </div>
                    </nav>
                </header>

                <main className="relative z-10 px-4 pb-12 mx-auto sm:px-6 max-w-7xl">

                    <div className="c-heroIn mt-8 bg-white b-border b-shadow rounded-[3.5rem] overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.04] select-none pointer-events-none overflow-hidden"
                            style={{ right: '-2rem', top: '-1rem' }}>
                            <p className="font-bold leading-none text-black font-fredoka"
                                style={{ fontSize: '20rem' }}>EVENT</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12" style={{ minHeight: '680px' }}>
                            <div className="relative flex flex-col justify-center p-8 text-white lg:col-span-7 md:p-14"
                                style={{ background: '#5865F2', borderRight: '4px solid #000' }}>

                                <div className="absolute flex items-center justify-center text-4xl bg-yellow-400 c-float top-10 left-10 w-18 h-18 b-border rounded-2xl"
                                    style={{ width: '72px', height: '72px', boxShadow: '6px 6px 0 #000' }}></div>
                                <div className="absolute flex items-center justify-center text-3xl bg-pink-400 rounded-full c-floatB bottom-16 right-16 b-border"
                                    style={{ width: '60px', height: '60px', boxShadow: '6px 6px 0 #000', animationDelay: '2s' }}></div>

                                <div className="relative z-10 max-w-xl space-y-7">
                                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black tracking-[0.2em] uppercase"
                                        style={{
                                            background: 'rgba(255,255,255,0.18)',
                                            backdropFilter: 'blur(10px)',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                        }}>
                                         KAMPUS LIFE IS FUN!
                                    </div>

                                    <div className="-space-y-2">
                                        <h1 className="font-fredoka font-bold text-white leading-[0.9]"
                                            style={{
                                                fontSize: 'clamp(3.2rem, 6.5vw, 5.5rem)',
                                                textShadow: '5px 5px 0 rgba(0,0,0,0.25)',
                                            }}>
                                            Upgrade Skill
                                        </h1>
                                        <h1 className="font-fredoka font-bold text-yellow-400 leading-[0.9] underline decoration-4"
                                            style={{
                                                fontSize: 'clamp(3.2rem, 6.5vw, 5.5rem)',
                                                textShadow: '5px 5px 0 #1a1a1a',
                                                WebkitTextStroke: '1.2px #1a1a1a',
                                                textDecorationColor: '#1a1a1a',
                                                textUnderlineOffset: '10px',
                                            }}>
                                            Di Event Kampus.
                                        </h1>
                                    </div>

                                    <p className="max-w-md text-base font-bold leading-relaxed text-white/90">
                                        Workshop, hackathon, dan seminar terbaik daftar langsung,{' '}
                                        <span className="font-black text-yellow-300">gratis, tanpa login.</span>
                                    </p>

                                    <a href="#events"
                                        className="group inline-flex items-center gap-2.5 bg-white text-black font-black text-sm uppercase b-border"
                                        style={{
                                            padding: '14px 28px',
                                            borderRadius: '2rem',
                                            boxShadow: '5px 5px 0 rgba(0,0,0,0.3)',
                                            transition: 'all 0.12s ease',
                                            width: 'fit-content',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.transform='translate(2px,2px)'; e.currentTarget.style.boxShadow='0px 0px 0 rgba(0,0,0,0.3)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='5px 5px 0 rgba(0,0,0,0.3)'; }}>
                                        EXPLORE EVENTS
                                        <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                                    </a>

                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex -space-x-2">
                                            {['#fecaca', '#bfdbfe', '#bbf7d0'].map((bg, i) => (
                                                <div key={i} className="bg-white rounded-full w-9 h-9 b-border-2"
                                                    style={{ background: bg, boxShadow: '2px 2px 0 rgba(0,0,0,0.2)' }} />
                                            ))}
                                        </div>
                                        <span className="text-sm font-black text-white">+2k teman bergabung!</span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 pt-1">
                                        <div className="bg-white/20 backdrop-blur-sm b-border-2 px-4 py-2.5 rounded-2xl text-center">
                                            <p className="font-bold text-white font-fredoka tabular-nums"
                                                style={{ fontSize: '1.8rem', lineHeight: 1 }}>
                                                {String((events||[]).length).padStart(2,'0')}
                                            </p>
                                            <p className="text-[9px] font-black uppercase tracking-tight text-white/70 mt-0.5">Total Events</p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm b-border-2 px-4 py-2.5 rounded-2xl text-center">
                                            <p className="font-bold text-white font-fredoka tabular-nums"
                                                style={{ fontSize: '1.8rem', lineHeight: 1 }}>
                                                {String(publishedCount).padStart(2,'0')}
                                            </p>
                                            <p className="text-[9px] font-black uppercase tracking-tight text-white/70 mt-0.5">Open Now</p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm b-border-2 px-4 py-2.5 rounded-2xl text-center">
                                            <p className="font-bold text-white font-fredoka"
                                                style={{ fontSize: '1.8rem', lineHeight: 1 }}>
                                                100%
                                            </p>
                                            <p className="text-[9px] font-black uppercase tracking-tight text-white/70 mt-0.5">Gratis</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center p-8 lg:col-span-5 bg-slate-50 md:p-12">
                                <HeroCarousel events={events || []} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 mb-16">
                        <Ticker events={(events||[]).filter(e => e.status === 'PUBLISHED')} />
                    </div>

                    <div id="events" className="flex flex-col justify-between gap-5 mb-10 md:flex-row md:items-end">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl font-bold font-fredoka text-slate-900">All Events</span>
                                <span className="px-3 py-1 text-sm font-black text-white b-border-2 rounded-xl"
                                    style={{ background: '#5865F2', boxShadow: '3px 3px 0 #000' }}>
                                    {filteredEvents.length}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-slate-400">
                                {publishedCount} event sedang open  semua gratis!
                            </p>
                        </div>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-slate-400" strokeWidth={2.5} />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Cari event atau lokasi..."
                                className="w-full md:w-72 pl-11 pr-5 py-3.5 bg-white b-border rounded-2xl text-sm font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                style={{ boxShadow: '4px 4px 0 #000' }} />
                        </div>
                    </div>

                    {filteredEvents.length > 0
                        ? <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-10">
                              {filteredEvents.map((event, idx) => (
                                  <EventCard key={event.id} event={event} idx={idx} />
                              ))}
                          </div>
                        : <div className="flex flex-col items-center justify-center text-center py-28">
                              <div className="flex items-center justify-center w-20 h-20 mb-5 text-4xl bg-white rounded-3xl b-border"
                                  style={{ boxShadow: '6px 6px 0 #000' }}></div>
                              <h3 className="mb-1 text-2xl font-bold font-fredoka text-slate-800">
                                  {search ? 'Nggak Ketemu...' : 'Belum Ada Event'}
                              </h3>
                              <p className="text-sm font-bold text-slate-400">
                                  {search ? 'Coba kata kunci lain ya!' : 'Event baru segera hadir, tunggu aja!'}
                              </p>
                          </div>}
                </main>

                <footer className="mt-16 bg-white py-14" style={{ borderTop: '4px solid #000' }}>
                    <div className="flex flex-col items-center gap-5 px-6 mx-auto text-center max-w-7xl">
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 b-border rounded-xl"
                                style={{ boxShadow: '3px 3px 0 #000' }}>
                                <BoltIcon className="w-5 h-5 text-black" strokeWidth={3} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight font-fredoka">EventHub.</span>
                        </div>
                        <p className="max-w-xs text-sm font-bold text-slate-400">
                            Platform event kampus terbaik  gratis, fun, dan accessible!
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['Workshop', 'Seminar', 'Hackathon', 'Kompetisi'].map(tag => (
                                <span key={tag}
                                    className="b-border-2 px-3 py-1.5 rounded-xl text-xs font-black text-slate-600 bg-slate-50"
                                    style={{ boxShadow: '2px 2px 0 #000' }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            {['IG', 'TW'].map((s) => (
                                <div key={s}
                                    className="flex items-center justify-center text-xs font-black transition-colors bg-white rounded-full cursor-pointer w-9 h-9 b-border-2 hover:bg-yellow-400"
                                    style={{ boxShadow: '2px 2px 0 #000' }}>
                                    {s}
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-300 border-t-2 border-slate-100 pt-5 w-full">
                             2026 EventHub Creative Labs  Made with  for students
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-3xl font-bold font-fredoka text-slate-900">Kelola Event</h2>
                        <p className="text-sm font-bold text-slate-400 mt-0.5">{(events||[]).length} event terdaftar</p>
                    </div>
                    {isAdmin && (
                        <Link href="/events/create"
                            className="b-btn b-border inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-2xl font-black text-sm uppercase tracking-widest"
                            style={{ background: '#5865F2', boxShadow: '4px 4px 0 #000' }}>
                            <PlusIcon className="w-4 h-4" strokeWidth={3} /> Buat Event
                        </Link>
                    )}
                </div>
            }>
            <Head title="Events" />
            <style>{CSS}</style>
            <div className="py-6 sm:py-8" style={{ background: '#FFFDF0' }}>
                <div className="px-4 mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-3 p-4 bg-white b-border rounded-2xl sm:flex-row"
                        style={{ boxShadow: '5px 5px 0 #000' }}>
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2.5} />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Cari event..."
                                className="w-full pl-10 pr-4 py-2.5 b-border rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
                        </div>
                        {isAdmin && (
                            <div className="flex flex-wrap items-center gap-2">
                                <FunnelIcon className="flex-shrink-0 w-4 h-4 text-slate-400" strokeWidth={2.5} />
                                {filterButtons.map(({ key, label }) => (
                                    <button key={key} onClick={() => handleFilterChange(key)}
                                        className={`b-btn b-border-2 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider ${statusFilter === key ? 'text-white' : 'bg-white text-slate-600'}`}
                                        style={{
                                            background: statusFilter === key ? '#5865F2' : '',
                                            boxShadow: '3px 3px 0 #000',
                                        }}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <p className="text-[11px] font-black tracking-widest uppercase text-slate-400">
                        Menampilkan <span className="text-slate-900">{filteredEvents.length}</span> event
                    </p>

                    {filteredEvents.length > 0
                        ? <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-10">
                              {filteredEvents.map((event, idx) => (
                                  <EventCard key={event.id} event={event} idx={idx} showAdminActions={isAdmin} />
                              ))}
                          </div>
                        : <div className="bg-white b-border rounded-[2rem] py-24 text-center"
                                style={{ boxShadow: '5px 5px 0 #000' }}>
                              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-3xl rounded-2xl bg-slate-100 b-border"
                                  style={{ boxShadow: '4px 4px 0 #000' }}></div>
                              <h3 className="mb-2 text-2xl font-bold font-fredoka text-slate-800">
                                  {search ? 'Nggak Ketemu...' : 'Belum Ada Event'}
                              </h3>
                              <p className="mb-6 text-sm font-bold text-slate-400">
                                  {search ? 'Coba kata kunci lain' : 'Mulai buat event pertama!'}
                              </p>
                              {isAdmin && !search && (
                                  <Link href="/events/create"
                                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black tracking-widest text-white uppercase b-btn b-border rounded-2xl"
                                      style={{ background: '#5865F2', boxShadow: '4px 4px 0 #000' }}>
                                      <PlusIcon className="w-4 h-4" strokeWidth={3} /> Buat Event Pertama
                                  </Link>
                              )}
                          </div>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}