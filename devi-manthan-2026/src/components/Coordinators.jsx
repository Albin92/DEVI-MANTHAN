import { motion } from 'framer-motion';
import { FaPhone } from 'react-icons/fa6';
import VasukiDivider from './ui/VasukiDivider';
import RevealWrapper from './ui/RevealWrapper';

const staff = [
  { id: 1, name: 'Full Name', role: 'Staff Coordinator', phone: '+91 XXXXX XXXXX' },
  { id: 2, name: 'Full Name', role: 'Staff Coordinator', phone: '+91 XXXXX XXXXX' }
];

const students = [
  { id: 3, name: 'Full Name', role: 'Student Coordinator', phone: '+91 XXXXX XXXXX' },
  { id: 4, name: 'Full Name', role: 'Student Coordinator', phone: '+91 XXXXX XXXXX' },
  { id: 5, name: 'Full Name', role: 'Student Coordinator', phone: '+91 XXXXX XXXXX' }
];

const CoordinatorCard = ({ person }) => {
  const initials = person.name.split(' ').map(n => n[0]).join('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-bg-card border-b-2 border-gold rounded-xl p-6 text-center group transition-shadow hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
    >
      <div className="mx-auto w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center font-cinzel text-gold text-xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]">
        {initials}
      </div>
      <h3 className="font-cinzelPlain text-gold font-semibold text-lg">{person.name}</h3>
      <p className="font-raleway italic text-text-muted text-sm mt-1 mb-3">{person.role}</p>
      <a href={`tel:${person.phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-2 font-raleway text-gold text-sm hover:text-white transition-colors">
        <i className="fa-solid fa-phone text-xs"></i> {person.phone}
      </a>
    </motion.div>
  );
};

export default function Coordinators() {
  return (
    <section id="coordinators" className="py-24 bg-bg-surface relative">
      <div className="container mx-auto px-4 relative z-10">
        <RevealWrapper className="text-center mb-16">
          <h2 className="font-cinzel text-4xl md:text-5xl text-white mb-6">
            The Warriors of <span className="text-primary-light">Devi-Manthan</span>
          </h2>
        </RevealWrapper>

        <RevealWrapper delay={0.2} className="mb-12">
          <h3 className="text-center font-cinzelPlain text-gold text-2xl mb-8">Staff Coordinators</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-6">
            {staff.map(person => <CoordinatorCard key={person.id} person={person} />)}
          </div>
        </RevealWrapper>
        
        <RevealWrapper delay={0.3} className="my-16">
          <VasukiDivider />
        </RevealWrapper>

        <RevealWrapper delay={0.4}>
          <h3 className="text-center font-cinzelPlain text-gold text-2xl mb-8">Student Coordinators</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto gap-6">
            {students.map(person => <CoordinatorCard key={person.id} person={person} />)}
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}
