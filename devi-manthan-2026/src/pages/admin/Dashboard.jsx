import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, CheckCircle, XCircle, LogOut, ChevronDown, ChevronRight, User, LayoutGrid, RefreshCw, Download, Trash2, Filter, SortAsc, SortDesc, X, ToggleLeft, ToggleRight, Lock, Unlock, CalendarOff } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const EVENT_NAMES = [
  'All Events',
  'CHAKRAVYUHA',
  'VYUHANTARA',
  'ROOPAYANTRA',
  'UDBHAVA',
  'SUTRADHARA',
  'ASTRACODERS',
  'BRAHMASTRA',
  'DRISHTICHAKRA',
];

const ALL_EVENTS = [
  { key: 'CHAKRAVYUHA', label: 'CHAKRAVYUHA', subtitle: 'Escape Room', category: 'Technical' },
  { key: 'VYUHANTARA', label: 'VYUHANTARA', subtitle: 'Surprise Event', category: 'Technical' },
  { key: 'ROOPAYANTRA', label: 'ROOPAYANTRA', subtitle: 'Tech Walk', category: 'Cultural' },
  { key: 'UDBHAVA', label: 'UDBHAVA', subtitle: 'Product Launch', category: 'Technical' },
  { key: 'SUTRADHARA', label: 'SUTRADHARA', subtitle: 'IT Manager', category: 'Technical' },
  { key: 'ASTRACODERS', label: 'ASTRACODERS', subtitle: 'Web Designing', category: 'Technical' },
  { key: 'BRAHMASTRA', label: 'BRAHMASTRA', subtitle: 'Gaming (BGMI)', category: 'Technical' },
  { key: 'DRISHTICHAKRA', label: 'DRISHTICHAKRA', subtitle: 'Photography & Videography', category: 'Cultural' },
];

// Maps OLD event names (from early Supabase records) to their correct current names
const LEGACY_EVENT_NAME_MAP = {
  'SPARDHA (Gaming)':                         'BRAHMASTRA (Gaming)',
  'SPARDHA':                                  'BRAHMASTRA',
  'VISHWAKARMA (Product Launch)':             'UDBHAVA (Product Launch)',
  'VISHWAKARMA':                              'UDBHAVA',
  'CHITRAKATHA (Photography) and Videography':'DRISHTICHAKRA (Photography & Videography)',
  'CHITRAKATHA':                              'DRISHTICHAKRA',
  'CHAKRAVYUHA (Quiz)':                       'CHAKRAVYUHA (Escape Room)',
};

function resolveEventName(name) {
  if (!name) return name;
  return LEGACY_EVENT_NAME_MAP[name] || name;
}

const mockRegistrations = [
  {
    id: '101',
    leaderName: 'Rahul Sharma',
    college: 'Christ University',
    paymentStatus: 'Verified',
    participants: [
      { id: 'p1', name: 'Rahul Sharma', event: 'CHAKRAVYUHA', phone: '+91 9876543210' },
      { id: 'p2', name: 'Aman Verma', event: 'BRAHMASTRA', phone: '+91 8765432109' },
      { id: 'p3', name: 'Priya Das', event: 'SUTRADHARA', phone: '+91 7654321098' },
    ],
    createdAt: '21/04/2026',
  },
  {
    id: '102',
    leaderName: 'Ananya Patel',
    college: 'Jain University',
    paymentStatus: 'Pending',
    participants: [
      { id: 'p4', name: 'Ananya Patel', event: 'BRAHMASTRA', phone: '+91 6543210987' },
      { id: 'p5', name: 'Karan Singh', event: 'CHAKRAVYUHA', phone: '+91 5432109876' },
    ],
    createdAt: '20/04/2026',
  },
];

