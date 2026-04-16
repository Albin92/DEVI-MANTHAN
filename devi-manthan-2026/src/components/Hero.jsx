import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import gsap from 'gsap';
import { FaCalendar, FaClock } from 'react-icons/fa6';
import ParticleCanvas from './ui/ParticleCanvas';
import ChakraSVG from './ui/ChakraSVG';
import WaveDivider from './ui/WaveDivider';
import LotusIcon from './ui/LotusIcon';

export default function Hero() {
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      const chars = titleRef.current.innerText.split('');
      titleRef.current.innerText = '';
      chars.forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        span.className = 'char inline-block';
        if(char === ' ') span.innerHTML = '&nbsp;';
        titleRef.current.appendChild(span);
      });

      gsap.from(".hero-title .char", {
        opacity: 0, 
        y: 100, 
        rotateX: -90,
        stagger: 0.04, 
        duration: 1.2, 
        ease: "back.out(2)",
        delay: 0.5
      });
    }
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden bg-bg-dark flex items-center justify-center">
      <ParticleCanvas />
      
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-bg-dark/50 to-bg-dark z-0" />
      
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="border border-gold/60 text-gold/80 text-[11px] tracking-[3px] font-raleway uppercase px-5 py-1.5 rounded-full mb-8 backdrop-blur-sm"
        >
          SHREE DEVI COLLEGE OF INFORMATION SCIENCE PRESENTS
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4, type: "spring" }}
        >
          <ChakraSVG className="w-20 h-20 mb-6" />
        </motion.div>

        <h1 
          ref={titleRef}
          className="hero-title font-cinzel font-black tracking-widest text-[clamp(2.5rem,8vw,7rem)] leading-tight mb-2 bg-gradient-to-br from-gold via-gold-light to-primary bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(212,175,55,0.5)]"
        >
          DEVI-MANTHAN
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-cinzel text-6xl md:text-7xl mb-8"
          style={{ WebkitTextStroke: '1px var(--secondary)', color: 'transparent' }}
        >
          2026
        </motion.div>

        <div className="font-cinzel italic text-gold text-lg md:text-xl h-[30px] mb-8">
          <TypeAnimation
            sequence={[
              'Churning Tradition into Technology', 2000,
              'Tradition Rewired. Innovation Unleashed.', 2000,
              'Where Legends Code Their Destiny.', 2000
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          <div className="flex items-center gap-2 bg-white/5 border border-gold/30 px-6 py-2 rounded-full font-raleway text-sm backdrop-blur-md">
            <FaCalendar className="text-gold" /> 24–25 APRIL 2026
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-gold/30 px-6 py-2 rounded-full font-raleway text-sm backdrop-blur-md">
            <FaClock className="text-gold" /> 9:00 AM – 4:00 PM
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212,175,55,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo('events')}
            className="bg-gold text-bg-dark font-cinzelPlain px-8 py-3 rounded-lg font-bold hover:bg-gold-light transition-colors"
          >
            ⚔ Explore Events
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'var(--secondary)', color: 'var(--bg-dark)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo('register')}
            className="border-2 border-gold text-gold font-cinzelPlain px-8 py-3 rounded-lg font-bold transition-all"
          >
            Register Now
          </motion.button>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        onClick={() => scrollTo('about')}
      >
        <LotusIcon size={20} color="#D4AF37" />
        <span className="font-raleway text-[10px] tracking-widest text-gold uppercase opacity-80">Scroll to discover</span>
      </motion.div>

      <WaveDivider />
    </section>
  );
}
