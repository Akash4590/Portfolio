import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    name: "React",
    desc: "Frontend Library",
    icon: "⚛️",
    color: "text-cyan-400",
  },
  {
    name: "TypeScript",
    desc: "Type Safety",
    icon: "TS",
    color: "text-blue-400",
  },
  {
    name: "Tailwind CSS",
    desc: "Utility CSS",
    icon: "≈",
    color: "text-sky-400",
  },
  {
    name: "Node.js",
    desc: "Runtime Environment",
    icon: "JS",
    color: "text-green-500",
  },
  {
    name: "Express.js",
    desc: "Web Framework",
    icon: "eX",
    color: "text-gray-300",
  },
  {
    name: "MongoDB",
    desc: "NoSQL Database",
    icon: "🍃",
    color: "text-green-400",
  },
  {
    name: "PostgreSQL",
    desc: "Relational Database",
    icon: "🐘",
    color: "text-sky-400",
  },
  {
    name: "n8n",
    desc: "Workflow Automation",
    icon: "∞",
    color: "text-pink-500",
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(
        (card): card is HTMLDivElement => card !== null
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
            linkRef.current,
            ...cards,
          ],
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          }
        );

        return;
      }

      /* =====================================================
         HEADER ANIMATION
      ===================================================== */

      const headerTl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      headerTl
        .from(badgeRef.current, {
          opacity: 0,
          y: -15,
          duration: 0.5,
        })
        .from(
          headingRef.current,
          {
            opacity: 0,
            y: 25,
            duration: 0.65,
          },
          "-=0.25"
        )
        .from(
          paraRef.current,
          {
            opacity: 0,
            y: 18,
            duration: 0.55,
          },
          "-=0.35"
        )
        .from(
          linkRef.current,
          {
            opacity: 0,
            x: 15,
            duration: 0.5,
          },
          "-=0.35"
        );

      /* =====================================================
         CARDS REVEAL (staggered, on enter viewport)
      ===================================================== */

      gsap.set(cards, { transformPerspective: 700 });

      gsap.from(cards, {
        opacity: 0,
        y: 30,
        scale: 0.94,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 82%",
          once: true,
        },
      });

      /* =====================================================
         CARD HOVER — 3D tilt, lift, cursor-follow glow, icon pop
      ===================================================== */

      const cardCleanups: Array<() => void> = [];

      cards.forEach((card) => {
        const icon = card.querySelector<HTMLElement>(
          "[data-skill-icon]"
        );

        // quickTo tweens reuse a single tween per property — the
        // performant pattern for anything driven by mousemove
        const setRotateX = gsap.quickTo(card, "rotationX", {
          duration: 0.5,
          ease: "power3.out",
        });
        const setRotateY = gsap.quickTo(card, "rotationY", {
          duration: 0.5,
          ease: "power3.out",
        });
        const setLiftY = gsap.quickTo(card, "y", {
          duration: 0.4,
          ease: "power3.out",
        });
        const setScale = gsap.quickTo(card, "scale", {
          duration: 0.4,
          ease: "power3.out",
        });

        const handleMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;

          const maxTilt = 7;
          setRotateY((px - 0.5) * maxTilt * 2);
          setRotateX(-(py - 0.5) * maxTilt * 2);

          // drive the cursor-follow glow via CSS vars — cheap,
          // no React re-render, no extra gsap tween needed
          card.style.setProperty("--mx", `${px * 100}%`);
          card.style.setProperty("--my", `${py * 100}%`);
        };

        const enter = () => {
          setLiftY(-6);
          setScale(1.03);

          if (icon) {
            gsap.to(icon, {
              scale: 1.18,
              rotation: 3,
              duration: 0.3,
              ease: "back.out(2)",
            });
          }
        };

        const leave = () => {
          setRotateX(0);
          setRotateY(0);
          setLiftY(0);
          setScale(1);

          if (icon) {
            gsap.to(icon, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        };

        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);

        cardCleanups.push(() => {
          card.removeEventListener("mousemove", handleMove);
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
        });
      });

      /* =====================================================
         LEARN MORE HOVER
      ===================================================== */

      const link = linkRef.current;

      const linkEnter = () => {
        gsap.to(link, {
          x: 5,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const linkLeave = () => {
        gsap.to(link, {
          x: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      link?.addEventListener("mouseenter", linkEnter);
      link?.addEventListener("mouseleave", linkLeave);

      /* =====================================================
         CLEANUP
      ===================================================== */

      return () => {
        cardCleanups.forEach((cleanup) => cleanup());

        link?.removeEventListener("mouseenter", linkEnter);
        link?.removeEventListener("mouseleave", linkLeave);
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  const setCardRef =
    (index: number) =>
    (element: HTMLDivElement | null) => {
      cardRefs.current[index] = element;
    };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="bg-[#05070f] border-b border-white/5"
    >
      {/* Scoped styles for the idle border-glow pulse and the
          cursor-follow spotlight — kept local to this component */}
      <style>{`
        .skill-card {
          animation: skillBorderPulse 6s ease-in-out infinite;
          will-change: transform;
        }
        .skill-card:hover {
          animation-play-state: paused;
          border-color: rgba(96, 165, 250, 0.4);
        }
        @keyframes skillBorderPulse {
          0%, 100% { border-color: rgba(255, 255, 255, 0.1); }
          50% { border-color: rgba(59, 130, 246, 0.22); }
        }
        .skill-card-glow {
          background: radial-gradient(
            160px circle at var(--mx, 50%) var(--my, 50%),
            rgba(96, 165, 250, 0.18),
            transparent 70%
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .skill-card {
            animation: none;
          }
        }
      `}</style>

      <div className="max-w-[1280px] mx-auto px-6 py-20">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <span
              ref={badgeRef}
              className="inline-block text-[12px] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1.5 rounded-full mb-5"
            >
              My Skills
            </span>

            <h2
              ref={headingRef}
              className="text-white text-[32px] font-bold leading-tight mb-3"
            >
              Technologies I Work With
            </h2>

            <p
              ref={paraRef}
              className="text-gray-400 text-[15px] max-w-[440px]"
            >
              Here are the technologies and tools I use to build modern,
              scalable and high-performance applications.
            </p>
          </div>

          <a
            ref={linkRef}
            href="#"
            className="text-blue-400 text-[14px] font-medium hover:text-blue-300 transition-colors whitespace-nowrap"
          >
            Learn More →
          </a>
        </div>

        {/* =================================================
            SKILLS GRID
        ================================================= */}

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {skills.map((s, index) => (
            <div
              key={s.name}
              ref={setCardRef(index)}
              style={
                {
                  "--mx": "50%",
                  "--my": "50%",
                } as React.CSSProperties
              }
              className="skill-card group relative overflow-hidden bg-[#0c0f1a] border border-white/10 rounded-xl p-5 flex items-center gap-3 cursor-pointer transition-shadow duration-300 hover:shadow-[0_10px_40px_-12px_rgba(59,130,246,0.35)]"
            >
              {/* Cursor-follow spotlight glow */}
              <div
                className="skill-card-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />

              <span
                data-skill-icon
                className={`relative z-10 text-[20px] font-bold ${s.color}`}
              >
                {s.icon}
              </span>

              <div className="relative z-10">
                <p className="text-white text-[14px] font-medium">
                  {s.name}
                </p>

                <p className="text-gray-500 text-[11px]">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}