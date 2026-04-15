import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    // REVEAL ON SCROLL
    const revObs = new IntersectionObserver((ents) => {
      ents.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('v'), i * 60);
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    const revealEls = containerRef.current?.querySelectorAll('.r');
    revealEls?.forEach((el) => revObs.observe(el));

    // STAT COUNTERS
    const cntObs = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target;
          const tgt = +el.dataset.target;
          const dur = 1600, start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.round(ease * tgt);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = tgt;
          };
          requestAnimationFrame(step);
          cntObs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    const countEls = containerRef.current?.querySelectorAll('[data-target]');
    countEls?.forEach((c) => cntObs.observe(c));

    return () => {
      if (revealEls) revealEls.forEach(el => revObs.unobserve(el));
      if (countEls) countEls.forEach(c => cntObs.unobserve(c));
    };
  }, []);

  return (
    <motion.div
      id="about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ flexGrow: 1 }}
      ref={containerRef}
    >
      <div className="diagonal-texture" />
      <div style={{ height: '110px' }}></div> {/* Spacer for fixed nav */}

      {/* ════════════ ABOUT ════════════ */}
      <section className="s-pad pt-10">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="s-head s-center r">
            <p className="s-eye">The Epic Unfolds</p>
            <h2 className="s-title">Where Code Meets Kurukshetra</h2>
            <p className="s-desc">In the age of the Mahabharata, warriors were forged not by birth — but by skill, strategy, and will. Devi-Manthan 2026 channels that same spirit into the modern battlefield of technology.</p>
          </div>
          <div className="about-grid grid-2 r">
            <div style={{ background: 'var(--cb)', border: '1px solid var(--cbl)', borderRadius: '12px', padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,var(--saff),var(--gold),transparent)' }}></div>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏹</div>
              <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.1rem', color: '#fff', marginBottom: '10px' }}>The Kurukshetra of Code</h3>
              <p style={{ fontSize: '.9rem', color: 'var(--muted)', lineHeight: 1.8 }}>Where coders are the Arjunas, ideas are the Brahmaastras, and innovation is the ultimate Dharma. Nine trials await the worthy.</p>
            </div>
            <div style={{ background: 'var(--cb)', border: '1px solid var(--cbl)', borderRadius: '12px', padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,var(--saff),var(--gold),transparent)' }}></div>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏛️</div>
              <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.1rem', color: '#fff', marginBottom: '10px' }}>Shree Devi College</h3>
              <p style={{ fontSize: '.9rem', color: 'var(--muted)', lineHeight: 1.8 }}>A bastion of excellence in Information Science, forging the architects of tomorrow's digital age with innovation-driven education.</p>
            </div>
          </div>
          <div className="grid-4 r rd2" style={{ border: '1px solid var(--cbl)', borderRadius: '10px', overflow: 'hidden', marginTop: '20px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ padding: '22px 12px', textAlign: 'center', background: 'var(--cb)', borderRight: '1px solid var(--cbl)' }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg,var(--gold),var(--saff))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} data-target="9">0</div>
              <div style={{ fontSize: '.72rem', letterSpacing: '2px', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '4px' }}>Events</div>
            </div>
            <div style={{ padding: '22px 12px', textAlign: 'center', background: 'var(--cb)', borderRight: '1px solid var(--cbl)' }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg,var(--gold),var(--saff))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} data-target="500">0</div>
              <div style={{ fontSize: '.72rem', letterSpacing: '2px', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '4px' }}>Warriors</div>
            </div>
            <div style={{ padding: '22px 12px', textAlign: 'center', background: 'var(--cb)', borderRight: '1px solid var(--cbl)' }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg,var(--gold),var(--saff))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} data-target="2">0</div>
              <div style={{ fontSize: '.72rem', letterSpacing: '2px', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '4px' }}>Epic Days</div>
            </div>
            <div style={{ padding: '22px 12px', textAlign: 'center', background: 'var(--cb)' }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg,var(--gold),var(--saff))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>∞</div>
              <div style={{ fontSize: '.72rem', letterSpacing: '2px', color: 'var(--muted)', textTransform: 'uppercase', marginTop: '4px' }}>Glory</div>
            </div>
          </div>
        </div>
      </section>

      <div className="sdiv"></div>

      {/* ════════════ STAFF COORDINATORS ════════════ */}
      <section className="s-pad">
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          <div className="s-head s-center r">
            <p className="s-eye">⚔ The Faculty Council</p>
            <h2 className="s-title">Staff Coordinators</h2>
            <p className="s-desc">The faculty vanguard guiding the Digital Kurukshetra.</p>
          </div>
          <div className="coord-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', maxWidth: '640px', margin: '0 auto', gap: '32px' }}>
            <div className="cc r rd1">
              <div className="cav-photo">
                <img src="/staff/divya.png" alt="Dr Divya Naveen" className="cav-img" />
              </div>
              <div className="cname">Dr Divya Naveen</div>
              <div className="crole">Staff Coordinator</div>
              <div className="cdept">Dept. of Information Science<br />Shree Devi College</div>
            </div>
            <div className="cc r rd2">
              <div className="cav-photo">
                <img src="/staff/jeevanya.png" alt="Jeevanya L Poojary" className="cav-img" />
              </div>
              <div className="cname">Jeevanya L Poojary</div>
              <div className="crole">Staff Coordinator</div>
              <div className="cdept">Dept. of Information Science<br />Shree Devi College</div>
            </div>
          </div>
        </div>
      </section>

      <div className="sdiv"></div>

      {/* ════════════ STUDENT COORDINATORS ════════════ */}
      <section className="s-pad">
        <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
          <div className="s-head s-center r">
            <p className="s-eye">✦ The Student Warriors</p>
            <h2 className="s-title">Student Coordinators</h2>
            <p className="s-desc">The student leaders who drive every faction into battle.</p>
          </div>
          <div className="coord-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', maxWidth: '640px', margin: '0 auto', gap: '32px' }}>
            <div className="cc r rd1">
              <div className="cav-photo" style={{ background: 'linear-gradient(135deg, var(--gold3), var(--gold))' }}>
                <img src="/student/manya.png" alt="Manya M" className="cav-img" />
              </div>
              <div className="cname">Manya M</div>
              <div className="crole">Student Coordinator</div>
              <div className="cdept">Final Year · BCA<br />Shree Devi College</div>
            </div>
            <div className="cc r rd2">
              <div className="cav-photo" style={{ background: 'linear-gradient(135deg, var(--gold3), var(--gold))' }}>
                <img src="/student/prajwal.png" alt="Prajwal K" className="cav-img" />
              </div>
              <div className="cname">Prajwal K</div>
              <div className="crole">Student Coordinator</div>
              <div className="cdept">Final Year · BCA<br />Shree Devi College</div>
            </div>
          </div>
        </div>
      </section>

      <div className="sdiv" style={{ marginBottom: "40px" }}></div>
    </motion.div>
  );
}
