import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import growrise from "../assets/digital.jfif";
import Aileads from "../assets/Ai leads.avif";
import techgear from "../assets/techgear.jfif";
import portfolio from "../assets/akashpor.png";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "TechGear E-commerce",
    desc: "A modern e-commerce platform with secure payments, real-time orders and admin dashboard.",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    image: techgear,
  },
  {
    title: "Grow Rise Digital Agency",
    desc: "A digital marketing agency website with services, portfolio, blog and contact form.",
    tags: ["React", "TypeScript", "Tailwind"],
    image: growrise,
  },
  {
    title: "AI Leads",
    desc: "AI-powered lead generation platform with chatbot, dashboard and user management.",
    tags: ["React", "Node.js", "MongoDB", "n8n"],
    image: Aileads,
  },
  {
    title: "Portfolio Website",
    desc: "This portfolio website you're viewing now. Built with React, TypeScript and Tailwind.",
    tags: ["React", "TypeScript", "Tailwind"],
    image: portfolio,
  },
];

export default function Projects() {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const grid = gridRef.current;

    if (!grid) return;

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
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      /* =====================================================
         STAGGERED SCROLL REVEAL
      ===================================================== */

      gsap.set(cards, { transformPerspective: 900 });

      gsap.from(cards, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          once: true,
        },
      });

      /* =====================================================
         PER-CARD INTERACTION — 3D tilt, image parallax,
         cursor-follow glow
      ===================================================== */

      const cardCleanups: Array<() => void> = [];

      cards.forEach((card, index) => {
        const image = imageRefs.current[index];

        // quickTo — one reusable tween per property, the
        // performant way to drive animation from mousemove
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

        const setImageX = image
          ? gsap.quickTo(image, "x", { duration: 0.6, ease: "power3.out" })
          : null;
        const setImageY = image
          ? gsap.quickTo(image, "y", { duration: 0.6, ease: "power3.out" })
          : null;

        const handleMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;

          const maxTilt = 5;
          setRotateY((px - 0.5) * maxTilt * 2);
          setRotateX(-(py - 0.5) * maxTilt * 2);

          setImageX?.((px - 0.5) * 12);
          setImageY?.((py - 0.5) * 12);

          // cursor-follow glow, driven by CSS vars — no re-render,
          // no extra tween
          card.style.setProperty("--mx", `${px * 100}%`);
          card.style.setProperty("--my", `${py * 100}%`);
        };

        const enter = () => {
          setLiftY(-6);
        };

        const leave = () => {
          setRotateX(0);
          setRotateY(0);
          setLiftY(0);
          setImageX?.(0);
          setImageY?.(0);
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

      return () => {
        cardCleanups.forEach((cleanup) => cleanup());
      };
    }, grid);

    return () => {
      ctx.revert();
    };
  }, []);

  const setCardRef =
    (index: number) =>
    (element: HTMLDivElement | null) => {
      cardRefs.current[index] = element;
    };

  const setImageRef =
    (index: number) =>
    (element: HTMLImageElement | null) => {
      imageRefs.current[index] = element;
    };

  return (
    <section
      id="projects"
      className="bg-[#05070f] border-b border-white/5"
    >
      {/* Scoped styles for the idle border-glow pulse and the
          cursor-follow spotlight — kept local to this component */}
      <style>{`
        .project-card {
          animation: projectBorderPulse 7s ease-in-out infinite;
          will-change: transform;
        }
        .project-card:hover {
          animation-play-state: paused;
          border-color: rgba(96, 165, 250, 0.35);
        }
        @keyframes projectBorderPulse {
          0%, 100% { border-color: rgba(255, 255, 255, 0.1); }
          50% { border-color: rgba(59, 130, 246, 0.2); }
        }
        .project-card-glow {
          background: radial-gradient(
            220px circle at var(--mx, 50%) var(--my, 50%),
            rgba(96, 165, 250, 0.16),
            transparent 70%
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .project-card {
            animation: none;
          }
        }
      `}</style>

      <div className="max-w-[1280px] mx-auto px-6 py-20">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="inline-block text-[12px] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1.5 rounded-full mb-5">
              Featured Projects
            </span>

            <h2 className="text-white text-[32px] font-bold leading-tight mb-3">
              My Recent Projects
            </h2>

            <p className="text-gray-400 text-[15px] max-w-[440px]">
              Here are some of the projects I&apos;ve worked on. Each project
              helped me sharpen my skills and solve real-world problems.
            </p>
          </div>

          <a
            href="#"
            className="text-blue-400 text-[14px] font-medium hover:text-blue-300 transition-colors whitespace-nowrap"
          >
            View All Projects →
          </a>
        </div>

        {/* Projects Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {projects.map((project, index) => (
            <div
              key={project.title}
              ref={setCardRef(index)}
              style={
                {
                  "--mx": "50%",
                  "--my": "50%",
                } as React.CSSProperties
              }
              className="project-card group/card relative bg-[#0c0f1a] border border-white/10 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.35)] cursor-pointer flex flex-col"
            >
              {/* Cursor-follow spotlight glow */}
              <div
                className="project-card-glow pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                aria-hidden
              />

              {/* Project Preview */}
              <div className="relative z-10 h-36 overflow-hidden">
                <img
                  ref={setImageRef(index)}
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070f]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
              </div>

              {/* Project Content */}
              <div className="relative z-10 p-5 flex flex-col flex-1">
                <h3 className="text-white text-[15px] font-semibold mb-2">
                  {project.title}
                </h3>

                <p className="text-gray-400 text-[12px] leading-relaxed mb-4 flex-1">
                  {project.desc}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-gray-300 bg-white/5 border border-white/10 px-2 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Project Links — settle in a touch on card hover */}
                <div className="flex items-center gap-4 text-[12px] opacity-90 translate-y-0.5 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:translate-y-0">
                  <a
                    href="#"
                    className="group/live flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Live Demo
                    <ExternalLink
                      size={12}
                      className="transition-transform duration-300 group-hover/live:translate-x-0.5"
                    />
                  </a>

                  <a
                    href="#"
                    className="group/gh flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                  >
                    GitHub
                    <FaGithub
                      size={12}
                      className="transition-transform duration-300 group-hover/gh:translate-x-0.5"
                    />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}