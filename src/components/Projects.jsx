import { Image, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useMemo, useRef } from "react";

export const projects = [
  {
    title: "Textil Arbeit",
    url: "https://youtu.be/CwW7YOBUYng",
    image: "projects/wawatmos.jpg",
    description: "Suspense Fashion Film about abusive employment",
  },
  {
    title: "Martina se va",
    url: "https://youtu.be/FoJvQwK4riM",
    image: "projects/baking.jpg",
    description: "Breakup of a relationship between athletes",
  },
  {
    title: "Old REEL",
    url: "https://youtu.be/70HsdvfNZkg",
    image: "projects/avatar.jpg",
    description: "Different videos directed and edited for Estudio Paula ®",
  },
  {
    title: "GROZNY",
    url: "https://youtu.be/n50kpAHdUw0",
    image: "projects/kanagame.jpg",
    description: "Video Tríptico sobre Grozny 2002, la ciudad más debastada del planeta",
  },
  {
    title: "B.Ventanas",
    url: "https://youtu.be/BkXsb7a6sqs",
    image: "projects/loader.jpg",
    description: "Video Tríptico sobre mis recuerdos infantiles en el balneario Ventanas.",
  },
  {
    title: "Mis Vacaciones",
    url: "https://youtu.be/-eMFt-egXCo",
    image: "projects/loader1.jpg",
    description: "Video Tríptico Machinima sobre Natalia Gomez y su monólogo sobre el amor (2013)",
  },
  {
    title: "Renueva tu Closet",
    url: "https://youtu.be/35N1p0pNKY8",
    image: "projects/loader2.jpg",
    description: "Melinoto y Renueva tu Closet Versión Argentina corta duración",
  },
  {
    title: "pre-RANDOM",
    url: "https://youtu.be/oFphnZlk4V8",
    image: "projects/loader3.jpg",
    description: "SPOT-Machinima: Invitación a participar del proyecto RANDOM",
  },
  {
    title: "Video Clips",
    url: "https://youtu.be/GA3CA4K5_ws",
    image: "projects/loader4.jpg",
    description: "Baila Conmigo - Los Verdaderos Cabreras",
  },
  {
    title: "INVITACIÓN 7",
    url: "https://youtu.be/ROnm3Ed1dcg",
    image: "projects/loader5.jpg",
    description: "MicroVideo para invitación proyecto 7",
  },
  {
    title: "RANDOM",
    url: "https://youtu.be/6DlwEnoB5Bg",
    image: "projects/loader6.jpg",
    description: "Video instalacion de 3 sueños desarrollados en Machinima",
  },
];

const Project = (props) => {
  const { project } = props;

  return (
    <group {...props}>
      <mesh
        position-z={-0.001}
        onClick={() => window.open(project.url, "_blank")}
      >
        <planeGeometry args={[2.2, 2]} />
        <meshBasicMaterial color="black" transparent opacity={0.4} />
      </mesh>
      <Image
        scale={[2, 1.2, 1]}
        url={project.image}
        toneMapped={false}
        position-y={0.3}
      />
      <Text
        maxWidth={2}
        anchorX={"left"}
        anchorY={"top"}
        fontSize={0.2}
        position={[-1, -0.4, 0]}
      >
        {project.title.toUpperCase()}
      </Text>
      <Text
        maxWidth={2}
        anchorX="left"
        anchorY="top"
        fontSize={0.1}
        position={[-1, -0.6, 0]}
      >
        {project.description}
      </Text>
    </group>
  );
};

const wrapValue = (value, min, max) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

export const Projects = () => {
  const { viewport } = useThree();
  const isMobile = viewport.width < 8;
  const carouselLevels = isMobile ? [1.7, -0.15, -2.0] : [1.9, -0.05, -1.95];
  const projectsSectionOffset = isMobile ? 0.6 : 0.45;
  const rowRefs = useRef([]);
  const spacing = 2.5;
  const totalWidth = projects.length * spacing;
  const repeatedCopies = [-1, 0, 1];
  const rowMotion = useMemo(
    () =>
      carouselLevels.map((_, index) => ({
        direction: index === 1 ? 1 : -1,
        speed: 0.35 + Math.random() * 0.25,
        startOffset: -Math.random() * totalWidth,
      })),
    []
  );

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    rowRefs.current.forEach((row, index) => {
      if (!row) {
        return;
      }

      const { direction, speed, startOffset } = rowMotion[index];
      row.position.x = wrapValue(
        startOffset + elapsedTime * speed * direction,
        -totalWidth,
        0
      );
    });
  });

  return (
    <group position-y={-viewport.height * 2 - projectsSectionOffset}>
      {carouselLevels.map((levelY, levelIndex) => (
        <group
          key={`carousel_level_${levelIndex}`}
          position-y={levelY}
          ref={(element) => {
            rowRefs.current[levelIndex] = element;
          }}
        >
          {repeatedCopies.map((copyIndex) =>
            projects.map((project, index) => (
              <motion.group
                key={`project_${levelIndex}_${copyIndex}_${index}`}
                position={[index * spacing + copyIndex * totalWidth, -0.1, -3]}
                rotation={[-Math.PI / 3, 0, -0.1 * Math.PI]}
              >
                <Project project={project} />
              </motion.group>
            ))
          )}
        </group>
      ))}
    </group>
  );
};
