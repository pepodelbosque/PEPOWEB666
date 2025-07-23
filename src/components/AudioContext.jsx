import { createContext, useContext, useState, useEffect, useRef } from 'react';
import musicFile from '../assets/music.wav';

// Create a context for audio state
const AudioContext = createContext();

// Custom hook to use the audio context
export const useAudio = () => useContext(AudioContext);

// Provider component
export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted (off mode)
  const audioRef = useRef(null);
  const hasStartedRef = useRef(false); // Track if audio has been started
  
  useEffect(() => {
    // Create audio element - Use imported music file
    audioRef.current = new Audio(musicFile);
    audioRef.current.loop = true; // This ensures eternal looping
    audioRef.current.volume = 0; // Start with volume at 0
    audioRef.current.muted = true; // Start muted
    
    // Load the audio but don't play it yet
    audioRef.current.load();
    
    // Add metadata loaded event listener
    audioRef.current.addEventListener('loadedmetadata', () => {
      console.log("Audio metadata loaded successfully");
      // Set current time to the middle of the song
      audioRef.current.currentTime = audioRef.current.duration / 2;
      // Remove auto-start - audio will only start on user interaction
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
    if (!audioRef.current) return;
    
    // Unmute and start playing audio with proper error handling
    audioRef.current.muted = false;
    setIsMuted(false);
    
    audioRef.current.play()
      .then(() => {
        console.log("Audio started successfully");
        hasStartedRef.current = true;
        setIsPlaying(true);
        
        // Implement fade-in effect with mobile detection
        let volume = 0;
        // Detect if device is mobile
        const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        // Set volume levels for different devices - mobile reduced by 50%
        const targetVolume = isMobile ? 0.075 : 0.05; // 7.5% for mobile (50% reduction), 5% for desktop
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
    
    // If audio hasn't started yet, start it
    if (!hasStartedRef.current) {
      startAudioWithFadeIn();
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Toggle mute - now also starts audio if not started
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
  
  // Function to start audio (for button triggers)
  const startAudio = () => {
    if (!hasStartedRef.current) {
      startAudioWithFadeIn();
    } else if (!isPlaying) {
      togglePlay();
    }
  };
  
  return (
    <AudioContext.Provider value={{ 
      isPlaying, 
      isMuted, 
      togglePlay, 
      toggleMute, 
      startAudio,
      audioRef 
    }}>
      {children}
    </AudioContext.Provider>
  );
};