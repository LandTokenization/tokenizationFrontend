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

      // Grid parameters
      const gridSize = 50;
      const waveAmplitude = 35;
      const waveFrequency = 0.08;

      ctx.strokeStyle = 'rgba(0, 200, 220, 0.3)';
      ctx.lineWidth = 1.5;

      // Draw vertical wave lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        for (let y = 0; y < height; y += 2) {
          const wave = Math.sin((y * waveFrequency) + time) * waveAmplitude;
          const xOffset = x + wave;
          if (y === 0) {
            ctx.moveTo(xOffset, y);
          } else {
            ctx.lineTo(xOffset, y);
          }
        }
        ctx.stroke();
      }

      // Draw horizontal wave lines
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 2) {
          const wave = Math.sin((x * waveFrequency) + time) * waveAmplitude;
          const yOffset = y + wave;
          if (x === 0) {
            ctx.moveTo(x, yOffset);
          } else {
            ctx.lineTo(x, yOffset);
          }
        }
        ctx.stroke();
      }

      // Draw multiple glowing wave bands
      for (let i = 0; i < 3; i++) {
        const waveY = (height * (0.3 + i * 0.2)) + Math.sin(time * (0.3 + i * 0.1)) * 40;
        const gradient = ctx.createLinearGradient(0, waveY - 60, 0, waveY + 60);
        gradient.addColorStop(0, 'rgba(0, 200, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 200, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, waveY - 60, width, 120);
      }

      // Draw "Gelephu Mindfulness City Initiative" text repeatedly across background
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = 'rgba(180, 180, 0, 0.15)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      const text = 'Gelephu Mindfulness City Initiative';
      const textWidth = ctx.measureText(text).width;
      const spacing = textWidth + 100;

      // Draw text in multiple rows and columns
      for (let y = -100; y < height + 100; y += 120) {
        for (let x = -spacing; x < width + spacing; x += spacing) {
          const offsetY = y + Math.sin((x + time * 50) * 0.01) * 15;
          ctx.save();
          ctx.globalAlpha = 0.12 + Math.sin(time * 0.5 + x * 0.001) * 0.05;
          ctx.fillText(text, x, offsetY);
          ctx.restore();
        }
      }

      time += 0.015;
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
