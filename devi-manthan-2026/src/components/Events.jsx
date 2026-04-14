import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { events } from '../data/events';
import VasukiDivider from './ui/VasukiDivider';
import RevealWrapper from './ui/RevealWrapper';
import EventCard from './EventCard';
import EventModal from './EventModal';

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const techEvents = events.filter(e => e.category === 'Technical');
  const cultEvents = events.filter(e => e.category === 'Cultural');

  return (
    <section id="events" className="relative py-24 bg-bg-dark min-h-screen overflow-hidden">
      {/* CELESTIAL BACKGROUND FX */}
      <div className="myth-bg-box">
        <div className="myth-grid-overlay"></div>
        <div className="myth-dust"></div>
        <div className="myth-glow-aura"></div>
      </div>

      <div className="diagonal-texture" />

      <div className="container mx-auto px-4 relative z-10 w-full max-w-[1400px]">
        <RevealWrapper className="text-center mb-16">
          <div className="text-gold tracking-[4px] text-xs font-bold uppercase mb-4">The Battlefield</div>
          <h2 className="font-cinzel text-5xl md:text-6xl text-white mb-6" style={{ textShadow: '0 0 30px rgba(245, 197, 24, 0.4)' }}>
            The <span className="text-primary-light">Trials</span>
          </h2>
          <VasukiDivider />
        </RevealWrapper>

        {/* TECHNICAL SECTION */}
        <RevealWrapper delay={0.2}>
          <div className="s-head mb-8" style={{ textAlign: 'left', borderBottom: '1px solid var(--cbl)', paddingBottom: '12px' }}>
            <p className="s-eye" style={{ justifyContent: 'flex-start' }}>⚔ The Forges of Vidya</p>
            <h2 className="s-title" style={{ fontSize: '2rem' }}>Technical Events</h2>
          </div>
        </RevealWrapper>

        <motion.div layout className="ev-grid mb-24">
          <AnimatePresence>
            {techEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onOpenModal={() => setSelectedEvent(event)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CULTURAL SECTION */}
        {cultEvents.length > 0 && (
          <>
            <RevealWrapper delay={0.2}>
              <div className="s-head mb-8" style={{ textAlign: 'left', borderBottom: '1px solid var(--cbl)', paddingBottom: '12px' }}>
                <p className="s-eye" style={{ justifyContent: 'flex-start' }}>✦ The Stage of Colors</p>
                <h2 className="s-title" style={{ fontSize: '2rem' }}>Cultural Events</h2>
              </div>
            </RevealWrapper>

            <motion.div layout className="ev-grid">
              <AnimatePresence>
                {cultEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onOpenModal={() => setSelectedEvent(event)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>

      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  );
}