export default function Dashboard({ onLogout }) {
  const [registrations, setRegistrations] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Filters
  const [eventFilter, setEventFilter] = useState('All Events');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  // Tabs
  const [activeTab, setActiveTab] = useState('registrations'); // 'registrations' | 'slots'

  // Event slot management
  const [eventSlots, setEventSlots] = useState(
    Object.fromEntries(ALL_EVENTS.map(e => [e.key, true]))
  );
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [togglingSlot, setTogglingSlot] = useState(null);

  // Fetch event slots from Supabase
  const fetchEventSlots = useCallback(async () => {
    setSlotsLoading(true);
    try {
      const { data, error } = await supabase.from('event_slots').select('*');
      if (!error && data && data.length > 0) {
        const slotMap = {};
        data.forEach(row => { slotMap[row.event_key] = row.is_open; });
        setEventSlots(prev => ({ ...prev, ...slotMap }));
      }
    } catch (err) {
      console.warn('Could not load event slots:', err.message);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  // Toggle a single event slot
  const toggleEventSlot = async (eventKey) => {
    const newVal = !eventSlots[eventKey];
    setTogglingSlot(eventKey);
    // Optimistic update
    setEventSlots(prev => ({ ...prev, [eventKey]: newVal }));
    try {
      const { error } = await supabase
        .from('event_slots')
        .upsert({ event_key: eventKey, is_open: newVal }, { onConflict: 'event_key' });
      if (error) throw error;
    } catch (err) {
      // Revert on failure
      setEventSlots(prev => ({ ...prev, [eventKey]: !newVal }));
      alert('Failed to update slot: ' + err.message);
    } finally {
      setTogglingSlot(null);
    }
  };

  const fetchRealData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase error:', error.message, '— using mock data.');
        setRegistrations(mockRegistrations);
        setUsingMock(true);
      } else if (data && data.length > 0) {
        const mapped = data.map((reg) => ({
          id: reg.id,
          leaderName: reg.leader_name,
          leaderPhone: reg.leader_phone,
          leaderEmail: reg.leader_email,
          college: reg.college,
          paymentStatus: reg.payment_status,
          createdAt: new Date(reg.created_at).toLocaleDateString('en-IN'),
          createdAtRaw: new Date(reg.created_at),
          participants: Array.isArray(reg.participants) ? reg.participants : [],
        }));
        setRegistrations(mapped);
        setUsingMock(false);
      } else {
        setRegistrations(mockRegistrations);
        setUsingMock(true);
      }
    } catch (err) {
      console.error('Supabase connection error:', err);
      setRegistrations(mockRegistrations);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRealData(); fetchEventSlots(); }, [fetchRealData, fetchEventSlots]);

  const updatePaymentStatus = async (team) => {
    if (usingMock) return;
    // Treat 'Free' (legacy) same as 'Pending' — any non-Verified toggles to Verified
    const newStatus = team.paymentStatus === 'Verified' ? 'Pending' : 'Verified';
    setUpdatingId(team.id);
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ payment_status: newStatus })
        .eq('id', team.id);
      if (error) throw error;
      setRegistrations(prev => prev.map(r =>
        r.id === team.id ? { ...r, paymentStatus: newStatus } : r
      ));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteRegistration = async (id, e) => {
    e.stopPropagation();
    if (usingMock) { alert('Cannot delete mock data.'); return; }
    if (!window.confirm('Are you sure you want to delete this registration? This cannot be undone.')) return;
    setUpdatingId(id);
    try {
      const { error } = await supabase.from('registrations').delete().eq('id', id);
      if (error) throw error;
      setRegistrations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCSV = () => {
    const rows = [['Reg ID', 'College', 'Leader Name', 'Leader Phone', 'Leader Email', 'Participants', 'Payment Status', 'Date']];
    filteredData.forEach(r => {
      const partNames = r.participants.map(p => `${p.name} (${p.event})`).join(' | ');
      rows.push([r.id, r.college, r.leaderName, r.leaderPhone || '', r.leaderEmail || '', partNames, r.paymentStatus, r.createdAt || '']);
    });
    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devi-manthan-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleRow = (id) => setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));

  const clearFilters = () => {
    setSearchTerm('');
    setEventFilter('All Events');
    setStatusFilter('All');
    setSortOrder('newest');
  };

  const hasActiveFilters = searchTerm || eventFilter !== 'All Events' || statusFilter !== 'All' || sortOrder !== 'newest';

  // Apply all filters + sort
  const filteredData = registrations
    .filter(reg => {
      const matchSearch =
        reg.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.leaderName.toLowerCase().includes(searchTerm.toLowerCase());

      // Treat 'Free' (old default) as 'Pending' for status filter
      const effectiveStatus = reg.paymentStatus === 'Free' ? 'Pending' : reg.paymentStatus;
      const matchStatus = statusFilter === 'All' || effectiveStatus === statusFilter;

      // Match event: resolve legacy names first, then compare prefix
      const matchEvent =
        eventFilter === 'All Events' ||
        reg.participants.some(p => {
          if (!p.event) return false;
          const resolved = resolveEventName(p.event);
          const storedKey = resolved.split(' (')[0].trim().toUpperCase();
          return storedKey === eventFilter.toUpperCase();
        });

      return matchSearch && matchStatus && matchEvent;
    })
    .sort((a, b) => {
      const dateA = a.createdAtRaw ? a.createdAtRaw : new Date(0);
      const dateB = b.createdAtRaw ? b.createdAtRaw : new Date(0);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Count using effective status
  const verifiedCount = filteredData.filter(r => r.paymentStatus === 'Verified').length;
  const pendingCount = filteredData.filter(r => r.paymentStatus === 'Pending' || r.paymentStatus === 'Free').length;

  const selectClass = "bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all appearance-none cursor-pointer";

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white p-4 md:p-6 relative overflow-hidden font-sans">

      {/* Ambient blurs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-amber-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden min-h-[85vh] flex flex-col">

        {/* Header */}
        <header className="flex justify-between items-center p-6 md:p-8 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Users className="text-amber-500 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">ADMIN PORTAL</h1>
              <p className="text-zinc-400 text-sm font-medium tracking-wide">Registration Overview</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button id="refresh-btn" onClick={fetchRealData}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 hover:text-emerald-400 transition-all duration-300"
              title="Refresh data">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="text-sm font-bold tracking-wide hidden sm:inline">REFRESH</span>
            </button>
            {!usingMock && (
              <button id="export-btn" onClick={exportCSV}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all duration-300">
                <Download size={16} />
                <span className="text-sm font-bold tracking-wide hidden sm:inline">EXPORT</span>
              </button>
            )}
            <button id="logout-btn" onClick={onLogout}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 hover:text-red-400 transition-all duration-300">
              <LogOut size={18} />
              <span className="text-sm font-bold tracking-wide hidden sm:inline">LOGOUT</span>
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/20">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200 border-b-2 ${
              activeTab === 'registrations'
                ? 'text-amber-400 border-amber-400'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            <Users size={16} /> Registrations
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200 border-b-2 ${
              activeTab === 'slots'
                ? 'text-amber-400 border-amber-400'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            <CalendarOff size={16} /> Event Slots
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              Object.values(eventSlots).some(v => !v)
                ? 'bg-red-500/20 text-red-400'
                : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {Object.values(eventSlots).filter(v => !v).length > 0
                ? `${Object.values(eventSlots).filter(v => !v).length} CLOSED`
                : 'ALL OPEN'
              }
            </span>
          </button>
        </div>

        {/* ── EVENT SLOTS PANEL ── */}
        {activeTab === 'slots' && (
          <div className="flex-1 p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white tracking-widest uppercase">Event Registration Slots</h2>
              <p className="text-zinc-400 text-sm mt-1">Toggle to open or close registrations for a specific event. Closed events won't accept new registrations.</p>
            </div>

            {slotsLoading ? (
              <div className="flex items-center justify-center py-16 gap-3">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                <span className="text-zinc-400 text-sm tracking-widest uppercase">Loading slots...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {ALL_EVENTS.map(ev => {
                  const isOpen = eventSlots[ev.key];
                  const isToggling = togglingSlot === ev.key;
                  return (
                    <div
                      key={ev.key}
                      className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                        isOpen
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : 'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      {/* Category badge */}
                      <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full mb-3 inline-block ${
                        ev.category === 'Technical'
                          ? 'bg-sky-500/10 text-sky-400'
                          : 'bg-purple-500/10 text-purple-400'
                      }`}>
                        {ev.category}
                      </span>

                      <div className="mb-1">
                        <h3 className="text-sm font-bold text-white tracking-wide">{ev.label}</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">{ev.subtitle}</p>
                      </div>

                      {/* Status */}
                      <div className={`flex items-center gap-1.5 text-xs font-bold mt-3 mb-4 ${
                        isOpen ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {isOpen
                          ? <><Unlock size={12} /> Registration Open</>
                          : <><Lock size={12} /> Registration Closed</>
                        }
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={() => toggleEventSlot(ev.key)}
                        disabled={isToggling}
                        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-200 border ${
                          isOpen
                            ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {isToggling ? (
                          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        ) : isOpen ? (
                          <><ToggleRight size={16} /> Close Slot</>
                        ) : (
                          <><ToggleLeft size={16} /> Open Slot</>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => ALL_EVENTS.forEach(ev => { if (!eventSlots[ev.key]) toggleEventSlot(ev.key); })}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold tracking-widest uppercase hover:bg-emerald-500/20 transition-all"
              >
                <Unlock size={14} /> Open All Events
              </button>
              <button
                onClick={() => ALL_EVENTS.forEach(ev => { if (eventSlots[ev.key]) toggleEventSlot(ev.key); })}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold tracking-widest uppercase hover:bg-red-500/20 transition-all"
              >
                <Lock size={14} /> Close All Events
              </button>
            </div>
          </div>
        )}

        {/* ── REGISTRATIONS PANEL ── */}
        {activeTab === 'registrations' && (
          <>
        {/* Stats Bar */}
        <div className="px-6 md:px-8 pt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Registrations', value: filteredData.length, color: 'amber' },
            { label: 'Verified', value: verifiedCount, color: 'emerald' },
            { label: 'Pending', value: pendingCount, color: 'yellow' },
            { label: 'Total Participants', value: filteredData.reduce((acc, r) => acc + r.participants.length, 0), color: 'sky' },
          ].map(stat => (
            <div key={stat.label} className={`px-4 py-3 bg-${stat.color}-500/10 border border-${stat.color}-500/20 rounded-xl`}>
              <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
              <div className="text-xs text-zinc-400 tracking-wide mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="px-6 md:px-8 pt-5 pb-2">
          <div className="flex flex-wrap gap-3 items-end">

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-3 text-zinc-400" size={16} />
              <input
                id="search-input"
                type="text"
                placeholder="Search college or leader..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
              />
            </div>

            {/* Event Filter */}
            <div className="relative min-w-[180px]">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block ml-1">Event</label>
              <div className="relative">
                <Filter size={14} className="absolute left-3 top-3 text-zinc-400 pointer-events-none" />
                <select id="event-filter" value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}
                  className={`${selectClass} pl-8 pr-6 w-full`}>
                  {EVENT_NAMES.map(ev => <option key={ev} value={ev} className="bg-zinc-900">{ev}</option>)}
                </select>
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[150px]">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block ml-1">Status</label>
              <select id="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className={`${selectClass} w-full pr-6`}>
                <option value="All" className="bg-zinc-900">All Status</option>
                <option value="Verified" className="bg-zinc-900">✓ Verified</option>
                <option value="Pending" className="bg-zinc-900">⏳ Pending</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative min-w-[150px]">
              <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 block ml-1">Sort By</label>
              <div className="relative">
                {sortOrder === 'newest'
                  ? <SortDesc size={14} className="absolute left-3 top-3 text-zinc-400 pointer-events-none" />
                  : <SortAsc size={14} className="absolute left-3 top-3 text-zinc-400 pointer-events-none" />
                }
                <select id="sort-filter" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                  className={`${selectClass} pl-8 pr-6 w-full`}>
                  <option value="newest" className="bg-zinc-900">Newest First</option>
                  <option value="oldest" className="bg-zinc-900">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button id="clear-filters-btn" onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 text-sm transition-all duration-200 self-end">
                <X size={14} /> Clear
              </button>
            )}

            {/* Live/Mock badge */}
            <div className="self-end pb-0.5">
              {usingMock ? (
                <div className="px-3 py-1.5 bg-zinc-700/40 border border-zinc-600/40 rounded-lg text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Preview Data</div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live Data
                </div>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchTerm && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400">
                  Search: "{searchTerm}" <button onClick={() => setSearchTerm('')}><X size={10} /></button>
                </span>
              )}
              {eventFilter !== 'All Events' && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-xs text-sky-400">
                  Event: {eventFilter} <button onClick={() => setEventFilter('All Events')}><X size={10} /></button>
                </span>
              )}
              {statusFilter !== 'All' && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400">
                  Status: {statusFilter} <button onClick={() => setStatusFilter('All')}><X size={10} /></button>
                </span>
              )}
              {sortOrder !== 'newest' && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-400">
                  Sort: Oldest First <button onClick={() => setSortOrder('newest')}><X size={10} /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="px-6 md:px-8 pt-3 pb-2">
          <p className="text-xs text-zinc-500 tracking-wide">
            Showing <span className="text-amber-400 font-bold">{filteredData.length}</span> of <span className="text-zinc-300 font-bold">{registrations.length}</span> registrations
          </p>
        </div>

        {/* Data Table */}
        <div className="flex-1 px-4 md:px-8 pb-8 overflow-auto mt-2">
          <div className="w-full min-w-[700px] bg-black/40 rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm">

            {/* Table Header — no Amount col */}
            <div className="grid grid-cols-11 gap-3 p-5 bg-white/[0.02] border-b border-white/10 text-xs font-bold text-zinc-400 uppercase tracking-widest">
              <div className="col-span-1 flex justify-center">Exp</div>
              <div className="col-span-2">Reg ID</div>
              <div className="col-span-3">College</div>
              <div className="col-span-2">Team Leader</div>
              <div className="col-span-3">Status / Action</div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="p-10 text-center text-zinc-400 text-sm flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                <span className="tracking-widest uppercase text-xs">Connecting to database...</span>
              </div>
            )}

            {/* Rows */}
            {!loading && (
              <div className="divide-y divide-white/5">
                {filteredData.map((team) => {
                  const isExpanded = expandedRows[team.id];
                  return (
                    <React.Fragment key={team.id}>
                      <div
                        onClick={() => toggleRow(team.id)}
                        className={`grid grid-cols-11 gap-3 p-5 items-center cursor-pointer transition-all duration-300 ${isExpanded ? 'bg-amber-500/5' : 'hover:bg-white/[0.04]'}`}
                      >
                        <div className="col-span-1 flex justify-center text-amber-500">
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </div>
                        <div className="col-span-2 font-mono text-zinc-300 font-medium text-xs">
                          #{typeof team.id === 'string' ? team.id.slice(0, 8).toUpperCase() : team.id}
                          {team.createdAt && <div className="text-zinc-600 text-[10px] mt-0.5">{team.createdAt}</div>}
                        </div>
                        <div className="col-span-3 font-semibold text-white tracking-wide text-sm">{team.college}</div>
                        <div className="col-span-2 text-zinc-300 flex items-center gap-2 text-sm">
                          <User size={13} className="text-emerald-400 shrink-0" />
                          <span className="truncate">{team.leaderName}</span>
                        </div>
                        <div className="col-span-3 flex items-center gap-2 flex-wrap">
                          {team.paymentStatus === 'Verified' ? (
                            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold tracking-wide bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1.5 rounded-lg w-fit">
                              <CheckCircle size={13} /> VERIFIED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-amber-400 text-xs font-bold tracking-wide bg-amber-400/10 border border-amber-400/20 px-2.5 py-1.5 rounded-lg w-fit">
                              <XCircle size={13} /> PENDING
                            </span>
                          )}
                          {!usingMock && (
                            <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={(e) => { e.stopPropagation(); updatePaymentStatus(team); }}
                                disabled={updatingId === team.id}
                                className={`text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded border transition-all duration-200 ${
                                  team.paymentStatus === 'Verified'
                                    ? 'border-zinc-500/30 text-zinc-400 bg-zinc-500/10 hover:bg-zinc-500/20'
                                    : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                              >
                                {updatingId === team.id ? '...' : team.paymentStatus === 'Verified' ? 'Mark Pending' : 'Mark Verified'}
                              </button>
                              <button
                                onClick={(e) => deleteRegistration(team.id, e)}
                                disabled={updatingId === team.id}
                                className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Delete Registration"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expanded participants */}
                      {isExpanded && (
                        <div className="bg-black/60 border-y border-white/5 p-5 shadow-inner">
                          <div className="max-w-4xl ml-8 md:ml-12 bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
                            {(team.leaderPhone || team.leaderEmail) && (
                              <div className="p-3 bg-white/[0.02] border-b border-white/5 text-xs text-zinc-400 flex gap-6 flex-wrap">
                                {team.leaderPhone && <span>📞 {team.leaderPhone}</span>}
                                {team.leaderEmail && <span>✉ {team.leaderEmail}</span>}
                                {team.createdAt && <span>📅 Registered: {team.createdAt}</span>}
                              </div>
                            )}
                            <div className="grid grid-cols-3 bg-white/[0.02] p-3 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">
                              <div>Participant Name</div>
                              <div>Contact Number</div>
                              <div>Event</div>
                            </div>
                            <div className="divide-y divide-white/5">
                              {team.participants.map((p, idx) => (
                                <div key={idx} className="grid grid-cols-3 p-3 text-sm hover:bg-white/[0.02] transition-colors">
                                  <div className="flex items-center gap-2 text-zinc-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50 shrink-0" />
                                    {p.name} {p.name === team.leaderName && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded ml-1">LEADER</span>}
                                  </div>
                                  <div className="text-zinc-400 font-mono text-xs flex items-center">{p.phone || '—'}</div>
                                  <div className="text-amber-400/80 font-medium text-xs">{resolveEventName(p.event)}</div>
                                </div>
                              ))}
                            </div>
                            <div className="p-3 bg-white/[0.02] border-t border-white/5 text-xs text-zinc-400 font-medium tracking-wide">
                              Total Participants: {team.participants.length}
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {filteredData.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="text-zinc-600 text-4xl mb-3">🔍</div>
                    <p className="text-zinc-500 text-sm">No registrations match your filters.</p>
                    <button onClick={clearFilters} className="mt-3 text-xs text-amber-400 hover:underline">Clear all filters</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

          </>
        )}

      </div>
    </div>
  );
}
