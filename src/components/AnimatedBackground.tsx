import React, { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size properly
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    let animationId: number;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Create subtle flowing particles/orbs effect
      const particles = [];
      const particleCount = 8;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time * 0.1;
        const distance = 200 + Math.sin(time * 0.2 + i) * 100;
        const x = width / 2 + Math.cos(angle) * distance;
        const y = height / 2 + Math.sin(angle) * distance;
        
        particles.push({ x, y, index: i });
      }

      // Draw smooth flowing lines connecting particles
      ctx.strokeStyle = 'rgba(255, 200, 80, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(particles[0].x, particles[0].y);
      for (let i = 1; i < particles.length; i++) {
        ctx.lineTo(particles[i].x, particles[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      // Draw soft glowing circles at each particle point
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const glow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, 80);
        glow.addColorStop(0, 'rgba(255, 200, 80, 0.12)');
        glow.addColorStop(0.5, 'rgba(255, 180, 60, 0.04)');
        glow.addColorStop(1, 'rgba(255, 160, 40, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw slow-moving background waves
      ctx.strokeStyle = 'rgba(200, 160, 80, 0.06)';
      ctx.lineWidth = 1;
      
      for (let waveIndex = 0; waveIndex < 3; waveIndex++) {
        ctx.beginPath();
        const waveHeight = 30 + waveIndex * 20;
        const waveSpeed = 0.05 + waveIndex * 0.02;
        const baseY = height * (0.25 + waveIndex * 0.25);
        
        for (let x = 0; x < width; x += 5) {
          const y = baseY + Math.sin((x * 0.005) + time * waveSpeed) * waveHeight;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw subtle radial gradient from center
      const centerGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.sqrt(width * width + height * height) / 2);
      centerGradient.addColorStop(0, 'rgba(255, 200, 80, 0.03)');
      centerGradient.addColorStop(1, 'rgba(255, 200, 80, 0)');
      ctx.fillStyle = centerGradient;
      ctx.fillRect(0, 0, width, height);

      time += 0.01;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="animated-background-canvas"
    />
  );
};

export default AnimatedBackground;
