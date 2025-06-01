// components/FlyingStars.jsx
import React, { useEffect, useRef } from 'react';

export default function FlyingStars() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const stars = [];
    const numStars = 50;

    // Генерация звезд
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.width = '2px';
      star.style.height = '2px';
      star.style.backgroundColor = 'white';
      star.style.borderRadius = '50%';
      star.style.opacity = Math.random() * 0.8 + 0.2;
      star.style.top = Math.random() * 100 + '%';
      star.style.left = Math.random() * 100 + '%';
      star.style.animation = `flyStar ${5 + Math.random() * 10}s linear infinite`;
      star.style.animationDelay = `${Math.random() * 10}s`;
      container.appendChild(star);
      stars.push(star);
    }

    return () => {
      stars.forEach(star => container.removeChild(star));
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes flyStar {
          from {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          to {
            transform: translateX(1000px) translateY(1000px);
            opacity: 0;
          }
        }
      `}</style>
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }}
      />
    </>
  );
}
