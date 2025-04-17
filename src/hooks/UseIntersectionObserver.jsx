import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver(callback, options) {
  const ref = useRef(null); // Initialize ref
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return; // Ensure ref is attached to a DOM element

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
      if (entry.isIntersecting) {
        callback(); // Trigger the callback when the element is visible
      }
    }, options);

    observer.observe(ref.current); // Observe the element

    return () => {
      observer.disconnect(); // Cleanup observer on unmount
    };
  }, [callback, options]); // Ensure dependencies are stable

  return { ref, isIntersecting }; // Return ref and intersection state
}
