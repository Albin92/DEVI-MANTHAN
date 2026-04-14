import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

const EVENT_CONFIG = {
  "CHITRAKATHA (Photography)": { members: 1, type: "Solo", weapon: "Drishti" },
  "SUTRADHARA (IT Manager)": { members: 1, type: "Solo", weapon: "Buddhi" },
  "SPARDHA (Gaming)": { members: 4, type: "Team", weapon: "Astra" },
  "VYUHANTARA (Surprise Event)": { members: 3, type: "Team", weapon: "Maya" },
  "MAYAJAAL (Escape Room)": { members: 4, type: "Team", weapon: "Vyuha" },
  "VISHWAKARMA (Product Launch)": { members: 4, type: "Team", weapon: "Karta" },
  "ASTRACODERS (Web Designing)": { members: 2, type: "Team", weapon: "Shilpa" }
};


const CornerOrnament = ({ className }) => (
  <svg className={`form-svg-corner ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 20 V0 H20" stroke="#F5C518" strokeWidth="2" />
    <path d="M0 40 V0 H40" stroke="#F5C518" strokeWidth="1" opacity="0.3" />
    <circle cx="5" cy="5" r="3" fill="#F5C518" />
  </svg>
);

const ThematicInput = ({ label, ...props }) => (
  <div className="thematic-input-wrapper">
    <label className="thematic-label">{label}</label>
    <input className="thematic-input" {...props} />
    <motion.div
      initial={{ scaleX: 0 }}
      whileFocus={{ scaleX: 1 }}
      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F5C518] origin-left"
    />
  </div>
);

const SectionDivider = ({ title }) => (
  <div className="thematic-section-divider">
    <div className="line" />
    <span className="title">{title}</span>
    <div className="line" />
  </div>
);

export default function RegistrationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    collegeName: '',
    leaderName: '',
    leaderPhone: '',
    leaderEmail: '',
    events: []
  });

  const [participants, setParticipants] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const embers = React.useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      bottom: `-${Math.random() * 20}%`,
      width: `${Math.random() * 3 + 2}px`,
      height: `${Math.random() * 3 + 2}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 4}s`
    }));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        collegeName: '', leaderName: '', leaderPhone: '', leaderEmail: '', events: []
      });
      setParticipants({});
      setSuccess(false);
      setShowCheckout(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEventToggle = (eventName) => {
    setFormData(prev => {
      const isSelected = prev.events.includes(eventName);
      let newEvents;
      if (isSelected) {
        newEvents = prev.events.filter(e => e !== eventName);
        const updatedParticipants = { ...participants };
        delete updatedParticipants[eventName];
        setParticipants(updatedParticipants);
      } else {
        newEvents = [...prev.events, eventName];
        setParticipants(p => ({
          ...p,
          [eventName]: Array(EVENT_CONFIG[eventName].members).fill('')
        }));
      }
      return { ...prev, events: newEvents };
    });
  };

  const handleParticipantChange = (eventName, index, value) => {
    setParticipants(prev => {
      const updatedEvent = [...prev[eventName]];
      updatedEvent[index] = value;
      return { ...prev, [eventName]: updatedEvent };
    });
  };

  const getCalculatedTotals = () => {
    let count = 0;
    const formattedParticipants = [];
    formData.events.forEach(eventName => {
      const parts = participants[eventName] || [];
      const validParts = parts.filter(m => m.trim() !== '');
      count += validParts.length;
      validParts.forEach(p => {
        formattedParticipants.push({
           id: `p_${Math.random().toString(36).substr(2, 9)}`,
           name: p,
           event: eventName
        });
      });
    });
    return { count, amount: count * 100, formattedParticipants };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.events.length === 0) {
      alert("ERROR: Select your trial to enter the Kurukshetra.");
      return;
    }
    
    // Calculate if they even have names filled in
    const { count } = getCalculatedTotals();
    if (count === 0) {
      alert("ERROR: Please provide participant details for your selected events.");
      return;
    }

    setShowCheckout(true);
  };

  const handleMockPayment = async () => {
    setLoading(true);
    // Simulate Razorpay window handling delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { amount, formattedParticipants } = getCalculatedTotals();

    try {
      const { error } = await supabase
        .from('registrations')
        .insert([
          {
            college: formData.collegeName,
            leader_name: formData.leaderName,
            leader_phone: formData.leaderPhone,
            leader_email: formData.leaderEmail,
            total_amount: amount,
            payment_status: 'Verified',
            participants: formattedParticipants
          }
        ]);

      if (error) {
        throw error;
      }

      setSuccess(true);
      setShowCheckout(false);
      setTimeout(() => { onClose(); }, 5000);
    } catch (err) {
      console.error('Error!', err.message);
      alert("Registration failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="reg-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto pt-20 pb-10"
      >
        <motion.div
          key="reg-modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="reg-modal-content w-full max-w-2xl p-8 md:p-12 relative my-auto"
        >
          <CornerOrnament className="corner-tl" />
          <CornerOrnament className="corner-tr" />
          <CornerOrnament className="corner-bl" />
          <CornerOrnament className="corner-br" />

          {/* Background Animations */}
          <div className="modal-bg-anim">
            <svg className="mandala-bg" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <circle cx="50" cy="50" r="45" strokeDasharray="5 5" />
              <circle cx="50" cy="50" r="30" strokeDasharray="2 4" />
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="50" y1="50"
                  x2={50 + 40 * Math.cos(i * Math.PI / 6)}
                  y2={50 + 40 * Math.sin(i * Math.PI / 6)}
                />
              ))}
            </svg>
            {embers.map((ember, i) => (
              <div
                key={i}
                className="ember"
                style={{
                  left: ember.left,
                  bottom: ember.bottom,
                  width: ember.width,
                  height: ember.height,
                  animationDelay: ember.delay,
                  animationDuration: ember.duration
                }}
              />
            ))}
          </div>

          <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-[#F5C518] transition-all z-20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          {!success ? (
            !showCheckout ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-10"
                >
                  <h2 className="text-4xl font-cinzel text-white tracking-[0.2em] uppercase mb-4">
                    Registration is <span className="text-[var(--gold)]">Open</span>
                  </h2>
                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-40"></div>
                  <p className="mt-4 font-rajdhani text-gray-400 tracking-[0.1em] uppercase text-sm">Join the technical showdown at Devi-Manthan 2026</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div variants={sectionVariants} initial="hidden" animate="visible">
                  <SectionDivider title="01 — COLLEGE & LEADER" />
                  <div className="space-y-6">
                    <ThematicInput
                      label="College Name *"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your college name"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ThematicInput
                        label="Leader Name *"
                        name="leaderName"
                        value={formData.leaderName}
                        onChange={handleInputChange}
                        required
                        placeholder="The Lead Participant"
                      />
                      <ThematicInput
                        label="Leader Contact Number *"
                        name="leaderPhone"
                        value={formData.leaderPhone}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <ThematicInput
                      label="Leader Email ID *"
                      name="leaderEmail"
                      value={formData.leaderEmail}
                      onChange={handleInputChange}
                      required
                      type="email"
                      placeholder="leader@college.edu"
                    />
                  </div>
                </motion.div>

                <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                  <SectionDivider title="02 — EVENT SELECTION" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(EVENT_CONFIG).map((eventName) => (
                      <div
                        key={eventName}
                        onClick={() => handleEventToggle(eventName)}
                        className={`event-card-themed ${formData.events.includes(eventName) ? 'selected' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-cinzel text-sm text-white">
                            {eventName.includes(' (') ? eventName.split(' (')[1].replace(')', '') : eventName}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
                          {EVENT_CONFIG[eventName].type} • {EVENT_CONFIG[eventName].members} Participant{EVENT_CONFIG[eventName].members > 1 ? 's' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <AnimatePresence>
                  {formData.events.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <SectionDivider title="03 — PARTICIPANT DETAILS" />
                      <div className="space-y-6">
                        {formData.events.map((eventName) => (
                          <div key={eventName} className="bg-white/5 p-6 border border-white/10 rounded-sm">
                            <h4 className="text-sm font-cinzel text-[#F5C518] mb-4 tracking-widest">
                              {eventName.includes(' (') ? eventName.split(' (')[1].replace(')', '') : eventName}
                            </h4>
                            <div className={`grid grid-cols-1 ${EVENT_CONFIG[eventName].members > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
                              {Array.from({ length: EVENT_CONFIG[eventName].members }).map((_, idx) => (
                                <input
                                  key={idx}
                                  type="text"
                                  placeholder={`Participant ${idx + 1} Name`}
                                  value={participants[eventName][idx] || ''}
                                  onChange={(e) => handleParticipantChange(eventName, idx, e.target.value)}
                                  required={idx === 0}
                                  className="thematic-input"
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-8 gap-4 flex flex-col">
                  <button
                    type="submit"
                    disabled={formData.events.length === 0}
                    className="glow-btn-themed"
                  >
                    Proceed to Payment
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-500 hover:text-white font-rajdhani uppercase tracking-widest text-xs transition-colors"
                  >
                    Return to Home
                  </button>
                </div>
              </form>
            </>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-8"
                >
                    <div className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20 mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    
                    <h2 className="text-3xl font-cinzel text-white tracking-widest uppercase mb-2">Secure Checkout</h2>
                    <p className="font-rajdhani text-zinc-400 text-sm mb-10 tracking-widest uppercase truncate max-w-[80%]">
                        {formData.collegeName} · {formData.leaderEmail}
                    </p>

                    <div className="w-full max-w-sm bg-black/40 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                            <span className="font-rajdhani text-zinc-400 tracking-wider">Total Participants</span>
                            <span className="font-mono text-xl text-white">{getCalculatedTotals().count}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-rajdhani text-zinc-400 tracking-wider">Total Amount Due</span>
                            <span className="font-mono text-3xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                                ₹{getCalculatedTotals().amount}
                            </span>
                        </div>
                    </div>

                    <div className="w-full pt-4 gap-4 flex flex-col items-center">
                        <button
                            onClick={handleMockPayment}
                            disabled={loading}
                            className="w-full max-w-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing Payment...
                                </span>
                            ) : (
                                `Simulate Payment · ₹${getCalculatedTotals().amount}`
                            )}
                        </button>
                        
                        <button
                            onClick={() => setShowCheckout(false)}
                            disabled={loading}
                            className="mt-4 text-zinc-500 hover:text-amber-500 font-rajdhani uppercase tracking-widest text-xs transition-colors disabled:opacity-50"
                        >
                            ← Back to Details
                        </button>
                    </div>
                </motion.div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="success-chakra">
                <i className="fa-solid fa-check"></i>
              </div>
              <h2 className="text-4xl font-cinzel text-white mb-6 tracking-widest">REGISTRATION SUCCESSFUL</h2>
              <p className="text-[var(--gold)] font-rajdhani text-xl mb-2">Your team has been registered.</p>
              <p className="text-gray-500 text-sm font-rajdhani mb-10 tracking-widest">See you at the event!</p>
              <button
                onClick={onClose}
                className="glow-btn-themed !w-auto px-12"
              >
                Return
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
