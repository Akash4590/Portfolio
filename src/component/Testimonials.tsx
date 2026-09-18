import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import sheraz from "../assets/sheraz.png";
import mohsin from "../assets/mohsin.jpg";
import akash from "../assets/akash.png";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "Akash delivered an amazing e-commerce store for our business. The design was smooth and the quality was top-notch. Highly recommended!",
    name: "Akash javed",
    role: "Business Owner",
    image: akash,
  },
  {
    quote:
      "Professional, skilled and easy to work with. He built our agency website exactly how we imagined. Would definitely hire again!",
    name: "M sheraz",
    role: "Founder, Grow Rise",
    image: sheraz,
  },
  {
    quote:
      "Great developer! He integrated n8n workflows and automated our processes perfectly. The code is clean and well-structured.",
    name: "Mohsin",
    role: "CTO, TechGear",
    image: mohsin,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const starGroupRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      const starGroups = starGroupRefs.current.filter(
        (group): group is HTMLDivElement => group !== null
      );
      const allStars = starGroups.flatMap((group) =>
        Array.from(group.querySelectorAll("svg"))
      );

      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      if (reduceMotion) {
        gsap.set(
          [badgeRef.current, headingRef.current, paraRef.current, ...cards, ...allStars],
          { opacity: 1, x: 0, y: 0, scale: 1 }
        );
        return;
      }

      /* =====================================================
         HEADER REVEAL
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
         CARDS — staggered scroll reveal, then stars pop in
      ===================================================== */

      gsap.set(cards, { transformPerspective: 900 });
      gsap.set(allStars, { scale: 0, transformOrigin: "center" });

      const cardsTl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 82%",
          once: true,
        },
      });

      cardsTl
        .from(cards, {
          opacity: 0,
          y: 30,
          scale: 0.95,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.12,
        })
        .to(
          allStars,
          {
            scale: 1,
            duration: 0.35,
            ease: "back.out(3)",
            stagger: {
              each: 0.05,
              from: "start",
              grid: [starGroups.length, 5],
            },
          },
          "-=0.35"
        );

      /* =====================================================
         CARD HOVER — 3D tilt, lift, cursor-follow glow, avatar pop
      ===================================================== */

      const cardCleanups: Array<() => void> = [];

      cards.forEach((card) => {
        const avatar = card.querySelector<HTMLElement>("[data-avatar]");

        const setRotateX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
        const setRotateY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
        const setLiftY = gsap.quickTo(card, "y", { duration: 0.4, ease: "power3.out" });

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
          setLiftY(-5);

          if (avatar) {
            gsap.to(avatar, { scale: 1.12, duration: 0.3, ease: "back.out(2)" });
          }
        };

        const leave = () => {
          setLiftY(0);
          setRotateX(0);
          setRotateY(0);

          if (avatar) {
            gsap.to(avatar, { scale: 1, duration: 0.3, ease: "power2.out" });
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

      return () => {
        cardCleanups.forEach((cleanup) => cleanup());
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

  const setStarGroupRef =
    (index: number) =>
    (element: HTMLDivElement | null) => {
      starGroupRefs.current[index] = element;
    };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#05070f] border-b border-white/5"
    >
      {/* Scoped styles: ambient drifting background and the
          cursor-follow spotlight — kept local to this component */}
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
        .testimonials-bg-orb-1 { animation: bgOrbDriftOne 18s ease-in-out infinite; }
        .testimonials-bg-orb-2 { animation: bgOrbDriftTwo 22s ease-in-out infinite; }
        .testimonials-bg-grid {
          background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          animation: bgGridDrift 40s linear infinite;
        }
        .testimonial-card {
          animation: testimonialBorderPulse 7s ease-in-out infinite;
          will-change: transform;
        }
        .testimonial-card:hover {
          animation-play-state: paused;
          border-color: rgba(96, 165, 250, 0.35);
        }
        @keyframes testimonialBorderPulse {
          0%, 100% { border-color: rgba(255, 255, 255, 0.1); }
          50% { border-color: rgba(59, 130, 246, 0.2); }
        }
        .testimonial-card-glow {
          background: radial-gradient(
            220px circle at var(--mx, 50%) var(--my, 50%),
            rgba(96, 165, 250, 0.15),
            transparent 70%
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .testimonials-bg-orb-1, .testimonials-bg-orb-2, .testimonials-bg-grid, .testimonial-card {
            animation: none;
          }
        }
      `}</style>

      {/* Ambient animated background — purely decorative, behind all content */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="testimonials-bg-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="testimonials-bg-orb-1 absolute -top-20 left-1/4 w-[380px] h-[380px] rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="testimonials-bg-orb-2 absolute -bottom-24 right-1/4 w-[340px] h-[340px] rounded-full bg-purple-500/8 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-20">
        <span
          ref={badgeRef}
          className="inline-block text-[12px] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1.5 rounded-full mb-5"
        >
          Testimonials
        </span>
        <h2 ref={headingRef} className="text-white text-[32px] font-bold leading-tight mb-3">
          What Clients Say
        </h2>
        <p ref={paraRef} className="text-gray-400 text-[15px] max-w-[480px] mb-10">
          Don&apos;t just take my word for it. Here&apos;s what some of my
          clients have to say about working with me.
        </p>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={t.name}
              ref={setCardRef(index)}
              style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
              className="testimonial-card group relative overflow-hidden bg-[#0c0f1a] border border-white/10 rounded-2xl p-6 cursor-default transition-shadow duration-300 hover:shadow-[0_16px_50px_-15px_rgba(59,130,246,0.3)]"
            >
              {/* Cursor-follow spotlight glow */}
              <div
                className="testimonial-card-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />

              <p className="relative z-10 text-gray-300 text-[13px] leading-relaxed italic mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="relative z-10 flex items-center gap-3">
                <img
                  data-avatar
                  src={t.image}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-white text-[13px] font-medium">{t.name}</p>
                  <p className="text-gray-500 text-[11px]">{t.role}</p>
                </div>
                <div ref={setStarGroupRef(index)} className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}