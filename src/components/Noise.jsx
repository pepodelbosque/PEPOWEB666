import React, { useEffect, useRef } from 'react';

const Noise = ({
  patternSize = 100,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 4,
  patternAlpha = 30,
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const patternDataRef = useRef(null);
  const requestRef = useRef(null);
  const previousTimeRef = useRef(0);

  // Initialize canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas to full size of container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Get context and save it in ref
    const context = canvas.getContext('2d');
    contextRef.current = context;

    // Create initial pattern data
    patternDataRef.current = context.createImageData(patternSize, patternSize);
    generateNoiseData();

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = (time) => {
      requestRef.current = requestAnimationFrame(animate);

      // Only update at specified interval
      if (time - previousTimeRef.current >= patternRefreshInterval * 1000) {
        generateNoiseData();
        drawNoise();
        previousTimeRef.current = time;
      }
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [patternRefreshInterval]);

  // Generate random noise data
  const generateNoiseData = () => {
    const data = patternDataRef.current.data;
    const size = patternSize * patternSize * 4; // RGBA values

    for (let i = 0; i < size; i += 4) {
      // Random grayscale value
      const value = Math.floor(Math.random() * 256);
      
      // RGBA values
      data[i] = value;     // R
      data[i + 1] = value; // G
      data[i + 2] = value; // B
      data[i + 3] = patternAlpha; // Alpha (transparency)
    }
  };

  // Draw the noise pattern
  const drawNoise = () => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Create pattern from noise data
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const patternContext = patternCanvas.getContext('2d');
    patternContext.putImageData(patternDataRef.current, 0, 0);

    // Scale pattern
    context.save();
    context.scale(patternScaleX, patternScaleY);

    // Create and apply pattern
    const pattern = context.createPattern(patternCanvas, 'repeat');
    context.fillStyle = pattern;
    context.fillRect(
      0,
      0,
      canvas.width / patternScaleX,
      canvas.height / patternScaleY
    );

    context.restore();
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }}
    />
  );
};

export default Noise;