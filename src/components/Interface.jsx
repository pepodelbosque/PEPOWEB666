import { ValidationError, useForm } from "@formspree/react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { currentProjectAtom, projects } from "./Projects";
import { useEffect, useState } from "react";

const Section = (props) => {
  const { children, mobileTop } = props;

  return (
    <motion.section
      className={`
  h-screen w-screen p-8 max-w-screen-2xl mx-auto
  flex flex-col items-start
  ${mobileTop ? "justify-start md:justify-center" : "justify-center"}
  `}
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 1,
          delay: 0.6,
        },
      }}
    >
      {children}
    </motion.section>
  );
};

// First, remove the bannerVariants object (lines 30-70)
const bannerVariants = {
  hidden: { 
    y: 300,
    opacity: 0,
    scale: 0.8,
    rotateX: 45
  },
  visible: { 
    y: 0,
    opacity: 0, // Changed from 1 to 0 for complete transparency
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
      mass: 1,
      duration: 0.8
    }
  },
  exit: { 
    x: 1500, // Deslizamiento horizontal más largo hacia la derecha
    y: 100,  // Ligero movimiento hacia abajo
    opacity: 0,
    scale: 0.7,
    rotateZ: 10, // Mayor rotación en Z para efecto de deslizamiento
    transition: {
      type: "spring",
      stiffness: 40,  // Menos rigidez para un movimiento más fluido
      damping: 8,     // Menos amortiguación para más rebote
      mass: 0.6,      // Menos masa para movimiento más rápido
      duration: 1.5   // Duración más larga para la animación
    }
  }
};

export const Interface = (props) => {
  const { setSection } = props;
  // Remove showBanner state
  const [currentSection, setCurrentSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Modify useEffect to remove banner-related code
  useEffect(() => {
    const handleScroll = () => {
      // Get current scroll position
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Estimate current section based on scroll position
      const estimatedSection = Math.floor(scrollPosition / windowHeight);
      
      // Update current section
      setCurrentSection(estimatedSection);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Remove dependency on showBanner
  
  // Keep mouse movement tracking for other components that might use it
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center w-screen">
      <AboutSection setSection={setSection} />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      
      {/* Remove the AnimatePresence and banner component */}
    </div>
  );
};

const AboutSection = (props) => {
  const { setSection } = props;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Section mobileTop>
      <h1 className="text-2xl md:text-2xl font-bold leading-snug mt-0 md:mt-1" style={{ color: '#eab0ea' }}>
        Hola, me llamo
        <br />
        <span 
          className="text-4xl md:text-6xl font-extrabold bg-cyan px-1 italic font-dxfiggle" 
          style={{ 
            color: '#c75df0',
            textShadow: '-0.5px -0.5px 0 rgba(74, 26, 74, 0.5), 0.5px -0.5px 0 rgba(74, 26, 74, 0.5), -0.5px 0.5px 0 rgba(74, 26, 74, 0.5), 0.5px 0.5px 0 rgba(74, 26, 74, 0.5)'
          }}
        >
          Pepo Sabatini
        </span>
      </h1>
      <motion.p
        className="text-2g mt-2"
        style={{ color: '#eab0ea' }}
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          delay: 1.5,
        }}
      >
         Inspirado por el cine que cruza lenguajes
        <br />
        me muevo con la energía que modifica
        <br />
        lo que siento.

      </motion.p>
      <motion.button
        onClick={() => setSection(3)}
        className={`bg-[#dd81dd] py-2 px-4 rounded-lg font-bold text-sm mt-2 md:mt-8 font-dxfiggle ${isMobile ? 'text-purple-900' : 'text-transparent opacity-50'}`}
        style={{
          ...( !isMobile && {
            WebkitTextStroke: '0.01px black',
            textStroke: '0.01px black'
          })
        }}
        initial={{
          opacity: 1,
          y: 0,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0,
          delay: 0,
        }}
      >
        Contáctame
      </motion.button>
    </Section>
  );
};

