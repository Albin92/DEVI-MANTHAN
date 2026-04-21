import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

const EVENT_CONFIG = {
  "DRISHTICHAKRA (Photography & Videography)": { members: 1, type: "Solo", weapon: "Drishti" },
  "SUTRADHARA (IT Manager)": { members: 1, type: "Solo", weapon: "Buddhi" },
  "BRAHMASTRA (Gaming)": { members: 2, type: "Team", weapon: "Astra" },
  "VYUHANTARA (Surprise Event)": { members: 2, type: "Team", weapon: "Maya" },
  "CHAKRAVYUHA (Escape Room)": { members: 2, type: "Team", weapon: "Vyuha" },
  "UDBHAVA (Product Launch)": { members: 2, type: "Team", weapon: "Karta" },
  "ASTRACODERS (Web Designing)": { members: 2, type: "Team", weapon: "Shilpa" },
  "ROOPAYANTRA (Tech Walk)": { members: 6, type: "Team", weapon: "Drishti" }
};


const CornerOrnament = ({ className }) => (
  <svg className={`form-svg-corner ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 20 V0 H20" stroke="#F5C518" strokeWidth="2" />
    <path d="M0 40 V0 H40" stroke="#F5C518" strokeWidth="1" opacity="0.3" />
    <circle cx="5" cy="5" r="3" fill="#F5C518" />
  </svg>
);

const ThematicInput = ({ label, prefix, ...props }) => (
  <div className="thematic-input-wrapper">
    <label className="thematic-label">{label}</label>
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-4 text-zinc-400 font-rajdhani pointer-events-none text-sm">
          {prefix}
        </span>
      )}
      <input
        className={`thematic-input ${prefix ? 'with-prefix' : ''}`}
        {...props}
      />
    </div>
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
  const [closedEvents, setClosedEvents] = useState({}); // eventKey -> true if closed

  // Fetch closed slots from Supabase
  useEffect(() => {
    if (!isOpen) return;
    supabase.from('event_slots').select('event_key, is_open').then(({ data }) => {
      if (data) {
        const map = {};
        data.forEach(r => { if (!r.is_open) map[r.event_key] = true; });
        setClosedEvents(map);
      }
    });
  }, [isOpen]);

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
          [eventName]: Array.from({ length: EVENT_CONFIG[eventName].members }, () => ({ name: '', phone: '' }))
        }));
      }
      return { ...prev, events: newEvents };
    });
  };

  const handleParticipantChange = (eventName, index, field, value) => {
    setParticipants(prev => {
      const updatedEvent = [...prev[eventName]];
      updatedEvent[index] = { ...updatedEvent[index], [field]: value };
      return { ...prev, [eventName]: updatedEvent };
    });
  };

  const getCalculatedTotals = () => {
    let count = 0;
    const formattedParticipants = [];
    formData.events.forEach(eventName => {
      const parts = participants[eventName] || [];
      const validParts = parts.filter(m => m.name && m.name.trim() !== '');
      count += validParts.length;
      validParts.forEach(p => {
        formattedParticipants.push({
          id: `p_${Math.random().toString(36).substr(2, 9)}`,
          name: p.name,
          phone: p.phone ? `+91${p.phone}` : '',
          event: eventName
        });
      });
    });
    return { count, formattedParticipants };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.events.length === 0) {
      alert("ERROR: Select your trial to enter the Kurukshetra.");
      return;
    }

    // Calculate if they even have names filled in
    const { count, formattedParticipants } = getCalculatedTotals();
    if (count === 0) {
      alert("ERROR: Please provide participant details for your selected events.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('registrations')
        .insert([
          {
            college: formData.collegeName,
            leader_name: formData.leaderName,
            leader_phone: `+91${formData.leaderPhone}`,
            leader_email: formData.leaderEmail,
            total_amount: 0,
            payment_status: 'Pending',
            participants: formattedParticipants
          }
        ]);

      if (error) {
        throw error;
      }

      setSuccess(true);
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
                        prefix="+91"
                        pattern="\d{10}"
                        maxLength="10"
                        placeholder="XXXXXXXXXX"
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
                    {Object.keys(EVENT_CONFIG).map((eventName) => {
                      // Derive the key: e.g. "CHAKRAVYUHA (Quiz)" -> "CHAKRAVYUHA"
                      const eventKey = eventName.split(' (')[0].toUpperCase();
                      const isClosed = closedEvents[eventKey];
                      return (
                        <div
                          key={eventName}
                          onClick={() => !isClosed && handleEventToggle(eventName)}
                          className={`event-card-themed ${formData.events.includes(eventName) ? 'selected' : ''
                            } ${isClosed ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-cinzel text-sm text-white">
                              {eventName.includes(' (') ? eventName.split(' (')[1].replace(')', '') : eventName}
                            </span>
                            {isClosed && (
                              <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full">
                                FULL
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
                            {isClosed
                              ? 'Registration Closed'
                              : `${EVENT_CONFIG[eventName].type} • ${EVENT_CONFIG[eventName].members} Participant${EVENT_CONFIG[eventName].members > 1 ? 's' : ''}`
                            }
                          </p>
                        </div>
                      );
                    })}
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
                                <div key={idx} className="flex flex-col gap-2">
                                  <input
                                    type="text"
                                    placeholder={`Participant ${idx + 1} Name`}
                                    value={participants[eventName]?.[idx]?.name || ''}
                                    onChange={(e) => handleParticipantChange(eventName, idx, 'name', e.target.value)}
                                    required={idx === 0}
                                    className="thematic-input w-full"
                                  />
                                  <div className="relative flex items-center w-full">
                                    <span className="absolute left-4 text-zinc-400 font-rajdhani pointer-events-none text-sm">
                                      +91
                                    </span>
                                    <input
                                      type="text"
                                      placeholder="XXXXXXXXXX"
                                      value={participants[eventName]?.[idx]?.phone || ''}
                                      onChange={(e) => handleParticipantChange(eventName, idx, 'phone', e.target.value)}
                                      required={idx === 0}
                                      pattern="\d{10}"
                                      maxLength="10"
                                      className="thematic-input w-full with-prefix"
                                    />
                                  </div>
                                </div>
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
                    disabled={formData.events.length === 0 || loading}
                    className="glow-btn-themed flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
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
