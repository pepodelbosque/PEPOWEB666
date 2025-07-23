import { useEffect, useState, useRef } from 'react';

const ImageTrail = ({ items, variant = 1 }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [images, setImages] = useState([]);
  const imageIdCounter = useRef(0);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const trailLength = 10; // Number of images in the trail
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Animation loop for image trail
  useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        // Add new image to the trail
        if (images.length < trailLength) {
          const newImage = {
            id: imageIdCounter.current++,
            x: cursorPosition.x,
            y: cursorPosition.y,
            src: items[Math.floor(Math.random() * items.length)],
            rotation: Math.random() * 40 - 20, // Random rotation between -20 and 20 degrees
            scale: 0.5 + Math.random() * 0.5, // Random scale between 0.5 and 1
            opacity: 0.8
          };
          
          setImages(prev => [...prev, newImage]);
        } else {
          // Update existing images (fade out and move slightly)
          setImages(prev => {
            const updated = prev.map((img, index) => {
              // Older images fade out and drift
              const age = index / prev.length;
              return {
                ...img,
                opacity: img.opacity - 0.01,
                x: img.x + (Math.random() * 2 - 1) * variant,
                y: img.y + (Math.random() * 2 - 1) * variant
              };
            });
            
            // Remove fully faded images and add new one at cursor position
            const filtered = updated.filter(img => img.opacity > 0);
            if (filtered.length < trailLength) {
              filtered.push({
                id: imageIdCounter.current++,
                x: cursorPosition.x,
                y: cursorPosition.y,
                src: items[Math.floor(Math.random() * items.length)],
                rotation: Math.random() * 40 - 20,
                scale: 0.5 + Math.random() * 0.5,
                opacity: 0.8
              });
            }
            
            return filtered;
          });
        }
      }
      
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [cursorPosition, images, items, variant]);
  
  return (
    <div className="image-trail-container">
      {images.map((image) => (
        <img
          key={image.id}
          src={image.src}
          alt=""
          className="absolute pointer-events-none rounded-md shadow-md"
          style={{
            left: image.x,
            top: image.y,
            transform: `translate(-50%, -50%) rotate(${image.rotation}deg) scale(${image.scale})`,
            opacity: image.opacity,
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            transition: 'opacity 0.5s ease',
            zIndex: 9999 // Increased z-index to be higher than SplashCursor
          }}
        />
      ))}
    </div>
  );
};

export default ImageTrail;