import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reduceMotion) {
        gsap.set(
          [kickerRef.current, headingRef.current, paraRef.current, buttonRef.current],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      /* =====================================================
         STAGGERED REVEAL
      ===================================================== */

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      tl.from(kickerRef.current, { opacity: 0, y: -12, duration: 0.5 })
        .from(headingRef.current, { opacity: 0, y: 22, duration: 0.6 }, "-=0.25")
        .from(paraRef.current, { opacity: 0, y: 16, duration: 0.55 }, "-=0.35")
        .from(buttonRef.current, { opacity: 0, y: 14, scale: 0.94, duration: 0.5 }, "-=0.3");

      /* =====================================================
         BUTTON HOVER — lift, arrow slide
      ===================================================== */

      const button = buttonRef.current;

      const setArrowX = arrowRef.current
        ? gsap.quickTo(arrowRef.current, "x", { duration: 0.3, ease: "power2.out" })
        : null;

      const enter = () => {
        gsap.to(button, { scale: 1.05, y: -2, duration: 0.3, ease: "power2.out" });
        setArrowX?.(4);
      };

      const leave = () => {
        gsap.to(button, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
        setArrowX?.(0);
      };

      button?.addEventListener("mouseenter", enter);
      button?.addEventListener("mouseleave", leave);

      return () => {
        button?.removeEventListener("mouseenter", enter);
        button?.removeEventListener("mouseleave", leave);
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 overflow-hidden"
    >
      {/* Scoped styles: drifting light orbs, moving spotlight,
          and the button shimmer sweep — kept local to this component */}
      <style>{`
        @keyframes ctaOrbDriftOne {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(35px, 25px) scale(1.15); opacity: 0.8; }
        }
        @keyframes ctaOrbDriftTwo {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(-40px, -20px) scale(1.1); opacity: 0.7; }
        }
        @keyframes ctaSpotlightDrift {
          0%, 100% { background-position: 20% 20%; }
          50% { background-position: 30% 30%; }
        }
        .cta-orb-1 { animation: ctaOrbDriftOne 14s ease-in-out infinite; }
        .cta-orb-2 { animation: ctaOrbDriftTwo 17s ease-in-out infinite; }
        .cta-spotlight {
          background-image: radial-gradient(circle at 20% 20%, white, transparent 35%);
          animation: ctaSpotlightDrift 12s ease-in-out infinite;
        }

        .cta-button {
          position: relative;
        }
        .cta-button::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: linear-gradient(
            120deg,
            transparent 20%,
            rgba(59, 130, 246, 0.35) 50%,
            transparent 80%
          );
          background-size: 250% 100%;
          background-position: 100% 0;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .cta-button:hover::after {
          opacity: 1;
          animation: ctaButtonShimmer 1.1s ease-in-out;
        }
        @keyframes ctaButtonShimmer {
          0% { background-position: 130% 0; }
          100% { background-position: -30% 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-orb-1, .cta-orb-2, .cta-spotlight {
            animation: none;
          }
          .cta-button:hover::after {
            animation: none;
          }
        }
      `}</style>

      {/* Ambient light layer — drifting orbs + slow-moving spotlight,
          purely decorative, sits above the gradient */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="cta-spotlight absolute inset-0 opacity-20" />
        <div className="cta-orb-1 absolute top-0 right-1/4 w-[280px] h-[280px] rounded-full bg-white/10 blur-[90px]" />
        <div className="cta-orb-2 absolute bottom-0 left-1/4 w-[240px] h-[240px] rounded-full bg-white/10 blur-[80px]" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 py-16 text-center">
        <p ref={kickerRef} className="text-blue-100 text-[12px] tracking-wide mb-3">
          Let&apos;s Build Together
        </p>
        <h2 ref={headingRef} className="text-white text-[28px] sm:text-[32px] font-bold mb-3">
          Have a project in mind?
        </h2>
        <p ref={paraRef} className="text-blue-100 text-[14px] max-w-[440px] mx-auto mb-7">
          I&apos;m always open to new opportunities. Let&apos;s create
          something amazing and turn your ideas into reality.
        </p>
        <button
          ref={buttonRef}
          className="cta-button inline-flex items-center gap-2 bg-white text-blue-700 text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors"
        >
          Start a Project <span ref={arrowRef} aria-hidden className="inline-block">→</span>
        </button>
      </div>
    </section>
  );
}