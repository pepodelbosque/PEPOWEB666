import { Sphere, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Background = () => {
  const material = useRef();
  const grainMaterial = useRef();
  const sphereRef = useRef();
  const grainSphereRef = useRef();
  
  const color1 = useRef({ r: 1.0, g: 0.2, b: 0.0 }); // Lava red
  const color2 = useRef({ r: 1.0, g: 0.4, b: 0.0 }); // Lava orange
  const color3 = useRef({ r: 0.0, g: 0.3, b: 1.0 }); // Blue
  const color4 = useRef({ r: 0.5, g: 0.0, b: 1.0 }); // Purple
  const color5 = useRef({ r: 0.0, g: 1.0, b: 1.0 }); // Cyan
  
  const data = useScroll();
  const tl = useRef();
  const time = useRef(0);

  // Custom shader material for animated gradients
  const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Vector3(1.0, 0.2, 0.0) },
      color2: { value: new THREE.Vector3(1.0, 0.4, 0.0) },
      color3: { value: new THREE.Vector3(0.0, 0.3, 1.0) },
      color4: { value: new THREE.Vector3(0.5, 0.0, 1.0) },
      color5: { value: new THREE.Vector3(0.0, 1.0, 1.0) },
      progress: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform vec3 color4;
      uniform vec3 color5;
      uniform float progress;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      
      // Noise function for organic movement
      float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 54.53))) * 43758.5453);
      }
      
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for(int i = 0; i < 4; i++) {
          value += amplitude * noise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }
      
      void main() {
        vec3 pos = vPosition + time * 0.1;
        
        // Create flowing noise patterns
        float noise1 = fbm(pos * 0.5 + time * 0.2);
        float noise2 = fbm(pos * 0.3 + time * 0.15);
        float noise3 = fbm(pos * 0.7 + time * 0.25);
        
        // Mix colors based on noise and scroll progress
        vec3 finalColor;
        
        if(progress < 0.25) {
          finalColor = mix(color1, color2, noise1);
        } else if(progress < 0.5) {
          finalColor = mix(color2, color3, noise2);
        } else if(progress < 0.75) {
          finalColor = mix(color3, color4, noise3);
        } else {
          finalColor = mix(color4, color5, noise1);
        }
        
        // Add some variation with multiple noise layers
        finalColor = mix(finalColor, color5, noise2 * 0.3);
        finalColor = mix(finalColor, color1, noise3 * 0.2);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.BackSide,
    toneMapped: false
  });

  // Grain material
  const grainShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      opacity: { value: 0.15 }
    },
    vertexShader: `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float opacity;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 st = vUv * 800.0; // Grain density
        float grain = random(st + time * 0.1);
        
        gl_FragColor = vec4(vec3(grain), opacity);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });

  useFrame((state, delta) => {
    time.current += delta * 0.5; // Slow movement
    
    if (tl.current) {
      tl.current.progress(data.scroll.current);
    }
    
    // Update shader uniforms
    gradientMaterial.uniforms.time.value = time.current;
    gradientMaterial.uniforms.progress.value = data.scroll.current;
    
    gradientMaterial.uniforms.color1.value.set(color1.current.r, color1.current.g, color1.current.b);
    gradientMaterial.uniforms.color2.value.set(color2.current.r, color2.current.g, color2.current.b);
    gradientMaterial.uniforms.color3.value.set(color3.current.r, color3.current.g, color3.current.b);
    gradientMaterial.uniforms.color4.value.set(color4.current.r, color4.current.g, color4.current.b);
    gradientMaterial.uniforms.color5.value.set(color5.current.r, color5.current.g, color5.current.b);
    
    grainShaderMaterial.uniforms.time.value = time.current;
    
    // Slow rotation for organic movement
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.05;
      sphereRef.current.rotation.x += delta * 0.02;
    }
  });

  useEffect(() => {
    tl.current = gsap.timeline();
    
    // Animate through different gradient combinations
    tl.current.to(color1.current, {
      r: 0.8, g: 0.1, b: 0.9, // Purple-ish
      duration: 1
    });
    tl.current.to(color2.current, {
      r: 0.0, g: 0.5, b: 1.0, // Blue
      duration: 1
    }, 0);
    
    tl.current.to(color3.current, {
      r: 0.0, g: 1.0, b: 0.8, // Cyan
      duration: 1
    });
    tl.current.to(color4.current, {
      r: 1.0, g: 0.3, b: 0.0, // Orange
      duration: 1
    }, 1);
    
    tl.current.to(color5.current, {
      r: 0.9, g: 0.0, b: 0.4, // Pink-red
      duration: 1
    });
  }, []);

  return (
    <group>
      {/* Main gradient background */}
      <Sphere ref={sphereRef} scale={[30, 30, 30]}>
        <primitive object={gradientMaterial} attach="material" />
      </Sphere>
      
      {/* Grain overlay */}
      <Sphere ref={grainSphereRef} scale={[29.5, 29.5, 29.5]}>
        <primitive object={grainShaderMaterial} attach="material" />
      </Sphere>
    </group>
  );
};
