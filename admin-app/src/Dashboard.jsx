import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, CheckCircle, XCircle, LogOut, ChevronDown, ChevronRight, User, LayoutGrid, RefreshCw, Download } from 'lucide-react';
import { supabase } from '../supabaseClient'; 

// Structured mock data
const mockRegistrations = [
    {
        id: '101',
        leaderName: 'Rahul Sharma',
        college: 'Christ University',
        paymentStatus: 'Verified',
        totalAmount: '₹1500',
        participants: [
            { id: 'p1', name: 'Rahul Sharma', event: 'Srijan (Coding)' },
            { id: 'p2', name: 'Aman Verma', event: 'Spardha (Gaming)' },
            { id: 'p3', name: 'Priya Das', event: 'Netrutva (IT Manager)' }
        ]
    },
    {
        id: '102',
        leaderName: 'Ananya Patel',
        college: 'Jain University',
        paymentStatus: 'Pending',
        totalAmount: '₹800',
        participants: [
            { id: 'p4', name: 'Ananya Patel', event: 'Spardha (Gaming)' },
            { id: 'p5', name: 'Karan Singh', event: 'Srijan (Coding)' }
        ]
    }
];

export default function Dashboard({ onLogout }) {
    const [registrations, setRegistrations] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [usingMock, setUsingMock] = useState(false);
    const [updatingId, setUpdatingId] = useState(null); // tracks which row is being updated

    // Fetch real data from Supabase
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
                // Map Supabase rows → component format
                const mapped = data.map((reg) => ({
                    id: reg.id,
                    leaderName:    reg.leader_name,
                    leaderPhone:   reg.leader_phone,
                    leaderEmail:   reg.leader_email,
                    college:       reg.college,
                    paymentStatus: reg.payment_status,
                    totalAmount:   reg.total_amount != null
                            ? `₹${reg.total_amount}`
                            : `₹${(Array.isArray(reg.participants) ? reg.participants.length : 0) * 200}`,
                    createdAt:     new Date(reg.created_at).toLocaleDateString('en-IN'),
                    participants:  Array.isArray(reg.participants) ? reg.participants : [],
                }));
                setRegistrations(mapped);
                setUsingMock(false);
            } else {
                // Table exists but has no rows yet — still show mock for UI preview
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

    useEffect(() => { fetchRealData(); }, [fetchRealData]);

    // Toggle payment status in Supabase
    const updatePaymentStatus = async (team) => {
        if (usingMock) return; // can't update mock data
        const newStatus = team.paymentStatus === 'Verified' ? 'Pending' : 'Verified';
        setUpdatingId(team.id);
        try {
            const { error } = await supabase
                .from('registrations')
                .update({ payment_status: newStatus })
                .eq('id', team.id);
            if (error) throw error;
            // Optimistically update local state
            setRegistrations(prev => prev.map(r =>
                r.id === team.id ? { ...r, paymentStatus: newStatus } : r
            ));
        } catch (err) {
            console.error('Update error:', err);
            alert('Failed to update status: ' + err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    // Export CSV
    const exportCSV = () => {
        const rows = [['Reg ID', 'College', 'Leader Name', 'Leader Phone', 'Leader Email', 'Participants', 'Total Amount', 'Payment Status', 'Date']];
        registrations.forEach(r => {
            const partNames = r.participants.map(p => `${p.name} (${p.event})`).join(' | ');
            rows.push([
                r.id, r.college, r.leaderName, r.leaderPhone || '', r.leaderEmail || '',
                partNames, r.totalAmount, r.paymentStatus, r.createdAt || ''
            ]);
        });
        const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `devi-manthan-registrations-${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const toggleRow = (id) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredData = registrations.filter(reg => 
        reg.college.toLowerCase().includes(searchTerm.toLowerCase()) || 
        reg.leaderName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white p-6 relative overflow-hidden font-sans">

            {/* Deep Glassmorphism Ambient Blurs */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-amber-600/20 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Main Premium Glass Container */}
            <div className="relative z-10 max-w-7xl mx-auto bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden min-h-[85vh] flex flex-col">

                {/* Top Header */}
                <header className="flex justify-between items-center p-8 border-b border-white/10 bg-black/40">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <Users className="text-amber-500 w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">ADMIN PORTAL</h1>
                            <p className="text-zinc-400 text-sm font-medium tracking-wide">Registration Overview</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            id="refresh-btn"
                            onClick={fetchRealData}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 hover:text-emerald-400 transition-all duration-300"
                            title="Refresh data"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            <span className="text-sm font-bold tracking-wide hidden sm:inline">REFRESH</span>
                        </button>
                        {!usingMock && (
                            <button
                                id="export-btn"
                                onClick={exportCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all duration-300"
                                title="Export CSV"
                            >
                                <Download size={16} />
                                <span className="text-sm font-bold tracking-wide hidden sm:inline">EXPORT</span>
                            </button>
                        )}
                        <button
                            id="logout-btn"
                            onClick={onLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 hover:text-red-400 transition-all duration-300"
                        >
                            <LogOut size={18} />
                            <span className="text-sm font-bold tracking-wide hidden sm:inline">LOGOUT</span>
                        </button>
                    </div>
                </header>

                {/* Tools and Search */}
                <div className="p-8 flex flex-col md:flex-row justify-between gap-6 items-center bg-white/[0.01]">
                    <div className="relative w-full md:w-[400px]">
                        <Search className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by college or leader..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-inner"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="px-6 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm font-bold tracking-wide shadow-[0_0_10px_rgba(245,158,11,0.1)] text-amber-400 flex items-center gap-2">
                            <LayoutGrid size={18} />
                            Colleges Registered: {filteredData.length}
                        </div>
                        {usingMock ? (
                            <div className="px-3 py-1.5 bg-zinc-700/40 border border-zinc-600/40 rounded-lg text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                                Preview Data
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Live Data
                            </div>
                        )}
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex-1 px-8 pb-8 overflow-auto">
                    <div className="w-full min-w-[900px] bg-black/40 rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm">
                        
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 p-5 bg-white/[0.02] border-b border-white/10 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            <div className="col-span-1 flex justify-center">Expand</div>
                            <div className="col-span-2">Reg ID</div>
                            <div className="col-span-3">College</div>
                            <div className="col-span-2">Team Leader</div>
                            <div className="col-span-2">Amount</div>
                            <div className="col-span-2">Status / Action</div>
                        </div>

                        {/* Loading state */}
                        {loading && (
                            <div className="p-10 text-center text-zinc-400 text-sm flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                                <span className="tracking-widest uppercase text-xs">Connecting to database...</span>
                            </div>
                        )}

                        {/* Hierarchical Rows */}
                        {!loading && <div className="divide-y divide-white/5">
                            {filteredData.map((team) => {
                                const isExpanded = expandedRows[team.id];
                                return (
                                    <React.Fragment key={team.id}>
                                        {/* Primary Leader Row */}
                                        <div 
                                            onClick={() => toggleRow(team.id)}
                                            className={`grid grid-cols-12 gap-4 p-5 items-center cursor-pointer transition-all duration-300 ${isExpanded ? 'bg-amber-500/5' : 'hover:bg-white/[0.04]'}`}
                                        >
                                            <div className="col-span-1 flex justify-center text-amber-500">
                                                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                            </div>
                                            <div className="col-span-2 font-mono text-zinc-300 font-medium text-xs">
                                                #{typeof team.id === 'string' ? team.id.slice(0, 8).toUpperCase() : team.id}
                                            </div>
                                            <div className="col-span-3 font-semibold text-white tracking-wide">{team.college}</div>
                                            <div className="col-span-2 text-zinc-300 flex items-center gap-2">
                                                <User size={14} className="text-emerald-400" />
                                                {team.leaderName}
                                            </div>
                                            <div className="col-span-2 text-zinc-300 font-mono bg-white/5 px-3 py-1 rounded w-fit">{team.totalAmount}</div>
                                            <div className="col-span-2 flex items-center gap-2 flex-wrap">
                                                {team.paymentStatus === 'Verified' ? (
                                                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold tracking-wide bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-lg w-fit shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                                                        <CheckCircle size={14} /> VERIFIED
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-amber-400 text-xs font-bold tracking-wide bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-lg w-fit shadow-[0_0_10px_rgba(251,191,36,0.1)]">
                                                        <XCircle size={14} /> PENDING
                                                    </span>
                                                )}
                                                {!usingMock && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updatePaymentStatus(team); }}
                                                        disabled={updatingId === team.id}
                                                        className={`text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded border transition-all duration-200 ${
                                                            team.paymentStatus === 'Verified'
                                                                ? 'border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20'
                                                                : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                                                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                                                    >
                                                        {updatingId === team.id ? '...' : team.paymentStatus === 'Verified' ? 'Mark Pending' : 'Mark Verified'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded Inner Table (Participants) */}
                                        {isExpanded && (
                                            <div className="col-span-12 bg-black/60 border-y border-white/5 p-6 shadow-inner">
                                                <div className="max-w-4xl ml-12 bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
                                                    {/* Contact row */}
                                                    {(team.leaderPhone || team.leaderEmail) && (
                                                        <div className="p-3 bg-white/[0.02] border-b border-white/5 text-xs text-zinc-400 flex gap-6 flex-wrap">
                                                            {team.leaderPhone && <span>📞 {team.leaderPhone}</span>}
                                                            {team.leaderEmail && <span>✉ {team.leaderEmail}</span>}
                                                            {team.createdAt  && <span>📅 Registered: {team.createdAt}</span>}
                                                        </div>
                                                    )}
                                                    <div className="grid grid-cols-2 bg-white/[0.02] p-3 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">
                                                        <div>Participant Name</div>
                                                        <div>Registered Event</div>
                                                    </div>
                                                    <div className="divide-y divide-white/5">
                                                        {team.participants.map((p, idx) => (
                                                            <div key={idx} className="grid grid-cols-2 p-3 text-sm hover:bg-white/[0.02] transition-colors">
                                                                <div className="flex items-center gap-2 text-zinc-300">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>
                                                                    {p.name} {p.name === team.leaderName && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded ml-2">LEADER</span>}
                                                                </div>
                                                                <div className="text-amber-400/80 font-medium">{p.event}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="p-3 bg-white/[0.02] border-t border-white/5 text-xs text-zinc-400 flex justify-between items-center font-medium tracking-wide">
                                                        <span>Total Participants: {team.participants.length}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            
                            {filteredData.length === 0 && (
                                <div className="p-8 text-center text-zinc-500 text-sm">
                                    No registrations found matching your search.
                                </div>
                            )}
                        </div>}
                    </div>
                </div>

            </div>
        </div>
    );
}