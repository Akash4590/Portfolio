import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import akash from "../assets/akash.png";

const techStack = [
  { name: "React", color: "text-cyan-400" },
  { name: "TypeScript", color: "text-blue-400" },
  { name: "Node.js", color: "text-green-500" },
  { name: "Express.js", color: "text-gray-300" },
  { name: "PostgreSQL", color: "text-sky-400" },
  { name: "n8n", color: "text-pink-500" },
];

const roles = [
  "Full Stack Developer",
  "AI Automation Specialist",
  "Frontend Developer",
  "Backend Developer",
];

// Fewer, larger, softer particles — a "premium minimal" background
// instead of 55 individually-animating stars (which reads busy/noisy
// and costs more on lower-end devices).
const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: `${Math.random() * 2 + 1}px`,
}));

/** Splits text into words, each masked by an overflow-hidden wrapper,
 *  so the inner word can slide up from below its own clip box.
 *  This is the "premium" reveal — a clean mask-wipe per word instead
 *  of a flat opacity fade. */
function MaskWord({ text, className = "" }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[2px] mr-[0.28em]">
          <span className={`reveal-word inline-block will-change-transform ${className}`}>
            {word}
          </span>
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const badgeRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null); // "Akash Khan" shimmer target

  const buttonsRowRef = useRef<HTMLDivElement>(null);
  const socialsRowRef = useRef<HTMLDivElement>(null);

  const visualRef = useRef<HTMLDivElement>(null);
  const techCardRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const secondaryBtnRef = useRef<HTMLButtonElement>(null);
  const primarySweepRef = useRef<HTMLSpanElement>(null);
  const secondarySweepRef = useRef<HTMLSpanElement>(null);
  const primaryArrowRef = useRef<HTMLSpanElement>(null);
  const secondaryArrowRef = useRef<HTMLSpanElement>(null);

  const socialLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [roleIndex, setRoleIndex] = useState(0);
  const reduceMotionRef = useRef(false);

  /* =====================================================
     ROLE TEXT — smooth blur/scale crossfade (subtitle)
  ===================================================== */
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!roleRef.current || reduceMotionRef.current) return;
      gsap.to(roleRef.current, {
        opacity: 0,
        y: -14,
        scale: 0.97,
        filter: "blur(6px)",
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => setRoleIndex((c) => (c + 1) % roles.length),
      });
    }, 2600);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!roleRef.current || reduceMotionRef.current) return;
    gsap.fromTo(
      roleRef.current,
      { opacity: 0, y: 16, scale: 0.97, filter: "blur(6px)" },
      { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }
    );
  }, [roleIndex]);

  /* =====================================================
     MAIN ANIMATIONS
  ===================================================== */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reduceMotionRef.current = reduceMotion;
    const isDesktop = window.innerWidth >= 768;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".reveal-word");

      if (reduceMotion) {
        gsap.set(
          [
            badgeRef.current,
            words,
            paraRef.current,
            buttonsRowRef.current,
            socialsRowRef.current,
            visualRef.current,
            techCardRef.current,
            labelRef.current,
            imageWrapRef.current,
          ],
          { opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" }
        );
        return;
      }

      /* ============== STAGGERED ENTRANCE ============== */
      // Headline + subtitle words mask-reveal up, then the rest follows.
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(badgeRef.current, { opacity: 0, y: -20, duration: 0.6 })
        .from(
          words,
          { yPercent: 110, opacity: 0, duration: 0.7, stagger: 0.045 },
          "-=0.25"
        )
        .from(paraRef.current, { opacity: 0, y: 16, duration: 0.6 }, "-=0.35")
        .from(
          buttonsRowRef.current ? Array.from(buttonsRowRef.current.children) : [],
          { opacity: 0, y: 16, scale: 0.96, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        )
        .from(
          socialsRowRef.current ? Array.from(socialsRowRef.current.children) : [],
          { opacity: 0, y: 10, duration: 0.4, stagger: 0.06 },
          "-=0.25"
        )
        .from(visualRef.current, { opacity: 0, x: 50, scale: 0.95, duration: 0.9 }, "-=0.8")
        .from(techCardRef.current, { opacity: 0, x: -18, y: -12, scale: 0.9, duration: 0.5 }, "-=0.5")
        .from(labelRef.current, { opacity: 0, x: 12, duration: 0.4 }, "-=0.28")
        .add(startAmbientLoops);

      /* =================================================
         AMBIENT LOOPS — subtle, minimal, always-on
      ================================================= */
      function startAmbientLoops() {
        // 1) Floating / parallax hero image — a slow vertical drift
        gsap.to(imageWrapRef.current, {
          y: -12,
          duration: 3.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // 2) Soft glow breathing behind the image (the "orbit" halo)
        gsap.to(glowRef.current, {
          scale: 1.15,
          opacity: 0.75,
          duration: 3.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // 3) Slow rotating gradient ring — the literal "orbit" path.
        //    A small dot lives inside it (see JSX) so it visibly orbits
        //    around the image as the ring spins.
        gsap.to(ringRef.current, {
          rotation: 360,
          duration: 16,
          ease: "none",
          repeat: -1,
        });

        // 4) Shimmer sweep across "Akash Khan" — moves the gradient's
        //    position instead of re-tinting text, so it reads as light
        //    glinting across the name rather than a color flash.
        if (nameRef.current) {
          gsap.set(nameRef.current, { backgroundSize: "200% 100%", backgroundPosition: "0% 0%" });
          gsap.to(nameRef.current, {
            backgroundPosition: "200% 0%",
            duration: 3.5,
            ease: "sine.inOut",
            repeat: -1,
            repeatDelay: 1.5,
          });
        }
      }

      /* =================================================
         5) CURSOR-REACTIVE BACKGROUND PARALLAX
         One lightweight transform on the whole particle field,
         easing toward the pointer — a "presence" effect rather
         than per-dot jitter. quickTo keeps it perf-friendly.
      ================================================= */
      let removeParallax: (() => void) | undefined;
      if (isDesktop && particlesRef.current) {
        const moveX = gsap.quickTo(particlesRef.current, "x", { duration: 0.9, ease: "power3.out" });
        const moveY = gsap.quickTo(particlesRef.current, "y", { duration: 0.9, ease: "power3.out" });

        const onSectionMove = (e: MouseEvent) => {
          const rect = section.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          moveX(relX * -24); // particles drift opposite the cursor = depth
          moveY(relY * -24);
        };
        section.addEventListener("mousemove", onSectionMove);
        removeParallax = () => section.removeEventListener("mousemove", onSectionMove);
      }

      /* ============== IMAGE MOUSE TILT ============== */
      const imageWrap = imageWrapRef.current;
      const handleMouseMove = (event: MouseEvent) => {
        if (!imageWrap) return;
        const rect = imageWrap.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        gsap.to(imageRef.current, {
          rotationY: x * 7,
          rotationX: -y * 7,
          scale: 1.02,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 800,
        });
      };
      const handleMouseLeave = () => {
        gsap.to(imageRef.current, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.7, ease: "power3.out" });
      };
      if (isDesktop) {
        imageWrap?.addEventListener("mousemove", handleMouseMove);
        imageWrap?.addEventListener("mouseleave", handleMouseLeave);
      }

      /* =================================================
         6) BUTTONS — sweep-fill color + magnetic pull + arrow slide
      ================================================= */
      const setupButton = (
        btn: HTMLButtonElement | null,
        sweep: HTMLSpanElement | null,
        arrow: HTMLSpanElement | null
      ) => {
        if (!btn || !sweep) return;
        gsap.set(sweep, { scaleX: 0, transformOrigin: "left center" });

        const magX = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
        const magY = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });

        const enter = () => {
          gsap.to(sweep, { scaleX: 1, duration: 0.4, ease: "power3.out" });
          gsap.to(btn, { scale: 1.03, duration: 0.3, ease: "power2.out" });
          if (arrow) gsap.to(arrow, { x: 5, duration: 0.35, ease: "power2.out" });
        };
        const leave = () => {
          gsap.to(sweep, {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.35,
            ease: "power3.in",
            onComplete: () => gsap.set(sweep, { transformOrigin: "left center" }),
          });
          gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
          if (arrow) gsap.to(arrow, { x: 0, duration: 0.35, ease: "power2.out" });
          magX(0);
          magY(0);
        };
        // Magnetic pull — button nudges toward the cursor within its
        // own bounds (kept subtle: max ~8px) while hovered.
        const move = (e: MouseEvent) => {
          if (!isDesktop) return;
          const rect = btn.getBoundingClientRect();
          const relX = e.clientX - rect.left - rect.width / 2;
          const relY = e.clientY - rect.top - rect.height / 2;
          magX(relX * 0.25);
          magY(relY * 0.35);
        };

        btn.addEventListener("mouseenter", enter);
        btn.addEventListener("mousemove", move);
        btn.addEventListener("mouseleave", leave);
        return () => {
          btn.removeEventListener("mouseenter", enter);
          btn.removeEventListener("mousemove", move);
          btn.removeEventListener("mouseleave", leave);
        };
      };

      const removePrimary = setupButton(primaryBtnRef.current, primarySweepRef.current, primaryArrowRef.current);
      const removeSecondary = setupButton(secondaryBtnRef.current, secondarySweepRef.current, secondaryArrowRef.current);

      /* ============== SOCIAL ICON HOVER ============== */
      const socialColors = ["#ffffff", "#0A66C2", "#ffffff", "#f97316"];
      const socialCleanups: Array<() => void> = [];
      socialLinkRefs.current.forEach((link, index) => {
        if (!link) return;
        const enter = () => gsap.to(link, { y: -4, scale: 1.2, color: socialColors[index], duration: 0.3, ease: "back.out(2)" });
        const leave = () => gsap.to(link, { y: 0, scale: 1, color: "#9ca3af", duration: 0.3, ease: "power2.out" });
        link.addEventListener("mouseenter", enter);
        link.addEventListener("mouseleave", leave);
        socialCleanups.push(() => {
          link.removeEventListener("mouseenter", enter);
          link.removeEventListener("mouseleave", leave);
        });
      });

      return () => {
        imageWrap?.removeEventListener("mousemove", handleMouseMove);
        imageWrap?.removeEventListener("mouseleave", handleMouseLeave);
        removePrimary?.();
        removeSecondary?.();
        removeParallax?.();
        socialCleanups.forEach((cleanup) => cleanup());
      };
    }, section);

    return () => ctx.revert();
  }, []);

  const setSocialRef = (index: number) => (element: HTMLAnchorElement | null) => {
    socialLinkRefs.current[index] = element;
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative bg-[#05070f] overflow-hidden border-b border-white/5"
    >
      {/* CURSOR-REACTIVE PARTICLES (subtle depth, not busy) */}
      <div ref={particlesRef} className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, opacity: 0.25 }}
          />
        ))}
      </div>

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute right-0 top-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute right-40 top-40 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />

      <div className="relative max-w-[1280px] mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-6">
        {/* LEFT CONTENT */}
        <div className="flex-1 w-full">
          <span
            ref={badgeRef}
            className="inline-flex items-center gap-2 text-[12px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full mb-6"
          >
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            Available for new projects
          </span>

          <h1 ref={headingRef} className="text-white text-[40px] sm:text-[48px] font-bold leading-[1.15] mb-2">
            <MaskWord text="Hi, I'm Akash" />
            <span
              ref={nameRef}
              className="bg-gradient-to-r from-blue-500 via-purple-400 to-blue-500 bg-clip-text text-transparent"
            >
              <MaskWord text="Akash Khan" />
            </span>
          </h1>

          {/* fixed min-height avoids layout jump while role text crossfades */}
          <h2
            ref={roleRef}
            className="text-white text-[28px] sm:text-[34px] font-bold leading-[1.2] mb-6 min-h-[1.2em]"
          >
            <MaskWord text={roles[roleIndex]} />
          </h2>

          <p ref={paraRef} className="text-gray-400 text-[15px] leading-relaxed max-w-[480px] mb-8">
            I build modern, scalable web applications and automation
            systems using React, TypeScript, Node.js, Express, MongoDB,
            PostgreSQL and n8n. I turn ideas into real products that help
            businesses grow.
          </p>

          {/* BUTTONS */}
          <div ref={buttonsRowRef} className="flex items-center gap-4 mb-8">
           <button
  ref={primaryBtnRef}
  onClick={() => {
    document.getElementById("projects")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }}
  className="relative overflow-hidden isolate flex items-center gap-2 bg-blue-600 text-white text-[14px] font-medium px-5 py-3 rounded-full cursor-pointer"
