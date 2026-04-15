import { motion } from 'framer-motion';
import { FaCalendar, FaMapPin, FaUsers } from 'react-icons/fa6';
import RevealWrapper from './ui/RevealWrapper';
import Countdown from './Countdown';

export default function Register() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="register" className="relative py-24" style={{ background: 'linear-gradient(135deg, #1A0609 0%, #2D0A1A 50%, #0A0409 100%)' }}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <RevealWrapper>
            <div className="text-gold tracking-[3px] text-xs font-bold uppercase mb-4">The Conch Has Sounded</div>
            <motion.h2 
              className="font-cinzel text-4xl md:text-5xl text-white mb-6"
            >
              Registration is <span className="text-primary-light">Open!</span>
            </motion.h2>
            <p className="font-raleway text-text-muted text-lg mb-8">
              Gather your team, hone your skills, and prepare for the ultimate technical showdown. The battlefield awaits you.
            </p>
          </RevealWrapper>

          <RevealWrapper delay={0.2}>
            <Countdown />
          </RevealWrapper>

          <RevealWrapper delay={0.4}>
            <div className="flex flex-wrap gap-3 justify-center mt-10">
              <div className="flex items-center gap-2 border border-gold/30 text-text-muted px-4 py-2 rounded-full text-sm font-raleway bg-bg-dark/30 backdrop-blur-sm">
                <FaCalendar className="text-gold" /> 24–25 April 2026
              </div>
              <div className="flex items-center gap-2 border border-gold/30 text-text-muted px-4 py-2 rounded-full text-sm font-raleway bg-bg-dark/30 backdrop-blur-sm">
                <FaMapPin className="text-gold" /> Shree Devi College of Information Science
              </div>
              <div className="flex items-center gap-2 border border-gold/30 text-text-muted px-4 py-2 rounded-full text-sm font-raleway bg-bg-dark/30 backdrop-blur-sm">
                <FaUsers className="text-gold" /> All Intercollegiate Students Welcome
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToContact}
              className="font-cinzelPlain text-bg-dark bg-gold text-xl px-10 py-4 rounded-xl mt-12 font-bold animate-glow-pulse inline-flex items-center justify-center gap-3"
            >
              ⚔ Register Now — Enter the Battlefield
            </motion.button>
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}
