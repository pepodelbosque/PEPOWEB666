import { createContext, useContext, useState, useEffect, useRef } from 'react';
import musicFile from '../assets/music.wav'; // Add this import

// Create a context for audio state
const AudioContext = createContext();

// Custom hook to use the audio context
export const useAudio = () => useContext(AudioContext);

// Provider component
export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted
  const audioRef = useRef(null);
  const hasStartedRef = useRef(false); // Track if audio has been started
  const autoStartAttempted = useRef(false); // Track if we've attempted auto-start
  
  useEffect(() => {
    // Create audio element - Use imported music file
    audioRef.current = new Audio(musicFile);
    audioRef.current.loop = true; // This ensures eternal looping
    audioRef.current.volume = 0; // Start with volume at 0
    
    // Load the audio but don't play it yet
    audioRef.current.load();
    
    // Add metadata loaded event listener
    audioRef.current.addEventListener('loadedmetadata', () => {
      console.log("Audio metadata loaded successfully");
      // Set current time to the middle of the song
      audioRef.current.currentTime = audioRef.current.duration / 2;
      
      // Auto-start audio immediately after metadata loads
      if (!autoStartAttempted.current) {
        autoStartAttempted.current = true;
        startAudioWithFadeIn();
      }
    });
    
    // Add error listener
    audioRef.current.addEventListener('error', (e) => {
      console.error("Audio loading error:", e);
      alert("There was a problem loading the audio. Please refresh the page.");
    });

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Function to start audio with fade-in effect
  const startAudioWithFadeIn = () => {
    if (!audioRef.current || hasStartedRef.current) return;
    
    // Start playing audio with proper error handling
    audioRef.current.play()
      .then(() => {
        console.log("Audio started successfully");
        hasStartedRef.current = true;
        setIsPlaying(true);
        
        // Implement fade-in effect with half gain (0.05 instead of 0.1)
        let volume = 0;
        // This volume setting applies to ALL devices (desktop, mobile, tablet)
        const targetVolume = 0.05; // Target volume reduced to half (5%)
        const fadeInDuration = 6000; // Fade in over 6 seconds
        const fadeInStep = targetVolume / (fadeInDuration / 100);
        
        const fadeInInterval = setInterval(() => {
          if (volume < targetVolume) {
            volume = Math.min(volume + fadeInStep, targetVolume);
            if (audioRef.current) {
              audioRef.current.volume = volume;
            }
          } else {
            clearInterval(fadeInInterval);
          }
        }, 100);
      })
      .catch(e => {
        console.error("Audio playback failed:", e);
        console.log("Audio autoplay blocked by browser. User interaction required.");
        hasStartedRef.current = false;
      });
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    // If audio hasn't started yet, start it
    if (!hasStartedRef.current) {
      startAudioWithFadeIn();
      return;
    }
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    
    // If unmuting and not playing, start playing
    if (isMuted && !isPlaying) {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      setIsPlaying(true);
    }
  };
  
  // Play audio for a specific section - simplified
  const playForSection = (section) => {
    // Remove automatic audio start - only start if user explicitly requests it
    // if (!hasStartedRef.current) {
    //   startAudioWithFadeIn();
    // }
  };
  
  return (
    <AudioContext.Provider value={{ isPlaying, isMuted, togglePlay, toggleMute, playForSection }}>
      {children}
    </AudioContext.Provider>
  );
};