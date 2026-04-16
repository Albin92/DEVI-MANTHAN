import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

export default function EventModal({ event, isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen || !event) return null;

  const rulesList = event.rules ? event.rules.split('\n').filter(r => r.trim() !== '') : [];

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#02020D]/98 z-[100002] flex items-start justify-center p-4 md:p-8 md:backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="ancient-modal max-w-6xl w-full relative flex flex-col md:flex-row gap-0 md:gap-10 my-auto md:my-10 rounded-lg shadow-2xl h-fit shrink-0"
          onClick={e => e.stopPropagation()}
        >
          {/* ORNAMENTS */}
          <div className="modal-corner tl"></div>
          <div className="modal-corner tr"></div>
          <div className="modal-corner bl"></div>
          <div className="modal-corner br"></div>

          <div className="divine-aura"></div>

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-[var(--gold)] hover:scale-110 transition-transform z-[60] text-2xl"
            onClick={onClose}
          >
            <i className="fa-solid fa-circle-xmark"></i>
          </button>

          {/* LEFT COLUMN: The Divine Manifestation */}
          <div className="flex-1 flex flex-col p-6 md:p-10 border-b md:border-b-0 md:border-r border-white/5 bg-black/20">

            <div className="relative">
              <div className="text-[var(--saff)] text-[10px] font-orbitron tracking-[0.3em] uppercase mb-4 opacity-70 flex items-center gap-2">
                <span className="h-[1px] w-6 bg-[var(--saff)]/40"></span>
                Part of the {event.category} Faction
              </div>

              <h2 className="font-cinzel-deco text-4xl md:text-6xl font-black mb-2 tracking-tight uppercase"
                style={{
                  background: "radial-gradient(circle at 50% 10%, #fff 0%, var(--gold2) 20%, var(--gold) 50%, #b27a00 80%, var(--saff) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.5))"
                }}>
                {event.name}
              </h2>

              <div className="flex items-center gap-3 mb-8">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-[var(--gold3)] to-transparent"></div>
                <div className="text-[var(--gold)] font-orbitron text-[10px] font-bold tracking-[4px] uppercase decoration-current">
                  {event.subtitle}
                </div>
              </div>
            </div>

            {/* SYMBOLIC LOGO */}
            <div className="flex-1 flex items-center justify-center bg-black/40 rounded-xl p-8 mb-8 relative border border-white/5 shadow-inner group overflow-hidden">
              {/* Rotating Chakra watermark */}
              <motion.div
                className="absolute text-[var(--gold)] opacity-[0.03] text-[20rem] pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                <i className="fa-solid fa-dharmachakra"></i>
              </motion.div>

              {event.imageIcon ? (
                <motion.img
                  src={event.imageIcon}
                  alt={event.name}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="w-full max-w-[320px] h-auto object-contain filter drop-shadow-[0_0_40px_rgba(245,197,24,0.3)] group-hover:scale-105 transition-transform duration-700 z-10"
                />
              ) : (
                <div className="text-[var(--gold3)] text-9xl group-hover:scale-110 transition-transform duration-700 z-10" style={{ filter: 'drop-shadow(0 0 30px rgba(245, 197, 24, 0.4))' }}>
                  {event.icon}
                </div>
              )}
            </div>

            <div className="bg-black/30 p-5 rounded-lg border-l-2 border-[var(--saff)]">
              <p className="font-rajdhani text-white/40 text-[13px] italic mb-2 tracking-wide">
                "{event.tagline}"
              </p>
              <p className="font-rajdhani text-white/80 text-sm leading-relaxed">
                {event.description}
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: The Mandate & Warriors */}
          <div className="flex-1 flex flex-col p-6 md:p-10 bg-black/10">

            {/* Rules Section */}
            <div className="mb-10">
              <div className="shloka-header">
                <span className="text-[var(--gold)] text-[10px] font-orbitron font-bold tracking-[4px] uppercase">
                  <i className="fa-solid fa-scroll mr-2"></i> The Mandate / Rules
                </span>
              </div>

              <ul className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {rulesList.map((rule, idx) => {
                  const ruleText = rule.replace(/^[0-9]+\.\s*/, '');
                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.05) }}
                      className="flex items-start gap-0 scroll-text text-sm"
                    >
                      <span className="myth-bullet mt-1">
                        <i className="fa-solid fa-dharmachakra"></i>
                      </span>
                      <span className="text-white/70">{ruleText}</span>
                    </motion.li>
                  )
                })}
              </ul>
            </div>

            {/* Event Heads Section */}
            {event.eventHeads && event.eventHeads.length > 0 && (
              <div>
                <div className="shloka-header">
                  <span className="text-[var(--gold)] text-[10px] font-orbitron font-bold tracking-[4px] uppercase">
                    <i className="fa-solid fa-shield-halved mr-2"></i> Faction Leads
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.eventHeads.map((head, i) => (
                    <div key={i} className="ancient-card p-4 flex items-center gap-4 group">

                      {head.photo ? (
                        <div className="relative">
                          <img src={head.photo} alt={head.name} className="w-12 h-12 rounded-full object-cover border-2 border-[var(--gold3)]" />
                          <div className="absolute inset-0 rounded-full bg-[var(--gold)] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center border border-[var(--gold3)] text-[var(--gold)]">
                          <i className="fa-solid fa-user-ninja"></i>
                        </div>
                      )}

                      <div>
                        <div className="text-[var(--saff)] text-[9px] font-orbitron tracking-widest uppercase mb-0.5">{head.role}</div>
                        <div className="text-white text-sm font-cinzel font-bold">{head.name}</div>
                        <div className="text-white/30 text-[10px] font-orbitron hover:text-[var(--gold)] transition-colors">
                          <a href={`tel:${head.phone}`}><i className="fa-solid fa-phone-volume mr-1"></i>{head.phone}</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-10 flex justify-center md:justify-end">
              <button
                onClick={() => {
                  onClose();
                  navigate('/register');
                }}
                className="bg-transparent border-2 border-[var(--gold)] text-[var(--gold)] font-orbitron font-bold text-xs px-10 py-4 rounded-sm hover:bg-[var(--gold)] hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(245,197,24,0.1)] hover:shadow-[0_0_30px_rgba(245,197,24,0.3)] relative overflow-hidden group"
              >
                <span className="relative z-10 tracking-[3px]">COMMENCE TRIAL</span>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

