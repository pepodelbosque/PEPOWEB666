import { Scroll, ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { MotionConfig } from "framer-motion";
import { Leva } from "leva";
import { Suspense, useEffect, useState } from "react";
import { Cursor } from "./components/Cursor";
import { Experience } from "./components/Experience";
import { Interface } from "./components/Interface";
import { LoadingScreen } from "./components/LoadingScreen";
import { Menu } from "./components/Menu";
import { ScrollManager } from "./components/ScrollManager";
import { framerMotionConfig } from "./config";
import { AudioProvider } from "./components/AudioContext";

// Preload critical assets immediately
import { useGLTF, useFBX } from "@react-three/drei";

// Preload all critical assets
useGLTF.preload("models/646d9dcdc8a5f5bddbfac913.glb");
useGLTF.preload("/models/Workstation.gltf");
useFBX.preload("animations/Typing.fbx");
useFBX.preload("animations/Standing Idle.fbx");
useFBX.preload("animations/Falling Idle.fbx");
useFBX.preload("animations/Dancing.fbx");
useFBX.preload("animations/Kneeling2.fbx");

function AppContent() {
  const [section, setSection] = useState(0);
  const [started, setStarted] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    setMenuOpened(false);
  }, [section]);

  // Ensure smooth transition after loading
  useEffect(() => {
    if (started) {
      setTimeout(() => {
        setAssetsReady(true);
      }, 200); // Small delay for smoother first render
    }
  }, [started]);

  return (
    <>
      <LoadingScreen started={started} setStarted={setStarted} />
      <MotionConfig
        transition={{
          ...framerMotionConfig,
        }}
      >
        <Canvas 
          shadows 
          camera={{ position: [0, 3, 10], fov: 42 }}
          performance={{ min: 0.5 }} // Performance optimization
          dpr={[1, 2]} // Limit pixel ratio for better performance
        >
          <color attach="background" args={["#000000"]} />
          <ScrollControls pages={4} damping={0.1}>
            <ScrollManager section={section} onSectionChange={setSection} />
            <Scroll>
              <Suspense fallback={null}>
                {started && assetsReady && (
                  <Experience section={section} menuOpened={menuOpened} />
                )}
              </Suspense>
            </Scroll>
            <Scroll html>
              {started && assetsReady && <Interface setSection={setSection} />}
            </Scroll>
          </ScrollControls>
        </Canvas>
        <Menu
          onSectionChange={setSection}
          menuOpened={menuOpened}
          setMenuOpened={setMenuOpened}
          section={section}
        />
        <Cursor />
      </MotionConfig>
      <Leva hidden />
    </>
  );
}

function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}

export default App;
