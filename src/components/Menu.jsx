import { useEffect, useState } from "react";
import Noise from "./Noise";
import { useAudio } from "./AudioContext";

// Create a custom blue noise component by extending the original Noise component
const BlueNoise = (props) => {
  // Custom function to generate blue-tinted noise
  const generateBlueNoiseData = () => {
    const data = props.patternDataRef.current.data;
    const size = props.patternSize * props.patternSize * 4; // RGBA values
    const time = Date.now() * 0.001; // Use time for subtle movement

    for (let i = 0; i < size; i += 4) {
      // Add subtle movement based on position and time
      const x = Math.floor(i / 4) % props.patternSize;
      const y = Math.floor(i / 4 / props.patternSize);
      const movement = Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time) * 20;
      
      // Random value with blue tint and subtle movement
      const baseValue = Math.floor(Math.random() * 200 + movement);
      
      // RGBA values - increase blue channel for soft blue tint
      data[i] = baseValue * 0.7;     // R (reduced)
      data[i + 1] = baseValue * 0.8;  // G (reduced)
      data[i + 2] = Math.min(255, baseValue * 1.3); // B (enhanced)
      data[i + 3] = props.patternAlpha; // Alpha (transparency)
    }
  };

  // Override the generateNoiseData function
  return <Noise {...props} generateNoiseData={generateBlueNoiseData} />;
};

// Create a wrapper component that ensures immediate rendering
const ImmediateBlueNoise = (props) => {
  // Force immediate render by setting a very small initial refresh interval
  return <BlueNoise 
    {...props} 
    patternRefreshInterval={0.001} // Start almost instantly
    key={Date.now()} // Force new instance when menu opens
  />;
};

export const Menu = (props) => {
  const { onSectionChange, menuOpened, setMenuOpened, section } = props;
  const [isVisible, setIsVisible] = useState(false);
  const { isMuted, toggleMute } = useAudio();

  useEffect(() => {
    // Only show the menu button when in the Office section (section 0)
    if (section === 0) {
      // Add a 2-second delay before showing the menu button
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true); // Always visible in other sections
    }
  }, [section]);

  return (
    <>
      <button
        onClick={() => setMenuOpened(!menuOpened)}
        className={`z-20 fixed top-4 right-4 md:top-12 md:right-12 p-1.5 bg-transparent backdrop-blur-sm border border-white/20 w-8 h-8 md:w-8 md:h-8 rounded-full transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div
          className={`bg-white h-0.5 rounded-md w-full transition-all ${menuOpened ? "rotate-45 translate-y-0.5" : ""}`}
        />
        <div
          className={`bg-white h-0.5 rounded-md w-full my-0.5 ${menuOpened ? "hidden" : ""}`}
        />
        <div
          className={`bg-white h-0.5 rounded-md w-full transition-all ${menuOpened ? "-rotate-45" : ""}`}
        />
      </button>
      
      {/* Sound icon button */}
      <button
        onClick={toggleMute}
        className={`z-20 fixed top-4 right-14 md:top-12 md:right-24 p-1.5 bg-transparent backdrop-blur-sm border border-white/20 w-8 h-8 md:w-8 md:h-8 rounded-full transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        aria-label={!isMuted ? "Mute sound" : "Enable sound"}
      >
        {!isMuted ? (
          // Sound ON icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mx-auto" viewBox="0 0 20 20" fill="white">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
        ) : (
          // Sound OFF icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mx-auto" viewBox="0 0 20 20" fill="white">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      <div
        className={`z-10 fixed top-0 right-0 bottom-0 bg-black/20 backdrop-blur-md border-l border-white/10 transition-all overflow-hidden flex flex-col
      ${menuOpened ? "w-full md:w-80" : "w-0"}`}
      >
        {/* Add blue noise effect when menu is open */}
        {menuOpened && (
          <div className="absolute inset-0 overflow-hidden">
            <ImmediateBlueNoise 
              patternSize={50} 
              patternScaleX={1.5} 
              patternScaleY={1.5} 
              patternRefreshInterval={0.1} // Normal refresh rate after initial render
              patternAlpha={20}
              style={{
                mixBlendMode: 'soft-light',
              }} 
            />
          </div>
        )}
        <div className="flex-1 flex items-start justify-center flex-col gap-6 p-8 relative z-10">
          <MenuButton label="About" onClick={() => onSectionChange(0)} />
          <MenuButton label="Skills" onClick={() => onSectionChange(1)} />
          <MenuButton label="Projects" onClick={() => onSectionChange(2)} />
          <MenuButton label="Contact" onClick={() => onSectionChange(3)} />
        </div>
      </div>
    </>
  );
};

const MenuButton = (props) => {
  const { label, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="text-2xl font-bold cursor-pointer hover:text-indigo-600 transition-colors text-white font-dxfiggle"
    >
      {label}
    </button>
  );
};