>
  <span
    ref={primarySweepRef}
    className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500 to-blue-400"
  />

  View My Projects

  <span
    ref={primaryArrowRef}
    aria-hidden
    className="inline-block will-change-transform"
  >
    →
  </span>
</button>

            <button
              ref={secondaryBtnRef}
              className="relative overflow-hidden isolate flex items-center gap-2 border border-white/15 text-white text-[14px] font-medium px-5 py-3 rounded-full"
            >
              <span ref={secondarySweepRef} className="absolute inset-0 -z-10 bg-white/10" />
              Let&apos;s Talk
              <span ref={secondaryArrowRef} aria-hidden className="inline-block will-change-transform">→</span>
            </button>
          </div>

          {/* SOCIAL ICONS */}
          <div ref={socialsRowRef} className="flex items-center gap-4 text-gray-400">
            <a ref={setSocialRef(0)} href="#" aria-label="GitHub" className="transition-colors">
              <FaGithub size={18} />
            </a>
            <a ref={setSocialRef(1)} href="#" aria-label="LinkedIn" className="transition-colors">
              <FaLinkedin size={18} />
            </a>
            <a ref={setSocialRef(2)} href="#" aria-label="Twitter" className="transition-colors">
              <FaXTwitter size={18} />
            </a>
            <a ref={setSocialRef(3)} href="#" aria-label="Email" className="transition-colors">
              <FaEnvelope size={18} />
            </a>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div ref={visualRef} className="relative shrink-0 flex justify-center">
          <div
            ref={glowRef}
            className="pointer-events-none absolute left-[105px] top-[55px] z-0 w-[300px] h-[300px] rounded-full bg-blue-500/20 blur-[80px]"
          />

          {/* Orbit ring + a small dot fixed to its edge, so the dot
              visibly travels around the image as the ring rotates. */}
          <div
            ref={ringRef}
            className="pointer-events-none absolute z-[5] left-[98px] top-[48px] w-[324px] h-[324px] rounded-full border border-transparent opacity-70"
            style={{
              background:
                "linear-gradient(#05070f, #05070f) padding-box, linear-gradient(135deg, rgba(59,130,246,.7), rgba(168,85,247,.6), transparent, rgba(59,130,246,.7)) border-box",
            }}
          >
            <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-blue-400 shadow-[0_0_8px_2px_rgba(59,130,246,0.8)]" />
          </div>

          <div
            ref={techCardRef}
            className="absolute left-0 top-0 z-20 w-[130px] bg-[#0c0f1a]/90 backdrop-blur border border-white/10 rounded-xl p-4 shadow-xl"
          >
            <p className="text-gray-400 text-[11px] font-medium mb-3">Tech Stack</p>
            <ul className="space-y-2.5">
              {techStack.map((tech) => (
                <li key={tech.name} className="flex items-center gap-2 text-[12px] text-gray-200">
                  <span className={`w-2 h-2 rounded-full bg-current ${tech.color}`} />
                  {tech.name}
                </li>
              ))}
            </ul>
          </div>

          <p
            ref={labelRef}
            className="hidden sm:block absolute -top-2 right-2 z-20 text-gray-400 italic text-[13px] leading-tight font-serif"
          >
            Code
            <br />
            Build
            <br />
            Create
          </p>

          <div ref={imageWrapRef} className="relative z-10 w-[300px] sm:w-[340px] h-[360px] ml-[110px] rounded-2xl">
            <div
              ref={imageRef}
              className="relative w-full h-full rounded-2xl overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img src={akash} alt="Akash Khan" className="w-full h-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070f]/30 via-transparent to-blue-500/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}