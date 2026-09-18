import { useEffect, useRef } from "react";
import {
  Layers,
  Braces,
  Sparkles,
  Workflow,
  PenTool,
  ShoppingCart,
  Megaphone,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Layers,
    title: "Full-Stack Web Development",
    desc: "End-to-end apps built on React, Node.js and Express.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Sparkles,
    title: "AI Integration",
    desc: "Chatbots, smart search and AI features built into your product.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Workflow,
    title: "n8n AI Automation",
    desc: "Automated workflows that connect your tools and save hours weekly.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: PenTool,
    title: "Website Design",
    desc: "Custom, responsive interfaces designed and built in React.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Development",
    desc: "Online stores with secure checkout that sell and scale.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Braces,
    title: "React / TypeScript",
    desc: "Fast, interactive and type-safe applications.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  {
    icon: Megaphone,
    title: "Meta Ads & SMM",
    desc: "Facebook & Instagram ad campaigns and social media management.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
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
          [badgeRef.current, headingRef.current, paraRef.current, buttonRef.current, ...cards],
          { opacity: 1, x: 0, y: 0, scale: 1 }
        );
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
        .from(paraRef.current, { opacity: 0, y: 18, duration: 0.55 }, "-=0.35")
        .from(buttonRef.current, { opacity: 0, y: 15, scale: 0.95, duration: 0.5 }, "-=0.3");

      /* =====================================================
         CARDS — staggered scroll reveal
      ===================================================== */

      gsap.set(cards, { transformPerspective: 800 });

      gsap.from(cards, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 82%",
          once: true,
        },
      });

      /* =====================================================
         CARD HOVER — lift, cursor-follow glow, icon pop
      ===================================================== */

      const cardCleanups: Array<() => void> = [];

      cards.forEach((card) => {
        const icon = card.querySelector<HTMLElement>("[data-service-icon]");

        const setLiftY = gsap.quickTo(card, "y", { duration: 0.4, ease: "power3.out" });
        const setRotateX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
        const setRotateY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });

        const handleMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;

          const maxTilt = 4;
          setRotateY((px - 0.5) * maxTilt * 2);
          setRotateX(-(py - 0.5) * maxTilt * 2);

          card.style.setProperty("--mx", `${px * 100}%`);
          card.style.setProperty("--my", `${py * 100}%`);
        };

        const enter = () => {
          setLiftY(-4);

          if (icon) {
            gsap.to(icon, {
              scale: 1.12,
              rotation: -4,
              duration: 0.3,
              ease: "back.out(2)",
            });
          }
        };

        const leave = () => {
          setLiftY(0);
          setRotateX(0);
          setRotateY(0);

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
        cardCleanups.forEach((cleanup) => cleanup());
        button?.removeEventListener("mouseenter", buttonEnter);
        button?.removeEventListener("mouseleave", buttonLeave);
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
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#05070f] border-b border-white/5"
    >
      {/* Scoped styles: idle border-glow pulse, cursor-follow spotlight,
          and the ambient drifting background — kept local to this component */}
      <style>{`
        @keyframes bgOrbDriftOne {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.15); }
        }
        @keyframes bgOrbDriftTwo {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 35px) scale(1.1); }
        }
        @keyframes bgOrbDriftThree {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 40px) scale(1.08); }
        }
        @keyframes bgGridDrift {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        .services-bg-orb-1 { animation: bgOrbDriftOne 16s ease-in-out infinite; }
        .services-bg-orb-2 { animation: bgOrbDriftTwo 20s ease-in-out infinite; }
        .services-bg-orb-3 { animation: bgOrbDriftThree 24s ease-in-out infinite; }
        .services-bg-grid {
          background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          animation: bgGridDrift 40s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .services-bg-orb-1, .services-bg-orb-2, .services-bg-orb-3, .services-bg-grid {
            animation: none;
          }
        }
        .service-card {
          animation: serviceBorderPulse 6.5s ease-in-out infinite;
          will-change: transform;
        }
        .service-card:hover {
          animation-play-state: paused;
          border-color: rgba(96, 165, 250, 0.35);
        }
        @keyframes serviceBorderPulse {
          0%, 100% { border-color: rgba(255, 255, 255, 0.1); }
          50% { border-color: rgba(59, 130, 246, 0.2); }
        }
        .service-card-glow {
          background: radial-gradient(
            180px circle at var(--mx, 50%) var(--my, 50%),
            rgba(96, 165, 250, 0.15),
            transparent 70%
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .service-card {
            animation: none;
          }
        }
      `}</style>

      {/* Ambient animated background — glow orbs + faint dot grid,
          both purely decorative and behind all content */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="services-bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="services-bg-orb-1 absolute -top-24 -left-16 w-[380px] h-[380px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="services-bg-orb-2 absolute top-1/3 -right-24 w-[420px] h-[420px] rounded-full bg-purple-500/10 blur-[110px]" />
        <div className="services-bg-orb-3 absolute -bottom-24 left-1/3 w-[340px] h-[340px] rounded-full bg-pink-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12">
        <div>
          <span
            ref={badgeRef}
            className="inline-block text-[12px] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1.5 rounded-full mb-5"
          >
            Services
          </span>
          <h2 ref={headingRef} className="text-white text-[32px] font-bold leading-tight mb-4">
            What I Can Do For You
          </h2>
          <p ref={paraRef} className="text-gray-400 text-[15px] leading-relaxed mb-8">
            I offer end-to-end development, automation and growth services to
            help you build, launch and scale your digital products.
          </p>
          <button
            ref={buttonRef}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white text-[14px] font-medium px-5 py-3 rounded-full"
          >
            All Services <span aria-hidden>→</span>
          </button>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ icon: Icon, title, desc, color, bg }, index) => (
            <div
              key={title}
              ref={setCardRef(index)}
              style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
              className="service-card group relative overflow-hidden bg-[#0c0f1a] border border-white/10 rounded-xl p-5 cursor-pointer transition-shadow duration-300 hover:shadow-[0_16px_45px_-15px_rgba(59,130,246,0.3)]"
            >
              {/* Cursor-follow spotlight glow */}
              <div
                className="service-card-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />

              <div
                data-service-icon
                className={`relative z-10 w-9 h-9 rounded-lg ${bg} flex items-center justify-center ${color} mb-4`}
              >
                <Icon size={18} />
              </div>
              <h3 className="relative z-10 text-white text-[14px] font-medium mb-1.5">{title}</h3>
              <p className="relative z-10 text-gray-500 text-[12px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}