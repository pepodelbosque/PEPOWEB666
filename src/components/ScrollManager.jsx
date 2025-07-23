import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export const ScrollManager = (props) => {
  const { section, onSectionChange } = props;

  const data = useScroll();
  const lastScroll = useRef(0);
  const isAnimating = useRef(false);
  const lastActivityTime = useRef(Date.now());
  const inactivityTimeout = useRef(null);

  data.fill.classList.add("top-0");
  data.fill.classList.add("absolute");

  // Function to reset inactivity timer
  const resetInactivityTimer = () => {
    lastActivityTime.current = Date.now();
    
    // Clear any existing timeout
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    
    // Set new timeout to redirect to Office section after 20 seconds
    inactivityTimeout.current = setTimeout(() => {
      if (section !== 0) {
        onSectionChange(0); // Redirect to Office section
      }
    }, 20000); // 20 seconds
  };

  // Set up event listeners for user activity
  useEffect(() => {
    // Track user activity
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    // Add event listeners for common user interactions
    window.addEventListener("scroll", handleUserActivity);
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("mousedown", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);

    // Initialize the inactivity timer
    resetInactivityTimer();

    // Clean up event listeners
    return () => {
      window.removeEventListener("scroll", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("mousedown", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
    };
  }, [section, onSectionChange]);

  useEffect(() => {
    gsap.to(data.el, {
      duration: 1,
      scrollTop: section * data.el.clientHeight,
      onStart: () => {
        isAnimating.current = true;
      },
      onComplete: () => {
        isAnimating.current = false;
      },
    });
    
    // Reset inactivity timer when section changes
    resetInactivityTimer();
  }, [section]);

  useFrame(() => {
    if (isAnimating.current) {
      lastScroll.current = data.scroll.current;
      return;
    }

    const curSection = Math.floor(data.scroll.current * data.pages);
    if (data.scroll.current > lastScroll.current && curSection === 0) {
      onSectionChange(1);
    }
    if (
      data.scroll.current < lastScroll.current &&
      data.scroll.current < 1 / (data.pages - 1)
    ) {
      onSectionChange(0);
    }
    lastScroll.current = data.scroll.current;
  });

  return null;
};
