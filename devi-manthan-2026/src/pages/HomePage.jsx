import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MagneticButton from '../components/ui/MagneticButton';
import AboutPage from './AboutPage';

export default function HomePage() {

  // Generate deterministic embers for the slow fire effect
  const embers = useMemo(() => {
    return Array.from({ length: 45 }).map(() => ({
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 6 + 5,
      delay: Math.random() * 5,
      drift: (Math.random() - 0.5) * 100
    }));
  }, []);

  const handleBrochureClick = (e) => {
    e.preventDefault();
    const s = document.createElement('div');
    Object.assign(s.style, {
      position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%) translateY(100px)',
      background: 'rgba(2,2,13,.97)', border: '1px solid var(--gold)', borderRadius: '8px',
      padding: '12px 28px', fontFamily: "'Rajdhani',sans-serif", fontSize: '.95rem',
      color: 'var(--gold)', zIndex: '9000', transition: 'transform .4s cubic-bezier(.34,1.56,.64,1)',
      backdropFilter: 'blur(12px)', whiteSpace: 'nowrap'
    });
    s.textContent = '☸  Brochure download coming soon!';
    document.body.appendChild(s);
    setTimeout(() => s.style.transform = 'translateX(-50%) translateY(0)', 10);
    setTimeout(() => { s.style.transform = 'translateX(-50%) translateY(100px)'; setTimeout(() => s.remove(), 400) }, 3500);
  };

  // Movie-poster title typography style
  const epicTitleStyle = {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: "clamp(3.5rem, 11vw, 11rem)",
    fontWeight: 900,
    lineHeight: 1,
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "clamp(10px, 3vw, 30px)",
    background: "radial-gradient(circle at 50% 10%, #fff 0%, var(--gold2) 20%, var(--gold) 50%, #b27a00 80%, var(--saff) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.9)) drop-shadow(0 0 60px rgba(245, 197, 24, 0.3))",
    letterSpacing: "clamp(-1px, -0.3vw, -4px)",
    margin: "10px 0"
  };

  const epicChakraStyle = {
    fontSize: "clamp(2.5rem, 8vw, 8rem)",
    WebkitTextFillColor: "var(--saff)",
    background: "none",
    filter: "drop-shadow(0 0 40px rgba(255, 109, 0, 0.8))",
    marginInline: "15px"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ flexGrow: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--ink)' }}
    >
      <section id="hero" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        
        {/* LAYER 1: Deep Ethereal Shadow Character */}
        <div style={{ position: 'absolute', inset: -50, zIndex: 1, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
           <motion.img 
             src="/hero_bg_arjuna.png" 
             initial={{ filter: 'blur(30px)', scale: 1.1 }}
             animate={{ filter: 'blur(4px)', scale: 1 }}
             transition={{ duration: 5, ease: "easeOut" }}
             style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', mixBlendMode: 'screen' }}
             alt="Mythological Aura" 
           />
           {/* Dark edge vignette so the character fades smoothly */}
           <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 15%, var(--ink) 85%)' }}></div>
        </div>

        {/* LAYER 2: Slow Burning Embers */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
          {embers.map((emb, i) => (
            <motion.div 
              key={i}
              initial={{ y: '105vh', opacity: 0, x: 0 }}
              animate={{ 
                y: '-10vh', 
                opacity: [0, 1, 0.8, 0], 
                x: emb.drift 
              }}
              transition={{ 
                duration: emb.duration, 
                delay: emb.delay, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{
                position: 'absolute',
                left: `${emb.left}%`,
                width: emb.size,
                height: emb.size,
                background: '#f5c518',
                borderRadius: '50%',
                filter: 'blur(1px) drop-shadow(0 0 10px #ff6d00)'
              }}
            />
          ))}
        </div>

        {/* LAYER 3: Cinematic Typography Focus */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          
          <motion.p 
            initial={{ opacity: 0, filter: 'blur(10px)' }} 
            animate={{ opacity: 1, filter: 'blur(0px)' }} 
            transition={{ duration: 1.5, delay: 0.5 }}
            className="hey"
            style={{ letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--muted)' }}
          >
            ✦ Intercollegiate IT Fest · Shree Devi College ✦
          </motion.p>
          
          {/* THE GIANT THEMATIC MOVIE POSTER TITLE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }} 
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ width: '100%', padding: '0 20px' }}
          >
            <h1 style={epicTitleStyle}>
              <span>DEVI</span>
              <motion.div 
                style={epicChakraStyle}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <i className="fa-solid fa-dharmachakra"></i>
              </motion.div>
              <span>MANTHAN</span>
            </h1>
          </motion.div>

          <motion.p 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             transition={{ duration: 1, delay: 1.5 }}
             className="hyr" 
             style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', margin: '0', letterSpacing: '12px' }}
          >
            2 &thinsp;0 &thinsp;2 &thinsp;6
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.5, delay: 2 }}
            style={{ marginTop: '20px' }}
          >
            <p className="htag" style={{ fontSize: '1.2rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              Churning Tradition into Technology
            </p>
          </motion.div>

          <motion.div 
            className="hbtns"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1.5, delay: 2.5 }}
            style={{ marginTop: '40px' }}
          >
            <MagneticButton>
              <Link to="/events" className="btn-fire" style={{ margin: '0 10px' }}>☸ &nbsp;Explore Events</Link>
            </MagneticButton>
            
            <MagneticButton>
              <button className="btn-ghost" onClick={handleBrochureClick} style={{ margin: '0 10px' }}>
                <i className="fa-solid fa-file-arrow-down"></i> Download Brochure
              </button>
            </MagneticButton>
          </motion.div>

        </div>

        {/* SCROLL INDICATOR */}
        <motion.div 
          className="scpill" 
          onClick={() => document.getElementById('events')?.scrollIntoView({behavior:'smooth'})}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 3.5 }}
        >
          <div className="sctrack">
            <div className="scball"></div>
          </div>
          <span className="sclbl">Scroll</span>
        </motion.div>
      </section>

      {/* QUICK PREVIEW MARQUEE */}
      <section style={{marginTop: '40px', position: 'relative', zIndex: 6}}>
        <div className="marquee-wrap" style={{background: 'var(--ink)'}}>
          <div className="marquee">
            <span className="mi">Netrutva</span><span className="md">◈</span>
            <span className="mi">Srijan</span><span className="md">◈</span>
            <span className="mi">Samadhan</span><span className="md">◈</span>
            <span className="mi">Drishti</span><span className="md">◈</span>
            <span className="mi">Anveshan</span><span className="md">◈</span>
            <span className="mi">Prastuti</span><span className="md">◈</span>
            <span className="mi">Spardha</span><span className="md">◈</span>
            <span className="mi">Navonmesh</span><span className="md">◈</span>
            <span className="mi">Medha</span><span className="md">◈</span>
            {/* DUPLICATE */}
            <span className="mi">Netrutva</span><span className="md">◈</span>
            <span className="mi">Srijan</span><span className="md">◈</span>
            <span className="mi">Samadhan</span><span className="md">◈</span>
            <span className="mi">Drishti</span><span className="md">◈</span>
            <span className="mi">Anveshan</span><span className="md">◈</span>
            <span className="mi">Prastuti</span><span className="md">◈</span>
            <span className="mi">Spardha</span><span className="md">◈</span>
            <span className="mi">Navonmesh</span><span className="md">◈</span>
            <span className="mi">Medha</span><span className="md">◈</span>
          </div>
        </div>
      </section>

      {/* CONTINUOUS SCROLL TO ABOUT */}
      <AboutPage />

    </motion.div>
  );
}