const skills = [
  {
      title: "Filming / Directing",
      level: 90,
    },
    {
      title: "Creative Process",
      level: 95,
    },
    {
      title: "Scripting",
      level: 85,
    },
    {
      title: "Art Direction",
      level: 60,
    },
    {
      title: "PostProduction ",
      level: 66,
    },
];
const languages = [
  {
      title: "Fiction",
      level: 100,
    },
    {
      title: "3D Animation",
      level: 90,
    },
    {
      title: "Documentary",
      level: 70,
    },
];

const SkillsSection = () => {
  return (
    <Section>
      <motion.div className="w-full" whileInView={"visible"}>
        <h2 className="text-3xl md:text-5xl font-bold font-dxfiggle inline-block mt-10 md:mt-0" style={{ color: '#eab0ea' }}>Skills</h2>
        <span className="text-xs uppercase tracking-wider ml-3 opacity-70 align-middle" style={{ color: '#eab0ea' }}>Cómo me muevo</span>
        <div className="mt-8 space-y-4">
          {skills.map((skill, index) => (
            <div className="w-full md:w-64" key={index}>
              <motion.h3
                className="text-lg md:text-xl font-bold"
                style={{ color: '#eab0ea' }}
                initial={{
                  opacity: 0,
                }}
                variants={{
                  visible: {
                    opacity: 1,
                    transition: {
                      duration: 1,
                      delay: 1 + index * 0.2,
                    },
                  },
                }}
              >
                {skill.title}
              </motion.h3>
              <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                <motion.div
                  className="h-full bg-indigo-500 rounded-full "
                  style={{ width: `${skill.level}%` }}
                  initial={{
                    scaleX: 0,
                    originX: 0,
                  }}
                  variants={{
                    visible: {
                      scaleX: 1,
                      transition: {
                        duration: 1,
                        delay: 1 + index * 0.2,
                      },
                    },
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mt-10 font-dxfiggle" style={{ color: '#eab0ea' }}>
            Narrative Areas
          </h2>
          <div className="text-xs uppercase tracking-wider opacity-70 mt-1" style={{ color: '#eab0ea' }}>Cómo inicio los pensamientos</div>
          <div className="mt-8 space-y-4">
            {languages.map((lng, index) => (
              <div className="w-full md:w-64" key={index}>
                <motion.h3
                  className="text-lg md:text-xl font-bold"
                  style={{ color: '#eab0ea' }}
                  initial={{
                    opacity: 0,
                  }}
                  variants={{
                    visible: {
                      opacity: 1,
                      transition: {
                        duration: 1,
                        delay: 2 + index * 0.2,
                      },
                    },
                  }}
                >
                  {lng.title}
                </motion.h3>
                <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                  <motion.div
                    className="h-full bg-indigo-500 rounded-full "
                    style={{ width: `${lng.level}%` }}
                    initial={{
                      scaleX: 0,
                      originX: 0,
                    }}
                    variants={{
                      visible: {
                        scaleX: 1,
                        transition: {
                          duration: 1,
                          delay: 2 + index * 0.2,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Section>
  );
};

const ProjectsSection = () => {
  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom);

  const nextProject = () => {
    setCurrentProject((currentProject + 1) % projects.length);
  };

  const previousProject = () => {
    setCurrentProject((currentProject - 1 + projects.length) % projects.length);
  };

  return (
    <Section>
      <div className="flex w-full h-full gap-8 items-center justify-center">
        {/* Removed the left "Projects" title */}
        <button
          className="hover:text-indigo-600 transition-colors"
          onClick={previousProject}
        >
          ← Previous
        </button>
        <h2 className="text-3xl md:text-5xl font-bold font-dxfiggle" style={{ color: '#FFB6C1' }}>Projects</h2>
        <button
          className="hover:text-indigo-600 transition-colors"
          onClick={nextProject}
        >
          Next →
        </button>
      </div>
    </Section>
  );
};

const ContactSection = () => {
  const [state, handleSubmit] = useForm("xrblpzvb");
  
  return (
    <Section>
      <h2 
        className="text-3xl md:text-5xl font-bold font-dxfiggle ml-4" 
        style={{ 
          background: 'linear-gradient(45deg, #ff00cc, #3333ff, #00ffff, #ff00cc)',
          backgroundSize: '300% 300%',
          animation: 'gradient-animation 20s ease infinite',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          textShadow: '0 0 8px rgba(234, 176, 234, 0.3)'
        }}
      >
        Contáctame
      </h2>
      <div className="mt-8 p-4 md:p-6 rounded-md bg-transparent backdrop-blur-sm border border-white/20 w-96 max-w-full">
        {state.succeeded ? (
          <p className="text-center" style={{ color: '#eab0ea' }}>Gracias por tu mensaje !</p>
        ) : (
          <form onSubmit={handleSubmit} action="https://formspree.io/f/xrblpzvb" method="POST">
            <label htmlFor="name" className="font-medium block mb-1 font-dxfiggle" style={{ color: '#eab0ea' }}>
              Pon tu Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
            />
            <label
              htmlFor="email"
              className="font-medium block mb-1 mt-8 font-dxfiggle"
              style={{ color: '#eab0ea' }}
            >
              Your Correo
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
            />
            <ValidationError
              className="mt-1 text-red-500"
              prefix="Email"
              field="email"
              errors={state.errors}
            />
            <label
              htmlFor="message"
              className="font-medium block mb-1 mt-8 font-dxfiggle"
              style={{ color: '#eab0ea' }}
            >
              Tú Mensaje
            </label>
            <textarea
              name="message"
              id="message"
              className="h-24 md:h-32 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
            />
            <ValidationError
              className="mt-1 text-red-500"
              errors={state.errors}
            />
            
            {/* Social Media Icons and Submit Button Container */}
            <div className="flex items-center justify-between mt-16">
              {/* Social Media Icons */}
              <div className="flex space-x-4">
                {/* Instagram Icon - Transparent Style with Noise */}
                <a href="https://www.instagram.com/pepodelbosque/" target="_blank" rel="noopener noreferrer">
                  <div className="relative w-8 h-8 md:w-10 md:h-10 bg-transparent backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-110 hover:bg-white/10 shadow-lg overflow-hidden">
                    {/* Noise overlay */}
                    <div className="absolute inset-0 opacity-30 mix-blend-multiply" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      filter: 'contrast(170%) brightness(100%)'
                    }}></div>
                    {/* Grain texture */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,.15) 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }}></div>
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-label="Instagram">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                </a>
                
                {/* YouTube Icon - Transparent Style with Noise */}
                <a href="https://www.youtube.com/@pepodelbosque" target="_blank" rel="noopener noreferrer">
                  <div className="relative w-8 h-8 md:w-10 md:h-10 bg-transparent backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-110 hover:bg-white/10 shadow-lg overflow-hidden">
                    {/* Noise overlay */}
                    <div className="absolute inset-0 opacity-30 mix-blend-multiply" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      filter: 'contrast(170%) brightness(100%)'
                    }}></div>
                    {/* Grain texture */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,.15) 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }}></div>
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-label="YouTube">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                </a>
                
                {/* Discord Icon - Transparent Style with Noise */}
                <a href="https://discord.com/channels/@me" target="_blank" rel="noopener noreferrer">
                  <div className="relative w-8 h-8 md:w-10 md:h-10 bg-transparent backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-110 hover:bg-white/10 shadow-lg overflow-hidden">
                    {/* Noise overlay */}
                    <div className="absolute inset-0 opacity-30 mix-blend-multiply" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      filter: 'contrast(170%) brightness(100%)'
                    }}></div>
                    {/* Grain texture */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,.15) 1px, transparent 0)`,
                      backgroundSize: '16px 16px'
                    }}></div>
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-label="Discord">
                      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.283a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.283.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.3 13.3 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                    </svg>
                  </div>
                </a>
              </div>
              
              {/* Submit Button */}
              <button
                disabled={state.submitting}
                className="bg-indigo-600 text-white py-2 md:py-3 px-8 rounded-lg font-bold text-lg font-dxfiggle hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
              >
                Enviar
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Remove the banner component */}
    </Section>
  );
};
