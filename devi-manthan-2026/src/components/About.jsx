import { FaUsers } from 'react-icons/fa6';
import ReactCountUpModule from 'react-countup';
const CountUp = ReactCountUpModule.default || ReactCountUpModule;
import { motion } from 'framer-motion';
import RevealWrapper from './ui/RevealWrapper';
import LotusIcon from './ui/LotusIcon';
import MountMandara from './ui/MountMandara';

export default function About() {
  const stats = [
    { num: 11, label: 'Events' },
    { num: 2, label: 'Days' },
    { num: 324, label: 'Students', suffix: '+' },
    { num: 200, label: 'Prize Pool', prefix: '₹', suffix: 'K+' }
  ];

  return (
    <section id="about" className="relative py-24 bg-bg-surface overflow-hidden">
      <div className="mandala-bg absolute inset-0 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Column */}
          <div>
            <RevealWrapper>
              <div className="flex items-center gap-2 mb-4">
                <LotusIcon size={16} color="#D4AF37" />
                <span className="text-gold tracking-[4px] text-xs font-bold uppercase">The Legend</span>
              </div>
              <h2 className="font-cinzel text-4xl md:text-5xl text-gold mb-8 leading-tight">
                What is <br /><span className="text-primary-light">Devi-Manthan?</span>
              </h2>
            </RevealWrapper>

            <RevealWrapper delay={0.2}>
              <div className="font-raleway text-text-muted leading-relaxed text-lg space-y-6">
                <p>
                  Just as the cosmic ocean was churned by gods and demons to bring forth <span className="text-gold">Amrita</span> — the nectar of immortality — DEVI-MANTHAN 2026 is the ultimate churning of intellect, creativity, and technology.
                </p>
                <p>
                  Held at Shree Devi College of Information Science, Mangaluru, this intercollegiate IT fest brings together the brightest minds to compete across 11 events spanning coding, design, gaming, quiz, photography, and much more.
                </p>
                <p className="italic border-l-2 border-gold pl-4 text-text-primary">
                  "Be a deva or an asura — all are welcome on this battlefield of innovation."
                </p>
              </div>

              <div className="mt-8 inline-flex items-center gap-3 border border-accent/40 bg-accent/10 px-5 py-3 rounded-full text-accent font-raleway text-sm font-semibold">
                <FaUsers className="text-lg" /> Open to all intercollegiate students
              </div>
            </RevealWrapper>
          </div>

          {/* Right Column */}
          <RevealWrapper delay={0.4} className="flex justify-center">
            <MountMandara />
          </RevealWrapper>

        </div>

        {/* Stats Row */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              className="bg-bg-card border border-border-gold rounded-xl p-6 text-center hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-shadow group"
            >
              <div className="text-4xl md:text-5xl font-cinzel font-bold text-gold mb-2 group-hover:scale-110 transition-transform">
                {stat.prefix}
                <CountUp end={stat.num} duration={3} enableScrollSpy scrollSpyOnce />
                {stat.suffix}
              </div>
              <div className="font-raleway text-text-muted text-sm uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
