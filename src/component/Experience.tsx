import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    period: "2023 - 2024",
    title: "start learning",
    desc: "Built websites for personal experience and practice.",
  },
  {
    period: "2024 - 2025",
    title: "Full Stack Developer",
    desc: "Worked on multiple projects using React, Node.js, MongoDB and more.",
  },
  {
    period: "2025 - Present",
    title: "Growing & Learning",
    desc: "Exploring advanced topics like Rag, langchain,langgraph and AI integration.",
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const items = itemRefs.current.filter(
        (item): item is HTMLDivElement => item !== null
      );
      const dots = dotRefs.current.filter(
        (dot): dot is HTMLSpanElement => dot !== null
      );

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reduceMotion) {
        gsap.set(
          [
            badgeRef.current,
            headingRef.current,
            paraRef.current,
            buttonRef.current,
            ...items,
            ...dots,
          ],
          { opacity: 1, x: 0, y: 0, scale: 1 }
        );
        gsap.set(lineRef.current, { scaleX: 1 });
        return;
      }

      /* =====================================================
         LEFT COLUMN REVEAL
      ===================================================== */

      const introTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      introTl
        .from(badgeRef.current, { opacity: 0, y: -15, duration: 0.5 })
        .from(headingRef.current, { opacity: 0, y: 25, duration: 0.65 }, "-=0.25")
        .from(paraRef.current, { opacity: 0, y: 18, duration: 0.55 }, "-=0.35");

      /* =====================================================
         CONNECTING LINE — draws in left to right
      ===================================================== */

      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });

      /* =====================================================
         TIMELINE REVEAL — line draws, dots pop, text staggers
      ===================================================== */

      const timelineTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          once: true,
        },
      });

      timelineTl
        .to(lineRef.current, { scaleX: 1, duration: 1, ease: "power2.inOut" })
        .add(() => {
          trailRef.current?.classList.add("is-active");
        })
        .from(
          dots,
          {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: "back.out(2.5)",
            stagger: 0.18,
          },
          "-=0.7"
        )
        .from(
          items,
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.18,
          },
          "-=0.8"
        );

      /* =====================================================
         TIMELINE ITEM HOVER — lift + dot glow pulse
      ===================================================== */

      const itemCleanups: Array<() => void> = [];

      items.forEach((item, index) => {
        const dot = dots[index];

        const enter = () => {
          gsap.to(item, { y: -4, duration: 0.3, ease: "power2.out" });

          if (dot) {
            gsap.to(dot, {
              scale: 1.4,
              boxShadow: "0 0 0 6px rgba(59, 130, 246, 0.2)",
              duration: 0.3,
              ease: "power2.out",
            });
          }
        };

        const leave = () => {
          gsap.to(item, { y: 0, duration: 0.3, ease: "power2.out" });

          if (dot) {
            gsap.to(dot, {
              scale: 1,
              boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)",
              duration: 0.3,
              ease: "power2.out",
            });
          }
        };

        item.addEventListener("mouseenter", enter);
        item.addEventListener("mouseleave", leave);

        itemCleanups.push(() => {
          item.removeEventListener("mouseenter", enter);
          item.removeEventListener("mouseleave", leave);
        });
      });

      /* =====================================================
         BUTTON HOVER
      ===================================================== */

      const button = buttonRef.current;

      const buttonEnter = () => {
        gsap.to(button, { scale: 1.05, y: -2, duration: 0.3, ease: "power2.out" });
      };

      const buttonLeave = () => {
        gsap.to(button, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
      };

      button?.addEventListener("mouseenter", buttonEnter);
      button?.addEventListener("mouseleave", buttonLeave);

      /* =====================================================
         CLEANUP
      ===================================================== */

      return () => {
        itemCleanups.forEach((cleanup) => cleanup());
        button?.removeEventListener("mouseenter", buttonEnter);
        button?.removeEventListener("mouseleave", buttonLeave);
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  const setItemRef =
    (index: number) =>
    (element: HTMLDivElement | null) => {
      itemRefs.current[index] = element;
    };

  const setDotRef =
    (index: number) =>
    (element: HTMLSpanElement | null) => {
      dotRefs.current[index] = element;
    };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#05070f] border-b border-white/5"
    >
      {/* Scoped styles: ambient drifting background, and the
          continuous light-trail that travels along the timeline line */}
      <style>{`
        @keyframes bgOrbDriftOne {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          50% { transform: translate(40px, -30px) scale(1.15); opacity: 1; }
        }
        @keyframes bgOrbDriftTwo {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(-50px, 35px) scale(1.1); opacity: 0.95; }
        }
        @keyframes bgGridDrift {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        .experience-bg-orb-1 { animation: bgOrbDriftOne 18s ease-in-out infinite; }
        .experience-bg-orb-2 { animation: bgOrbDriftTwo 22s ease-in-out infinite; }
        .experience-bg-grid {
          background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          animation: bgGridDrift 40s linear infinite;
        }

        @keyframes timelineTrailMove {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .timeline-trail-core,
        .timeline-trail-glow {
          position: absolute;
          top: 10px;
          left: 0%;
          transform: translate(-50%, -50%);
          opacity: 0;
          pointer-events: none;
          animation: timelineTrailMove 3.2s ease-in-out infinite;
          animation-play-state: paused;
        }
        .timeline-trail-wrap.is-active .timeline-trail-core,
        .timeline-trail-wrap.is-active .timeline-trail-glow {
          animation-play-state: running;
        }
        .timeline-trail-core {
          width: 70px;
          height: 4px;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent, rgba(147, 197, 253, 0.95), transparent);
          filter: blur(1.5px);
        }
        .timeline-trail-glow {
          width: 150px;
          height: 150px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.35), transparent 70%);
          filter: blur(20px);
        }

        @media (prefers-reduced-motion: reduce) {
          .experience-bg-orb-1, .experience-bg-orb-2, .experience-bg-grid {
            animation: none;
          }
          .timeline-trail-core, .timeline-trail-glow {
            display: none;
          }
        }
      `}</style>

      {/* Ambient animated background — purely decorative, behind all content */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="experience-bg-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="experience-bg-orb-1 absolute -top-20 right-0 w-[360px] h-[360px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="experience-bg-orb-2 absolute -bottom-20 left-0 w-[320px] h-[320px] rounded-full bg-purple-500/8 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row lg:items-start gap-12">
          <div className="lg:w-[280px] shrink-0">
            <span
              ref={badgeRef}
              className="inline-block text-[12px] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1.5 rounded-full mb-5"
            >
              Experience
            </span>
            <h2 ref={headingRef} className="text-white text-[32px] font-bold leading-tight mb-3">
              My Journey
            </h2>
            <p ref={paraRef} className="text-gray-400 text-[14px] leading-relaxed">
              A timeline of my work, education and key milestones.
            </p>
          </div>

          <div className="flex-1 relative">
            <div className="hidden sm:block absolute top-[10px] left-0 right-0 h-px bg-white/10" />
            <div ref={lineRef} className="hidden sm:block absolute top-[10px] left-0 right-0 h-px bg-blue-500/60" />
            <div ref={trailRef} className="timeline-trail-wrap hidden sm:block absolute inset-0">
              <div className="timeline-trail-glow" />
              <div className="timeline-trail-core" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {timeline.map((t, index) => (
                <div key={t.title} ref={setItemRef(index)} className="relative pt-6 cursor-default">
                  <span
                    ref={setDotRef(index)}
                    className="hidden sm:block absolute top-0 left-0 w-[9px] h-[9px] rounded-full bg-blue-500 -translate-y-1/2"
                  />
                  <p className="text-blue-400 text-[13px] font-medium mb-2">{t.period}</p>
                  <h3 className="text-white text-[15px] font-semibold mb-1.5">{t.title}</h3>
                  <p className="text-gray-500 text-[13px] leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          ref={buttonRef}
          className="mt-10 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white text-[14px] font-medium px-5 py-3 rounded-full"
        >
          View Full Resume <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}