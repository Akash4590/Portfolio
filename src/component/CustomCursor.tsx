import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const ringPosition = useRef({ x: 0, y: 0 });

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch devices
    const isTouchDevice = window.matchMedia(
      "(pointer: coarse)"
    ).matches;

    if (isTouchDevice) return;

    let animationFrame: number;

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;

      setIsVisible(true);

      // Small dot follows immediately
      if (dotRef.current) {
        dotRef.current.style.left = `${event.clientX}px`;
        dotRef.current.style.top = `${event.clientY}px`;
      }
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const interactiveElement = target.closest(
        "a, button, input, textarea, select, [role='button'], [data-cursor-hover]"
      );

      setIsHovering(Boolean(interactiveElement));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const animateRing = () => {
      ringPosition.current.x +=
        (mouse.current.x - ringPosition.current.x) * 0.12;

      ringPosition.current.y +=
        (mouse.current.y - ringPosition.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPosition.current.x}px`;
        ringRef.current.style.top = `${ringPosition.current.y}px`;
      }

      animationFrame = requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    animationFrame = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);

      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      {/* Small glowing cursor dot */}
      <div
        ref={dotRef}
        className={`
          pointer-events-none
          fixed
          z-[9999]
          h-2
          w-2
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-400
          shadow-[0_0_12px_rgba(34,211,238,0.9),0_0_25px_rgba(34,211,238,0.5)]
          transition-opacity
          duration-200
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Trailing cursor ring */}
      <div
        ref={ringRef}
        className={`
          pointer-events-none
          fixed
          z-[9998]
          h-8
          w-8
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          transition-all
          duration-200
          ${
            isHovering
              ? "scale-[1.8] border-cyan-300/80 bg-cyan-400/10"
              : "scale-100 border-cyan-400/40"
          }
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />
    </>
  );
}