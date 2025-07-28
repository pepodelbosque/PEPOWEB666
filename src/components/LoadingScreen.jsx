import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import Noise from "./Noise";

export const LoadingScreen = (props) => {
  const { started, setStarted } = props;
  const { progress, total, loaded, item } = useProgress();
  const [loadingText, setLoadingText] = useState("Loading...");
  const [smoothProgress, setSmoothProgress] = useState(0);

  // Smooth progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSmoothProgress(prev => {
        const diff = progress - prev;
        return prev + diff * 0.1; // Smooth interpolation
      });
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [progress]);

  // Dynamic loading text based on what's loading
  useEffect(() => {
    if (item) {
      if (item.includes('646d9dcdc8a5f5bddbfac913.glb')) {
        setLoadingText("Loading Avatar...");
      } else if (item.includes('Workstation.gltf')) {
        setLoadingText("Loading Office...");
      } else if (item.includes('.fbx')) {
        setLoadingText("Loading Animations...");
      } else if (item.includes('.wav')) {
        setLoadingText("Loading Audio...");
      } else {
        setLoadingText("Loading Assets...");
      }
    }
  }, [item]);

  useEffect(() => {
    if (progress === 100) {
      // Ensure all assets are fully loaded before starting
      setTimeout(() => {
        setStarted(true);
      }, 800); // Increased delay for smoother transition
    }
  }, [progress, setStarted]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-1000 pointer-events-none
      flex items-center justify-center overflow-hidden bg-black
      ${started ? "opacity-0" : "opacity-100"}`}
    >
      {/* Grainy noise overlay */}
      <Noise 
        patternSize={100}
        patternScaleX={2}
        patternScaleY={2}
        patternRefreshInterval={0.1}
        patternAlpha={40}
      />
      
      <div className="text-center scale-50 relative z-10">
        {/* Simple progress bar */}
        <div className="w-40 h-1.5 bg-gray-800 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${smoothProgress}%` }}
          />
        </div>
        
        {/* Loading text */}
        <div className="text-white text-xl font-thin font-mono mb-3 tracking-wider">
          {loadingText}
        </div>
        
        {/* Progress percentage */}
        <div className="text-gray-200 text-lg font-thin font-mono tracking-wider">
          {Math.round(smoothProgress)}% ({loaded}/{total})
        </div>
      </div>
    </div>
  );
};
