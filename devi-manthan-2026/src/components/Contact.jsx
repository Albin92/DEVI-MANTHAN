import { motion } from 'framer-motion';
import { FaMapPin, FaCalendar, FaPhone, FaEnvelope, FaInstagram, FaLinkedinIn, FaWhatsapp, FaChevronRight } from 'react-icons/fa6';
import LotusIcon from './ui/LotusIcon';
import RevealWrapper from './ui/RevealWrapper';

export default function Contact() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="contact" className="py-20 bg-bg-dark border-t border-border-gold/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">

          <RevealWrapper delay={0.1}>
            <div className="flex items-center gap-2 mb-4">
              <LotusIcon size={32} color="#D4AF37" />
              <h3 className="font-cinzel text-2xl text-gold font-bold">DEVI-MANTHAN 2026</h3>
            </div>
            <p className="font-raleway text-text-muted mb-2">Shree Devi College of Information Science</p>
            <p className="font-raleway text-gold italic mb-6">"Churning Tradition into Technology"</p>

            <div className="flex gap-3">
              {[FaInstagram].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="https://www.instagram.com/sdcis_2k26?igsh=ZG5wMmRqMTkxY2Fm" target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.15 }}
                  className="w-10 h-10 rounded-full border border-border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-bg-dark transition-colors"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </RevealWrapper>

          <RevealWrapper delay={0.2} className="lg:pl-8">
            <h4 className="font-cinzelPlain text-gold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 mb-8">
                <li><a href="#faq" className="font-raleway text-text-muted hover:text-gold transition-colors flex items-center gap-2"><FaChevronRight className="text-xs text-gold" /> FAQ</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Rules & Regulations coming soon!'); }} className="font-raleway text-text-muted hover:text-gold transition-colors flex items-center gap-2"><FaChevronRight className="text-xs text-gold" /> Rules and Regulation</a></li>
            </ul>

            <h4 className="font-cinzelPlain text-gold text-lg mb-6">Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 font-raleway text-text-muted">
                <FaMapPin className="text-gold mt-1 shrink-0" />
                <span>Shree Devi College of Information Science, Main Campus, Mangaluru, Karnataka</span>
              </li>
              <li className="flex items-start gap-3 font-raleway text-text-muted">
                <FaCalendar className="text-gold mt-1 shrink-0" />
                <span>24–25 April 2026 | 9:00 AM – 4:00 PM</span>
              </li>
              <li className="flex items-start gap-3 font-raleway text-text-muted">
                <FaPhone className="text-gold mt-1 shrink-0" />
                <span>+91 98765 43210 | +91 98765 43211</span>
              </li>
              <li className="flex items-start gap-3 font-raleway text-text-muted">
                <FaEnvelope className="text-gold mt-1 shrink-0" />
                <a href="mailto:devimanthan2026@gmail.com" className="hover:text-gold transition-colors">devimanthan2026@gmail.com</a>
              </li>
            </ul>

            <div className="w-32 h-32 border-2 border-dashed border-border-gold/60 rounded-lg flex flex-col items-center justify-center mt-6 p-2 text-text-muted hover:border-gold hover:text-gold transition-colors cursor-pointer bg-white/5">
              <span className="text-xs text-center font-raleway uppercase tracking-widest leading-relaxed">Scan to<br />Register</span>
            </div>
          </RevealWrapper>

        </div>
      </div>
    </section>
  );
}
