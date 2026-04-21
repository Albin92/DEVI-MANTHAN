import React, { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY = 'admin_login_lockout';

function getLockoutState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { attempts: 0, lockedUntil: null };
    return JSON.parse(raw);
  } catch { return { attempts: 0, lockedUntil: null }; }
}

function saveLockoutState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function Login({ onLogin }) {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd]   = useState(false);
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const [attempts, setAttempts] = useState(() => getLockoutState().attempts);
    const [lockedUntil, setLockedUntil] = useState(() => getLockoutState().lockedUntil);
    const [countdown, setCountdown] = useState(0);
    const timerRef = useRef(null);

    // Countdown timer
    useEffect(() => {
        const tick = () => {
            if (!lockedUntil) { setCountdown(0); return; }
            const remaining = lockedUntil - Date.now();
            if (remaining <= 0) {
                // Lockout expired — reset
                const reset = { attempts: 0, lockedUntil: null };
                saveLockoutState(reset);
                setAttempts(0);
                setLockedUntil(null);
                setCountdown(0);
                setError('');
            } else {
                setCountdown(Math.ceil(remaining / 1000));
            }
        };
        tick();
        timerRef.current = setInterval(tick, 1000);
        return () => clearInterval(timerRef.current);
    }, [lockedUntil]);

    const isLocked = lockedUntil && Date.now() < lockedUntil;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Check lockout first
        if (isLocked) {
            setError(`🔒 Too many failed attempts. Try again in ${Math.ceil(countdown / 60)}m ${countdown % 60}s.`);
            return;
        }

        setLoading(true);

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        if (authError || !data.session) {
            const newAttempts = attempts + 1;
            const willLock = newAttempts >= MAX_ATTEMPTS;
            const newLockedUntil = willLock ? Date.now() + LOCKOUT_DURATION_MS : null;

            saveLockoutState({ attempts: newAttempts, lockedUntil: newLockedUntil });
            setAttempts(newAttempts);

            if (willLock) {
                setLockedUntil(newLockedUntil);
                setError(`🔒 Account locked for 15 minutes after ${MAX_ATTEMPTS} failed attempts.`);
            } else {
                const remaining = MAX_ATTEMPTS - newAttempts;
                setError(`❌ Login failed: ${authError?.message || 'Invalid credentials'} · ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
            }
            setLoading(false);
            return;
        }

        // Success — reset lockout
        saveLockoutState({ attempts: 0, lockedUntil: null });
        setAttempts(0);
        setLockedUntil(null);
        onLogin(data.session);
        setLoading(false);
    };

    const formatCountdown = () => {
        const m = Math.floor(countdown / 60);
        const s = countdown % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-4 relative overflow-hidden">

            {/* Ambient blurs */}
            <div className="absolute w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[130px] top-[-10%] right-[-10%] pointer-events-none" />
            <div className="absolute w-[400px] h-[400px] bg-red-900/15 rounded-full blur-[100px] bottom-[-5%] left-[-5%] pointer-events-none" />

            {/* Glass card */}
            <div className="relative z-10 w-full max-w-md bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-8 rounded-2xl shadow-2xl">

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-amber-500/20 rounded-full border border-amber-500/30 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                        <ShieldCheck className="text-amber-400 w-9 h-9" />
                    </div>
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 tracking-widest">
                        ADMIN PORTAL
                    </h1>
                    <p className="text-zinc-400 text-sm mt-2 tracking-wide text-center">
                        Devi-Manthan 2026 · Registration Desk
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-zinc-300 text-xs font-bold tracking-widest uppercase mb-2">
                            Admin Email
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                            placeholder="your@email.com"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <label className="block text-zinc-300 text-xs font-bold tracking-widest uppercase mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="admin-password"
                                type={showPwd ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition-colors"
                                tabIndex={-1}
                            >
                                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium px-4 py-2.5 rounded-xl flex items-start gap-2">
                            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Attempt indicator dots */}
                    {attempts > 0 && !isLocked && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500 tracking-wide">Attempts:</span>
                            <div className="flex gap-1">
                                {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                                        i < attempts ? 'bg-red-500' : 'bg-zinc-700'
                                    }`} />
                                ))}
                            </div>
                            <span className="text-xs text-zinc-500">{MAX_ATTEMPTS - attempts} left</span>
                        </div>
                    )}

                    {/* Lockout countdown */}
                    {isLocked && (
                        <div className="bg-red-900/20 border border-red-500/40 rounded-xl px-4 py-3 text-center">
                            <div className="text-red-400 text-xs font-bold tracking-widest uppercase mb-1">🔒 Access Locked</div>
                            <div className="text-red-300 text-2xl font-mono font-bold">{formatCountdown()}</div>
                            <div className="text-zinc-500 text-xs mt-1">Try again after cooldown</div>
                        </div>
                    )}

                    <button
                        id="login-btn"
                        type="submit"
                        disabled={loading || !!isLocked}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] tracking-widest text-sm uppercase"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Authenticating...
                            </span>
                        ) : isLocked ? (
                            <span className="flex items-center justify-center gap-2">
                                <Lock size={16} /> Locked · {formatCountdown()}
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <Lock size={16} /> Authenticate
                            </span>
                        )}
                    </button>
                </form>

                <p className="text-center text-zinc-600 text-xs mt-6 tracking-wide">
                    Restricted access · Devi-Manthan Admin Only
                </p>
            </div>
        </div>
    );
}
