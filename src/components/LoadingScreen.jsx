import { useProgress } from "@react-three/drei";
import { useEffect } from "react";
// Remove the useAudio import
// import { useAudio } from "./AudioContext";

export const LoadingScreen = (props) => {
  const { started, setStarted } = props;
  const { progress, total, loaded, item } = useProgress();
  // Remove the playForSection destructuring
  // const { playForSection } = useAudio();

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setStarted(true);
        // Remove the automatic audio start
        // playForSection(0);
      }, 500);
    }
  }, [progress, total, loaded, item]); // Remove playForSection from dependencies

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-1000 pointer-events-none
      flex items-center justify-center bg-cover bg-center
      ${started ? "opacity-0" : "opacity-100"}`}
      style={{
        backgroundImage: `url('/textures/transition_texture.png')`,
      }}
    >
      {/* Replace the text loading with CSS loader */}
      <div className="loader"></div>
    </div>
  );
};
