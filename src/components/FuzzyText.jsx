import React, { useEffect, useRef } from 'react';

const FuzzyText = ({ children, baseIntensity = 0.1, hoverIntensity = 0.3, enableHover = true }) => {
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const isHovering = useRef(false);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const text = textRef.current;
    const padding = 20;

    const resize = () => {
      canvas.width = text.offsetWidth + padding * 2;
      canvas.height = text.offsetHeight + padding * 2;
    };

    const draw = () => {
      if (!canvasRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = window.getComputedStyle(text).font;
      ctx.fillStyle = window.getComputedStyle(text).color;
      const intensity = isHovering.current ? hoverIntensity : baseIntensity;

      // Main text
      ctx.globalAlpha = 1.0;
      ctx.fillText(children, padding, padding + text.offsetHeight / 2);

      // Trail effect
      for (let i = 0; i < 3; i++) {
        const offsetX = (Math.random() - 0.5) * intensity * 15;
        const offsetY = (Math.random() - 0.5) * intensity * 15;
        ctx.globalAlpha = Math.random() * 0.2;
        ctx.fillText(children, padding + offsetX, padding + offsetY + text.offsetHeight / 2);
      }

      animationFrameId.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    const handleMouseEnter = () => { if (enableHover) isHovering.current = true; };
    const handleMouseLeave = () => { if (enableHover) isHovering.current = false; };

    if (text) {
        text.addEventListener('mouseenter', handleMouseEnter);
        text.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (text) {
        text.removeEventListener('mouseenter', handleMouseEnter);
        text.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [children, baseIntensity, hoverIntensity, enableHover]);

  return (
    <span ref={textRef} style={{ position: 'relative', display: 'inline-block' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: -20, left: -20, pointerEvents: 'none' }} />
      <span style={{ opacity: 1 }}>{children}</span>
    </span>
  );
};

export default FuzzyText;