import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

export default function ScrollArcher() {
  const { scrollYProgress } = useScroll();
  
  // Spring for smooth drawing motion
  const springProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // Map progress (0 to 0.95) to string tension and arrow pull-back
  // Base x position is 80 (where the string is flat)
  const stringX = useTransform(springProgress, [0, 0.95], [80, 20]);
  const arrowX = useTransform(springProgress, [0, 0.95], [0, -60]);

  // Determine if it should shoot
  const [shot, setShot] = useState(false);
  useEffect(() => {
    // We use a listener to trigger the shot state
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest >= 0.985) setShot(true);
      else if (latest < 0.95) setShot(false);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Use the x coordinate to build the quadratic Bezier path for the string
  const stringPath = useTransform(stringX, (x) => `M80 30 Q${x} 200 80 370`);

  return (
    <div className="scroll-archer-wrap">
      <svg viewBox="0 0 150 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
        
        {/* THE BOW FRAME - GANDIVA EFFECT */}
        <motion.path 
           d="M80 20 C10 20 10 380 80 380" 
           stroke="var(--gold)" 
           strokeWidth="5" 
           strokeLinecap="round" 
           style={{ filter: 'drop-shadow(0 0 12px var(--gold))' }}
        />
        
        {/* THE GLOWING BOW STRING */}
        <motion.path 
           d={stringPath}
           stroke="var(--gold2)" 
           strokeWidth="1.5" 
           opacity="0.8"
           style={{ filter: 'drop-shadow(0 0 5px var(--gold2))' }}
        />

        {/* THE ARROW (Logic: Visible while drawing, shooting away when bottom reached) */}
        <AnimatePresence>
          {!shot && (
            <motion.g style={{ x: arrowX }}>
               <line x1="80" y1="200" x2="160" y2="200" stroke="#fff" strokeWidth="2.5" />
               {/* Arrow head */}
               <path d="M160 200 L145 192 M160 200 L145 208" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
               {/* Arrow fletching */}
               <path d="M80 200 L95 188 M80 200 L95 212" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
            </motion.g>
          )}

          {shot && (
            <motion.g 
               initial={{ x: -60 }}
               animate={{ x: 1200 }}
               transition={{ duration: 0.4, ease: [0.1, 0, 0, 1] }}
            >
               <line x1="80" y1="200" x2="160" y2="200" stroke="var(--gold)" strokeWidth="3" />
               <path d="M160 200 L145 192 M160 200 L145 208" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
               {/* Impact/Motion Blur Streak */}
               <motion.line 
                 initial={{ opacity: 1, scaleX: 0 }}
                 animate={{ opacity: 0, scaleX: 3 }}
                 transition={{ duration: 0.6 }}
                 x1="0" y1="200" x2="80" y2="200" 
                 stroke="var(--gold)" strokeWidth="1" 
               />
            </motion.g>
          )}
        </AnimatePresence>

        {/* DECORATIVE ENERGY CORE */}
        <motion.circle 
          cx="20" cy="200" r="6" 
          fill="var(--saff)" 
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ filter: 'blur(3px)' }} 
        />
      </svg>
      
      <div className="scroll-tag font-orbitron">THE DHARMA DRIVE</div>
    </div>
  );
}
