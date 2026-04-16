import { motion } from 'framer-motion';

const categoryStyles = {
  Technical:  'bg-accent/20 text-accent border border-accent/30',
  Management: 'bg-primary/20 text-primary-light border border-primary/30',
  Creative:   'bg-accent-teal/20 text-accent-teal border border-accent-teal/30',
  Fun:        'bg-amber-500/20 text-amber-400 border border-amber-400/30',
  Innovation: 'bg-blue-500/20 text-blue-400 border border-blue-400/30',
  Gaming:     'bg-green-500/20 text-green-400 border border-green-400/30',
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit: { opacity: 0, scale: 0.9 }
};

export default function EventCard({ event, onOpenModal }) {
  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(600px) rotateY(${x*12}deg) rotateX(${-y*12}deg) translateY(-8px)`;
  };

  const handleMouseLeave = (e) => {
    if (window.innerWidth < 768) return;
    e.currentTarget.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0px)';
  };

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="ec"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />

      <span className={`text-xs px-3 py-1 rounded-full font-raleway font-semibold mb-2 inline-block ${categoryStyles[event.category] || categoryStyles.Technical}`} style={{width: 'max-content'}}>
        {event.category}
      </span>

      {event.imageIcon ? (
        <div style={{ height: '65px', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <img src={event.imageIcon} alt={event.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))' }} />
        </div>
      ) : (
        <div className="text-gold text-4xl mb-1 duration-300 transform group-hover:scale-110 origin-left" style={{filter: 'drop-shadow(0 0 10px rgba(245, 197, 24, 0.4))'}}>{event.icon}</div>
      )}

      <h3 className="s-title" style={{fontSize: '1.25rem', marginBottom: '4px'}}>{event.name}</h3>

      <p className="font-raleway italic text-text-muted text-sm mb-2" style={{color: 'var(--muted)'}}>
        "{event.tagline}"
      </p>

      <p className="font-raleway text-sm leading-relaxed mb-4 line-clamp-3" style={{color: '#f8f0dc'}}>
        {event.description}
      </p>

      <button onClick={() => onOpenModal(event)}
        className="btn-ghost" style={{padding: '8px 20px', fontSize: '0.8rem', marginTop: 'auto', alignSelf: 'flex-start'}}>
        View Details →
      </button>
    </motion.article>
  );
}
