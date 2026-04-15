import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TouchFeedback() {
  const [elements, setElements] = useState([]);

  const addInteraction = useCallback((x, y, type = 'tap') => {
    const id = Math.random().toString(36).substr(2, 9);
    
    if (type === 'tap') {
      // Create ripple + spark explosion
      const particles = Array.from({ length: 8 }).map((_, i) => ({
        id: `${id}-p-${i}`,
        type: 'particle',
        x,
        y,
        angle: (i * 45) + (Math.random() * 20),
        dist: 40 + Math.random() * 60,
      }));

      const ripple = {
        id: `${id}-r`,
        type: 'ripple',
        x,
        y,
      };

      setElements((prev) => [...prev, ripple, ...particles]);
      
      setTimeout(() => {
        setElements((prev) => prev.filter((el) => !el.id.startsWith(id)));
      }, 1000);
    } else {
      // Trail/Move effect
      const trail = {
        id: `${id}-t`,
        type: 'trail',
        x,
        y,
      };
      setElements((prev) => [...prev, trail]);
      setTimeout(() => {
        setElements((prev) => prev.filter((el) => el.id !== trail.id));
      }, 600);
    }
  }, []);

  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      addInteraction(touch.clientX, touch.clientY, 'tap');
    };

    const handleTouchMove = (e) => {
      // Throttled trail
      if (Math.random() > 0.7) {
        const touch = e.touches[0];
        addInteraction(touch.clientX, touch.clientY, 'move');
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [addInteraction]);

  return (
    <div className="touch-feedback-container" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999, overflow: 'hidden' }}>
      <AnimatePresence>
        {elements.map((el) => {
          if (el.type === 'ripple') {
            return (
              <React.Fragment key={el.id}>
                {/* Main Expanding Wave */}
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    position: 'absolute',
                    left: el.x,
                    top: el.y,
                    width: 40,
                    height: 40,
                    marginLeft: -20,
                    marginTop: -20,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)',
                    filter: 'blur(2px)',
                    border: '1px solid var(--gold2)',
                  }}
                />
                {/* Inner Sharp Pulse */}
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    position: 'absolute',
                    left: el.x,
                    top: el.y,
                    width: 20,
                    height: 20,
                    marginLeft: -10,
                    marginTop: -10,
                    borderRadius: '50%',
                    background: 'var(--gold2)',
                    boxShadow: '0 0 15px var(--gold)',
                  }}
                />
              </React.Fragment>
            );
          }
          
          if (el.type === 'particle') {
            return (
              <motion.div
                key={el.id}
                initial={{ x: el.x, y: el.y, scale: 1, opacity: 1 }}
                animate={{ 
                  x: el.x + Math.cos(el.angle * Math.PI / 180) * el.dist,
                  y: el.y + Math.sin(el.angle * Math.PI / 180) * el.dist,
                  scale: 0,
                  opacity: 0
                }}
                transition={{ duration: 0.6, ease: "circOut" }}
                style={{
                  position: 'absolute',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: 'var(--saff)',
                  boxShadow: '0 0 8px var(--gold)',
                }}
              />
            );
          }

          if (el.type === 'trail') {
            return (
              <motion.div
                key={el.id}
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 0.2, opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  left: el.x,
                  top: el.y,
                  width: 12,
                  height: 12,
                  marginLeft: -6,
                  marginTop: -6,
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  filter: 'blur(3px)',
                }}
              />
            );
          }

          return null;
        })}
      </AnimatePresence>
    </div>
  );
}
