import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import TouchFeedback from './ui/TouchFeedback';
import ScrollProgress from './ui/ScrollProgress';

export default function GlobalLayout({ children }) {
  const canvasRef = useRef(null);
  const curRingRef = useRef(null);
  const curDotRef = useRef(null);
  const loaderRef = useRef(null);
  const navRef = useRef(null);
  const location = useLocation();

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {stiffness: 100, damping: 30});
  const bowY = useTransform(smoothProgress, [0, 1], [0, -150]);
  const gadaY = useTransform(smoothProgress, [0, 1], [0, 200]);
  const chakraY = useTransform(smoothProgress, [0, 1], [0, -80]);

  const [mobOpen, setMobOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // LOADER
    const loaderTimer = setTimeout(() => {
      if (loaderRef.current) loaderRef.current.classList.add('out');
    }, 2200);

    // CURSOR & HOVER (Only on Desktop)
    let mx = 0, my = 0, rx = 0, ry = 0;
    let cursorRaf;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (curDotRef.current) {
        curDotRef.current.style.left = mx + 'px';
        curDotRef.current.style.top = my + 'px';
      }
      
      const target = e.target;
      if (target.closest('a, button, .ec, .cc, .bro-card, .btn-fire, .btn-ghost')) {
        document.body.classList.add('hovering');
      } else {
        document.body.classList.remove('hovering');
      }
    };

    const loopCursor = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      if (curRingRef.current) {
        curRingRef.current.style.left = rx + 'px';
        curRingRef.current.style.top = ry + 'px';
      }
      cursorRaf = requestAnimationFrame(loopCursor);
    };

    if (isDesktop) {
      document.addEventListener('mousemove', handleMouseMove);
      cursorRaf = requestAnimationFrame(loopCursor);
    }

    // NAVBAR SCROLL
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 55) {
          navRef.current.classList.add('stuck');
        } else {
          navRef.current.classList.remove('stuck');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for Scroll Spy
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -75% 0px', // Slightly larger focal zone (10% height)
      threshold: [0, 0.1, 0.5]
    };

    const handleIntersect = (entries) => {
      // Force hero at the very top
      if (window.scrollY < 80) {
        setActiveSection('hero');
        return;
      }

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // RETRY OBSERVER: Scans for sections repeatedly to handle delayed mounts from page transitions
    let attempts = 0;
    const obsInterval = setInterval(() => {
      attempts++;
      const sections = ['hero', 'about'];
      let foundCount = 0;
      
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          observer.observe(el);
          foundCount++;
        }
      });

      // If all targets found or too many attempts (2.5s), stop retrying
      if (foundCount === sections.length || attempts > 25) {
        clearInterval(obsInterval);
      }
    }, 100);

    // KEYBOARD ESC
    const handleKey = (e) => { if (e.key === 'Escape') setMobOpen(false); };
    document.addEventListener('keydown', handleKey);

    // Reset scroll to top on route change
    window.scrollTo(0, 0);

    return () => {
      clearTimeout(loaderTimer);
      clearInterval(obsInterval);
      if (isDesktop) {
        document.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(cursorRaf);
      }
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKey);
      document.body.classList.remove('hovering');
      observer.disconnect();
    };
  }, [location.pathname, isDesktop]); // Re-observe when path changes or device modes swap

  // VFX CANVAS (Init Once)
  useEffect(() => {
    let c = canvasRef.current;
    if (!c || window.innerWidth < 768) return;
    let ctx = c?.getContext('2d');
    let W, H;
    let canvasRaf;
    let mpx = 0, mpy = 0;
    let handleCanvasMouseMove;

    if (c && ctx) {
      const resizeHandler = () => {
        W = c.width = window.innerWidth;
        H = c.height = window.innerHeight;
      };
      resizeHandler();
      window.addEventListener('resize', resizeHandler);
      
      // Store reference to cleanly remove listener
      window.__canvasResizeHandler = resizeHandler;

      const r = (a, b) => Math.random() * (b - a) + a;
      const SYMS = ['☸', '✦', '◈', '⊕', '⟡', '△', '⬟', '✧'];

      class Arrow {
        constructor() { this.init(); }
        init() {
          this.x = r(0, W); this.y = r(-500, 0); this.l = r(20, 50); this.v = r(15, 25); this.o = r(0.1, 0.4);
        }
        tick() {
          this.y += this.v; if (this.y > H) this.init();
        }
        draw() {
          if(!ctx) return;
          ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x, this.y + this.l);
          ctx.strokeStyle = `rgba(245,197,24,${this.o})`; ctx.lineWidth = 1; ctx.stroke();
          ctx.beginPath(); ctx.moveTo(this.x - 2, this.y + this.l - 5); ctx.lineTo(this.x, this.y + this.l); ctx.lineTo(this.x + 2, this.y + this.l - 5); ctx.stroke();
        }
      }
      class Star { constructor() { this.init(true); } init(i = false) { this.x = r(0, W); this.y = i ? r(0, H) : H + 8; this.rad = r(0.3, 1.4); this.a = r(0.02, 0.16); this.sp = r(0.08, 0.32); this.dr = r(-0.14, 0.14); } tick() { this.y -= this.sp; this.x += this.dr; if (this.y < -8) this.init(); } draw() { if(!ctx) return; ctx.beginPath(); ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2); ctx.fillStyle = `rgba(245,197,24,${this.a})`; ctx.fill(); } }
      class Sym { constructor() { this.init(true); } init(i = false) { this.x = r(0, W); this.y = i ? r(0, H) : H + 28; this.ch = SYMS[Math.floor(Math.random() * SYMS.length)]; this.sz = r(8, 18); this.a = r(0.012, 0.058); this.sp = r(0.09, 0.42); this.rot = r(0, Math.PI * 2); this.rs = r(-0.005, 0.005); } tick() { this.y -= this.sp; this.rot += this.rs; if (this.y < -28) this.init(); } draw() { if(!ctx) return; ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rot); ctx.globalAlpha = this.a; ctx.fillStyle = '#F5C518'; ctx.font = this.sz + 'px serif'; ctx.fillText(this.ch, -this.sz / 2, this.sz / 2); ctx.restore(); } }
      class Dot { constructor() { this.x = r(0, W); this.y = r(0, H); this.vx = r(-0.18, 0.18); this.vy = r(-0.12, 0.12); this.rad = r(0.6, 1.8); this.a = r(0.04, 0.13); } tick() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > W) this.vx *= -1; if (this.y < 0 || this.y > H) this.vy *= -1; } draw() { if(!ctx) return; ctx.beginPath(); ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2); ctx.fillStyle = `rgba(245,197,24,${this.a})`; ctx.fill(); } }

      const isMobileCanvas = window.innerWidth < 768;
      const stars = Array.from({ length: isMobileCanvas ? 60 : 175 }, () => new Star());
      const syms = Array.from({ length: isMobileCanvas ? 20 : 50 }, () => new Sym());
      const dots = Array.from({ length: isMobileCanvas ? 30 : 85 }, () => new Dot());
      const arrows = Array.from({ length: isMobileCanvas ? 10 : 30 }, () => new Arrow());

      handleCanvasMouseMove = (e) => { mpx = e.clientX / W - 0.5; mpy = e.clientY / H - 0.5; };
      document.addEventListener('mousemove', handleCanvasMouseMove);

      const frame = () => {
        if(!ctx) return;
        ctx.clearRect(0, 0, W, H);
        const g = ctx.createRadialGradient(W / 2 + mpx * 40, H / 2 + mpy * 40, 0, W / 2, H / 2, Math.max(W, H) * 0.8);
        g.addColorStop(0, 'rgba(255,109,0,.022)'); g.addColorStop(0.4, 'rgba(245,197,24,.008)'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        arrows.forEach((a) => { a.tick(); a.draw(); });
        stars.forEach((s) => { s.tick(); s.draw(); });
        dots.forEach((d) => { d.tick(); d.draw(); });
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y, dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 108) {
              ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y);
              ctx.strokeStyle = `rgba(245,197,24,${0.028 * (1 - dist / 108)})`; ctx.lineWidth = 0.5; ctx.stroke();
            }
          }
        }
        syms.forEach((s) => { s.tick(); s.draw(); });
        canvasRaf = requestAnimationFrame(frame);
      };
      frame();
    }
    return () => {
      if (canvasRaf) cancelAnimationFrame(canvasRaf);
      if (handleCanvasMouseMove) document.removeEventListener('mousemove', handleCanvasMouseMove);
      if (window.__canvasResizeHandler) {
        window.removeEventListener('resize', window.__canvasResizeHandler);
      }
    };
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

  const closeMob = () => setMobOpen(false);

  // Helper to determine active link
  const isActive = (path) => {
    const sectionMapping = {
      '/': 'hero',
      '/about': 'about'
    };
    
    // On homepage, prioritize scroll-tracked sections
    if (location.pathname === '/') {
      // If this path is one we track by scroll
      if (sectionMapping[path]) {
        return activeSection === sectionMapping[path] ? 'active' : '';
      }
    }
    
    // Otherwise, or as fallback, use strict pathname match
    return location.pathname === path ? 'active' : '';
  };


  // Smooth scroll handler
  const handleNavClick = (e, targetId, path) => {
    const el = document.getElementById(targetId);
    if (el && location.pathname === '/') {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
      closeMob();
    } else if (el && path === location.pathname) {
       // On non-home pages if the section exists (e.g. /events page has #events)
       e.preventDefault();
       el.scrollIntoView({ behavior: 'smooth' });
       closeMob();
    }
  };

  return (
    <>
      {/* MOBILE ENHANCEMENTS */}
      {!isDesktop && <TouchFeedback />}
      {!isDesktop && <ScrollProgress />}

      {/* CURSOR */}
      <div id="cur-ring" ref={curRingRef}></div>
      <div id="cur-dot" ref={curDotRef}></div>

      {/* LOADER */}
      <div id="loader" ref={loaderRef}>
        <div className="lrw">
          <div className="lr"></div>
          <div className="lr"></div>
          <div className="lr"></div>
          <div className="lc">☸</div>
        </div>
        <p className="lt">Devi · Manthan</p>
        <div className="lb">
          <div className="lf"></div>
        </div>
      </div>

      {/* CANVAS / FX */}
      <canvas id="bg-canvas" ref={canvasRef}></canvas>

      {/* CELESTIAL ATMOSPHERE: SPARKS */}
      <div className="celestial-overlay">
        {[...Array(isDesktop ? 20 : 8)].map((_, i) => (
          <motion.div
            key={i}
            className="spark"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '110vh', 
              opacity: Math.random() * 0.5 + 0.2,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: '-10vh', 
              x: (Math.random() * 100 - 50) + 'px' 
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 20
            }}
          />
        ))}
      </div>

      {/* FLOATING WEAPONS WITH PARALLAX */}
      {isDesktop && (
        <>
          <motion.div className="f-elem f-bow" style={{ y: bowY }}>
            <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 50C20 50 60 10 100 10C140 10 180 50 180 50" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
              <path d="M20 50C20 50 60 90 100 90C140 90 180 50 180 50" stroke="var(--gold)" strokeWidth="4" strokeLinecap="round" />
              <line x1="20" y1="50" x2="180" y2="50" stroke="var(--gold)" strokeWidth="0.5" opacity="0.5" />
            </svg>
          </motion.div>
          <motion.div className="f-elem f-gada" style={{ y: gadaY }}>
            <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke="var(--gold)" strokeWidth="3" />
              <rect x="45" y="90" width="10" height="100" rx="5" fill="var(--gold)" opacity="0.6" />
              <path d="M30 30L70 70M70 30L30 70" stroke="var(--gold)" strokeWidth="2" />
            </svg>
          </motion.div>
          <motion.div className="f-elem f-chakra" style={{ y: chakraY }}>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="var(--gold)" strokeWidth="1" strokeDasharray="5 5" />
              <circle cx="50" cy="50" r="30" stroke="var(--gold)" strokeWidth="2" />
              <path d="M50 5V20M50 80V95M5 50H20M80 50H95" stroke="var(--saff)" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.div>
        </>
      )}

      {/* MAYUR PANKH (PEACOCK FEATHER) */}
      {isDesktop && (
        <motion.div 
          className="f-elem f-feather"
          animate={{ 
            rotate: [0, 5, -5, 0],
            x: [0, 20, -10, 0],
            y: [0, -15, 10, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 180 Q45 140 50 100 Q55 60 50 20" stroke="var(--gold)" strokeWidth="1.5" opacity="0.4" />
            <ellipse cx="50" cy="50" rx="25" ry="40" stroke="var(--saff)" strokeWidth="1.5" opacity="0.3" />
            <path d="M50 30 C35 30 30 50 50 75 C70 50 65 30 50 30" fill="var(--gold)" opacity="0.1" />
          </svg>
        </motion.div>
      )}

      {/* GHOSTLY SCROLLING SHLOKAS */}
      {isDesktop && (
        <div className="shloka-ghost-v">
          <div className="shloka-track">
             <span>॥ कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ॥</span>
             <span>◈</span>
             <span>॥ धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ॥</span>
             <span>◈</span>
             <span>॥ यतो धर्मस्ततो जयः ॥</span>
             <span>◈</span>
          </div>
        </div>
      )}

      <div className="noise"></div>
      <div className="vignette"></div>
      <div className="glow-line"></div>
      <div className="glow-line"></div>

      {/* MOBILE NAV */}
      <div className={`mob ${mobOpen ? 'open' : ''}`}>
        <button className="mob-x" onClick={closeMob} aria-label="Close">✕</button>
        <Link to="/" onClick={(e) => { handleNavClick(e, 'hero', '/'); closeMob(); }}><i className="fa fa-house" style={{fontSize:'.8em', marginRight:'8px'}}></i>Home</Link>
        <Link to="/events" onClick={closeMob}><i className="fa fa-scroll" style={{fontSize:'.8em', marginRight:'8px'}}></i>Events</Link>
        <Link to="/about" onClick={(e) => { handleNavClick(e, 'about', '/about'); closeMob(); }}><i className="fa fa-circle-info" style={{fontSize:'.8em', marginRight:'8px'}}></i>About</Link>
        <Link to="/register" onClick={(e) => { handleNavClick(e, 'register', '/register'); closeMob(); }} style={{color:'var(--gold)'}}><i className="fa fa-bolt" style={{fontSize:'.8em', marginRight:'8px'}}></i>Register</Link>
      </div>

      {/* ════════════ NAVBAR ════════════ */}
      <nav id="nav" ref={navRef}>
        <Link to="/" className="nbrand" onClick={(e) => handleNavClick(e, 'hero', '/')}>
          <img src="/main logo/logo.png" alt="Devi Manthan Logo" className="nlogo" />
          <div>
            <div className="nbrand-t">DEVI MANTHAN</div>
            <div className="nbrand-s">2026 · IT FEST</div>
          </div>
        </Link>

        <ul className="nmenu">
          <li><Link to="/" className={isActive('/')} onClick={(e) => handleNavClick(e, 'hero', '/')}>Home</Link></li>
          <li><Link to="/events" className={isActive('/events')}>Events</Link></li>
          <li><Link to="/about" className={isActive('/about')} onClick={(e) => handleNavClick(e, 'about', '/about')}>About</Link></li>
          <li><Link to="/register" className={`nreg ${isActive('/register')}`} onClick={(e) => handleNavClick(e, 'register', '/register')}>Register</Link></li>
        </ul>

        <button className={`ham ${mobOpen ? 'open' : ''}`} onClick={() => setMobOpen(!mobOpen)} aria-label="Menu"><span></span><span></span><span></span></button>
      </nav>

      {/* MAIN CONTENT WRAPPER */}
      <main style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      {/* ════════════ FOOTER ════════════ */}
      <footer>
        <div className="ft-top">
          <div>
            <div className="fb-logo"><i className="fa-solid fa-dharmachakra"></i> DEVI MANTHAN 2026</div>
            <p className="fb-p">The Intercollegiate IT Fest of Shree Devi College of Information Science, Mangaluru. Tradition Rewired. Innovation Unleashed.</p>
            <div className="ft-soc">
              <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="mailto:" aria-label="Email"><i className="fa-solid fa-envelope"></i></a>
              <a href="#" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>
          <div className="ft-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/"><i className="fa-solid fa-house"></i>Home</Link></li>
              <li><Link to="/events"><i className="fa-solid fa-scroll"></i>Events</Link></li>
              <li><Link to="/about"><i className="fa-solid fa-circle-info"></i>About</Link></li>
              <li><Link to="/register"><i className="fa-solid fa-bolt"></i>Register</Link></li>
              <li><a href="#" onClick={handleBrochureClick}><i className="fa-solid fa-file-pdf"></i>Brochure</a></li>
            </ul>
          </div>
          <div className="ft-col">
            <h4>Location</h4>
            <p className="addr">
              <i className="fa-solid fa-location-dot"></i>Shree Devi College of<br/>Information Science<br/>
              <span style={{marginLeft:'20px', display:'block'}}>Ballalbagh, Mangaluru</span>
              <span style={{marginLeft:'20px', display:'block'}}>Karnataka — 575 003</span>
            </p>
            <p className="addr" style={{marginTop:'12px'}}>
              <i className="fa-solid fa-map"></i><a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{color:'var(--saff)', textDecoration:'none'}}>Get Directions →</a>
            </p>
          </div>
          <div className="ft-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i>@devimanthan2026</a></li>
              <li><a href="mailto:devimanthan@sdcis.ac.in"><i className="fa-solid fa-envelope"></i>devimanthan@sdcis.ac.in</a></li>
              <li><a href="tel:+91XXXXXXXXXX"><i className="fa-solid fa-phone"></i>+91 XXXXX XXXXX</a></li>
            </ul>
          </div>
        </div>
        <div className="ft-bot">
          <div className="ft-copy">© 2026 DeviManthan · All Rights Reserved</div>
          <div className="ft-by">Designed &amp; Developed by <a href="#">LockedIN404</a></div>
        </div>
      </footer>
    </>
  );
}
