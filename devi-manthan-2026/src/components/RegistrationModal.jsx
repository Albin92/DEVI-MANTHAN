import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EVENT_CONFIG = {
  "CHITRAKATHA (Photography)": { members: 1, type: "Solo" },
  "SUTRADHARA (IT Manager)": { members: 1, type: "Solo" },
  "SPARDHA (Gaming)": { members: 4, type: "Team" },
  "VYUHANTARA (Surprise Event)": { members: 3, type: "Team" },
  "MAYAJAAL (Escape Room)": { members: 4, type: "Team" },
  "VISHWAKARMA (Product Launch)": { members: 4, type: "Team" },
  "ASTRACODERS (Web Designing)": { members: 2, type: "Team" }
};

const scriptURL = 'https://script.google.com/macros/s/AKfycbyfLclDur_fftk-6uNBtScP-Cd9hqSYFLFg8JUfSqvPNtFtq1-ZJ8xeHEAe7H_49fdr3w/exec';

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
        // Remove from participants state
        const updatedParticipants = { ...participants };
        delete updatedParticipants[eventName];
        setParticipants(updatedParticipants);
      } else {
        newEvents = [...prev.events, eventName];
        // Initialize participant array
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.events.length === 0) {
      alert("ERROR: You must select at least one trial to enter.");
      return;
    }

    setLoading(true);

    // Format events payload string
    const eventDetailsString = formData.events.map(ev => {
      const members = participants[ev].filter(m => m.trim() !== '').join(', ');
      return `${ev.split(' (')[0]}: [${members}]`;
    }).join(' | ');

    const payload = new FormData();
    payload.append('name', formData.collegeName); // Mapping college to name
    payload.append('dept', formData.leaderName); // Mapping leader to dept
    payload.append('regNo', formData.leaderPhone); // Mapping phone to regNo
    payload.append('year', formData.leaderEmail); // Mapping email to year
    payload.append('event', eventDetailsString);

    try {
      await fetch(scriptURL, {
        method: 'POST',
        body: payload,
        mode: 'no-cors'
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 4000);
    } catch (err) {
      console.error('Error!', err.message);
      alert("Deployment failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="reg-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto pt-20 pb-10"
      >
        <motion.div
          key="reg-modal-content"
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          className="bg-[#110818] border border-[#E74C3C]/30 w-full max-w-2xl p-6 md:p-8 relative shadow-[0_0_40px_rgba(231,76,60,0.15)] my-auto mt-[40px] md:mt-[80px]"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-[#E74C3C] transition z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          {!success ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-cinzel text-white tracking-widest uppercase mb-2">
                  Join the <span className="text-[#E74C3C]">Mahabharata</span>
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#E74C3C] to-transparent opacity-50 mb-2"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* PHASE 01 */}
                <div>
                  <h3 className="text-[#E74C3C] text-sm font-rajdhani font-bold tracking-[0.2em] uppercase border-b border-[#E74C3C]/30 pb-2 mb-4">
                    01 — THE CLAN & COMMANDER
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-rajdhani text-gray-400 mb-1 tracking-widest uppercase">College Name *</label>
                      <input name="collegeName" value={formData.collegeName} onChange={handleInputChange} required type="text" placeholder="Enter your college name" className="w-full p-3 rounded-sm bg-black/60 border border-white/10 text-[#F5F0E8] font-rajdhani text-base focus:border-[#E74C3C] focus:outline-none focus:ring-1 focus:ring-[#E74C3C] transition-all" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-rajdhani text-gray-400 mb-1 tracking-widest uppercase">Commander (Leader) Name *</label>
                        <input name="leaderName" value={formData.leaderName} onChange={handleInputChange} required type="text" placeholder="Full name" className="w-full p-3 rounded-sm bg-black/60 border border-white/10 text-[#F5F0E8] font-rajdhani text-base focus:border-[#E74C3C] focus:outline-none focus:ring-1 focus:ring-[#E74C3C] transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-rajdhani text-gray-400 mb-1 tracking-widest uppercase">Leader Contact Number *</label>
                        <input name="leaderPhone" value={formData.leaderPhone} onChange={handleInputChange} required type="text" placeholder="+91 00000 00000" className="w-full p-3 rounded-sm bg-black/60 border border-white/10 text-[#F5F0E8] font-rajdhani text-base focus:border-[#E74C3C] focus:outline-none focus:ring-1 focus:ring-[#E74C3C] transition-all" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-rajdhani text-gray-400 mb-1 tracking-widest uppercase">Leader Email ID *</label>
                      <input name="leaderEmail" value={formData.leaderEmail} onChange={handleInputChange} required type="email" placeholder="leader@college.edu" className="w-full p-3 rounded-sm bg-black/60 border border-white/10 text-[#F5F0E8] font-rajdhani text-base focus:border-[#E74C3C] focus:outline-none focus:ring-1 focus:ring-[#E74C3C] transition-all" />
                    </div>
                  </div>
                </div>

                {/* PHASE 02 */}
                <div>
                  <h3 className="text-[#E74C3C] text-sm font-rajdhani font-bold tracking-[0.2em] uppercase border-b border-[#E74C3C]/30 pb-2 mb-4">
                    02 — KURUKSHETRA TRIALS
                  </h3>
                  <label className="block text-xs font-rajdhani text-gray-400 mb-3 tracking-widest uppercase">Select one or more events to participate in</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.keys(EVENT_CONFIG).map((eventName) => (
                      <label key={eventName} className={`flex items-center space-x-3 cursor-pointer group border p-3 rounded-sm transition-colors ${formData.events.includes(eventName) ? 'border-[#E74C3C] bg-[#E74C3C]/5' : 'border-white/10 bg-black/40 hover:border-[#E74C3C]/50'}`}>
                        <input type="checkbox" checked={formData.events.includes(eventName)} onChange={() => handleEventToggle(eventName)} className="form-checkbox h-4 w-4 text-[#E74C3C] bg-black border-white/30 rounded-sm focus:ring-[#E74C3C]" />
                        <div className="flex flex-col">
                          <span className={`text-sm font-rajdhani font-bold ${formData.events.includes(eventName) ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{eventName.split(' (')[0]}</span>
                          <span className="text-[10px] font-rajdhani text-gray-500 uppercase tracking-widest">{eventName.split('(')[1].replace(')', '')} · {EVENT_CONFIG[eventName].type}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* PHASE 03 */}
                {formData.events.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <h3 className="text-[#E74C3C] text-sm font-rajdhani font-bold tracking-[0.2em] uppercase border-b border-[#E74C3C]/30 pb-2 mb-4 mt-6">
                      03 — PARTICIPANT DETAILS
                    </h3>
                    <label className="block text-xs font-rajdhani text-gray-400 mb-4 tracking-widest uppercase">Enter participant info for each selected event</label>

                    <div className="space-y-5">
                      {formData.events.map((eventName) => (
                        <div key={eventName} className="border border-white/10 bg-black/30 p-4 rounded-sm">
                          <h4 className="text-sm font-cinzel text-white mb-3 tracking-wider">{eventName}</h4>
                          <div className={`grid grid-cols-1 ${EVENT_CONFIG[eventName].members > 1 ? 'md:grid-cols-2' : ''} gap-3`}>
                            {Array.from({ length: EVENT_CONFIG[eventName].members }).map((_, idx) => (
                              <div key={idx}>
                                <input
                                  type="text"
                                  placeholder={EVENT_CONFIG[eventName].members === 1 ? "Warrior Full Name" : `Warrior ${idx + 1} Name`}
                                  value={participants[eventName][idx] || ''}
                                  onChange={(e) => handleParticipantChange(eventName, idx, e.target.value)}
                                  required={idx === 0} // Only first member is strictly required generally, but you can enforce all
                                  className="w-full p-2.5 rounded-sm bg-black/60 border border-white/10 text-[#F5F0E8] font-rajdhani text-sm focus:border-[#E74C3C] focus:outline-none focus:ring-1 focus:ring-[#E74C3C] transition-all"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}



                <div className="space-y-3 pt-2">
                  <button type="submit" disabled={loading || formData.events.length === 0} className="w-full flex justify-center items-center py-4 text-base tracking-[0.2em] font-rajdhani font-bold bg-[#E74C3C] text-white hover:bg-white hover:text-[#E74C3C] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase rounded-sm">
                    {loading ? 'Consulting the Gods...' : 'Register Clan'}
                  </button>
                  <button type="button" onClick={onClose} className="w-full flex justify-center items-center py-3 text-sm tracking-[0.2em] font-rajdhani font-bold border border-white/20 text-gray-300 hover:text-white hover:border-white transition-colors duration-300 uppercase rounded-sm">
                    Return to Battlefield
                  </button>
                </div>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-[#E74C3C]/20 flex items-center justify-center border border-[#E74C3C] mb-6 shadow-[0_0_30px_rgba(231,76,60,0.3)]">
                <i className="fa-solid fa-check text-4xl text-[#E74C3C]"></i>
              </div>
              <h2 className="text-3xl font-cinzel text-white mb-4">Clan Enlisted</h2>
              <p className="text-[#F5F0E8] font-rajdhani text-lg mb-2">The commander and warriors have been registered.</p>
              <p className="text-gray-400 text-sm font-rajdhani mb-8">Awaiting further instructions from the grand pavilion...</p>
              <button onClick={onClose} className="border border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white px-8 py-3 rounded-sm font-rajdhani tracking-widest font-bold transition-colors uppercase">
                Return
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
