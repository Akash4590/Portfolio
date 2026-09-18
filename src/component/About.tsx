import { useEffect, useRef } from "react";
import { Monitor, Braces, Workflow, Puzzle } from "lucide-react";
import { gsap } from "gsap";
import about from "../assets/about.png";

const points = [
  {
    icon: Monitor,
    title: "Web Development",
    subtitle: "(Frontend & Backend)",
  },
  {
    icon: Braces,
    title: "API Integration",
    subtitle: "(REST & Third-party)",
  },
  {
    icon: Workflow,
    title: "Automation",
    subtitle: "(n8n Workflows)",
  },
  {
    icon: Puzzle,
    title: "Problem Solver",
    subtitle: "(Fast Learner)",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const highlightBgRef = useRef<HTMLSpanElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);

  const pointsCardRef = useRef<HTMLDivElement>(null);
  const pointRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const floatBadgeTopRef = useRef<HTMLDivElement>(null);
  const floatBadgeBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      /* =================================================
         CONNECTING LINE — measure path length up front
      ================================================= */

      const linePath = linePathRef.current;
      const pathLength = linePath ? linePath.getTotalLength() : 0;

      if (linePath) {
        gsap.set(linePath, {
          strokeDasharray: pathLength,
          strokeDashoffset: reduceMotion ? 0 : pathLength,
        });
      }

      if (reduceMotion) {
        gsap.set(
          [
            badgeRef.current,
            headingRef.current,
            paragraphRef.current,
            buttonRef.current,
            pointsCardRef.current,
            imageWrapRef.current,
            quoteRef.current,
            floatBadgeTopRef.current,
            floatBadgeBottomRef.current,
          ],
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          }
        );

        gsap.set(highlightBgRef.current, { scaleX: 1 });

        return;
      }

      /* =================================================
         INITIAL STATE
      ================================================= */

      gsap.set(
        [
          badgeRef.current,
          headingRef.current,
          paragraphRef.current,
          buttonRef.current,
          pointsCardRef.current,
          imageWrapRef.current,
          quoteRef.current,
        ],
        {
          opacity: 0,
        }
      );

      gsap.set(badgeRef.current, {
        y: 20,
      });

      gsap.set(headingRef.current, {
        y: 35,
      });

      gsap.set(highlightBgRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      gsap.set(paragraphRef.current, {
        y: 25,
      });

      gsap.set(buttonRef.current, {
        y: 20,
        scale: 0.95,
      });

      gsap.set(pointsCardRef.current, {
        x: 40,
        scale: 0.96,
      });

      gsap.set(imageWrapRef.current, {
        x: 50,
        scale: 0.94,
      });

      gsap.set(quoteRef.current, {
        y: 15,
      });

      gsap.set([floatBadgeTopRef.current, floatBadgeBottomRef.current], {
        opacity: 0,
        scale: 0.8,
      });

      /* =================================================
         MAIN REVEAL
      ================================================= */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
      })
        .to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.25"
        )
        .to(
          highlightBgRef.current,
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "-=0.15"
        )
        .to(
          paragraphRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.45"
        )
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
          },
          "-=0.35"
        )
        .to(
          linePath,
          {
            strokeDashoffset: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          "-=0.4"
        )
        .to(
          pointsCardRef.current,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.75,
          },
          "-=0.7"
        )
        .to(
          imageWrapRef.current,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
          },
          "-=0.6"
        )
        .to(
          quoteRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.4"
        )
        .to(
          [floatBadgeTopRef.current, floatBadgeBottomRef.current],
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.15,
          },
          "-=0.3"
        );

      /* =================================================
         POINTS STAGGER
      ================================================= */

      pointRefs.current.forEach((point, index) => {
        if (!point) return;

        gsap.fromTo(
          point,
          {
            opacity: 0,
            x: -20,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            delay: 0.25 + index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              once: true,
            },
          }
        );
      });

      /* =================================================
         IMAGE FLOAT
      ================================================= */

      gsap.to(imageWrapRef.current, {
        y: -6,
        duration: 3.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1,
      });

      /* =================================================
         IMAGE SUBTLE ZOOM
      ================================================= */

      gsap.to(imageRef.current, {
        scale: 1.04,
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      /* =================================================
         AMBIENT GLOW BEHIND IMAGE
      ================================================= */

      gsap.to(glowRef.current, {
        opacity: 0.8,
        scale: 1.08,
        rotation: 8,
        duration: 4.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      /* =================================================
         FLOATING BADGES — slow, offset motion
      ================================================= */

      gsap.to(floatBadgeTopRef.current, {
        y: -8,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.3,
      });

      gsap.to(floatBadgeBottomRef.current, {
        y: 8,
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.6,
      });

      /* =================================================
         BUTTON HOVER
      ================================================= */

      const button = buttonRef.current;

      const buttonEnter = () => {
        gsap.to(button, {
          scale: 1.05,
          y: -2,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const buttonLeave = () => {
        gsap.to(button, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      button?.addEventListener("mouseenter", buttonEnter);
      button?.addEventListener("mouseleave", buttonLeave);

      /* =================================================
         POINT HOVER
      ================================================= */

      const pointCleanups: Array<() => void> = [];

      pointRefs.current.forEach((point) => {
        if (!point) return;

        const icon = point.querySelector(
          ".about-point-icon"
        );

        const enter = () => {
          gsap.to(point, {
            x: 5,
            duration: 0.25,
            ease: "power2.out",
          });

          gsap.to(icon, {
            scale: 1.12,
            rotation: 5,
            duration: 0.3,
            ease: "back.out(2)",
          });
        };

        const leave = () => {
          gsap.to(point, {
            x: 0,
            duration: 0.25,
            ease: "power2.out",
          });

          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        point.addEventListener("mouseenter", enter);
        point.addEventListener("mouseleave", leave);

        pointCleanups.push(() => {
          point.removeEventListener("mouseenter", enter);
          point.removeEventListener("mouseleave", leave);
        });
      });

      /* =================================================
         IMAGE MOUSE TILT / PARALLAX
      ================================================= */

      const imageCard = imageCardRef.current;

      const handleMouseMove = (event: MouseEvent) => {
        if (!imageCard || window.innerWidth < 768) return;

        const rect = imageCard.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(imageCard, {
          rotationY: x * 5,
          rotationX: -y * 5,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 800,
        });

        gsap.to(imageRef.current, {
          x: x * 10,
          y: y * 10,
          duration: 0.6,
          ease: "power2.out",
        });

        gsap.to(glowRef.current, {
          x: x * 18,
          y: y * 18,
          duration: 0.7,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(imageCard, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.7,
          ease: "power3.out",
        });

        gsap.to(imageRef.current, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        });

        gsap.to(glowRef.current, {
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      };

      imageCard?.addEventListener(
        "mousemove",
        handleMouseMove
      );

      imageCard?.addEventListener(
        "mouseleave",
        handleMouseLeave
      );

      /* =================================================
         CLEANUP
      ================================================= */

      return () => {
        button?.removeEventListener(
          "mouseenter",
          buttonEnter
        );

        button?.removeEventListener(
          "mouseleave",
          buttonLeave
        );

        pointCleanups.forEach((cleanup) => cleanup());

        imageCard?.removeEventListener(
          "mousemove",
          handleMouseMove
        );

        imageCard?.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-[#05070f] border-b border-white/5"
    >
      <div
        ref={gridRef}
        className="relative max-w-[1280px] mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* =================================================
            CONNECTING LINE — drawn between the two columns
        ================================================= */}

        <svg
          className="pointer-events-none absolute inset-0 hidden lg:block w-full h-full z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="aboutLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            ref={linePathRef}
            d="M 2,50 Q 50,30 98,50"
            stroke="url(#aboutLineGradient)"
            strokeWidth="0.6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* =================================================
            LEFT TEXT
        ================================================= */}

        <div className="relative z-10">
          <span
            ref={badgeRef}
            className="inline-block text-[12px] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1.5 rounded-full mb-5"
          >
            About Me
          </span>

          <h2
            ref={headingRef}
            className="text-white text-[32px] font-bold leading-tight mb-5 max-w-[420px]"
          >
            Turning Ideas Into{" "}
            <span className="relative inline-block">
              <span
                ref={highlightBgRef}
                className="absolute inset-x-0 bottom-0.5 h-[0.4em] bg-blue-500/25 rounded-sm -z-10"
              />
              Powerful Web Solutions
            </span>
          </h2>

          <p
            ref={paragraphRef}
            className="text-gray-400 text-[15px] leading-relaxed max-w-[440px] mb-8"
          >
            I&apos;m a full-stack developer with a passion for building
            modern web applications and automation systems. I love working
            with cutting-edge technologies, solving real-world problems and
            creating products that make a difference.
          </p>

          <a
            ref={buttonRef}
            href="/cv.pdf"
            download="Akash-Khan-CV.pdf"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white text-[14px] font-medium px-5 py-3 rounded-full"
          >
            Download CV
            <span aria-hidden>↓</span>
          </a>
        </div>

        {/* =================================================
            RIGHT CONTENT
        ================================================= */}

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Points Card */}

          <div
            ref={pointsCardRef}
            className="bg-[#0c0f1a] border border-white/10 rounded-2xl p-6 space-y-6"
          >
            {points.map(({ icon: Icon, title, subtitle }, index) => (
              <div
                key={title}
                ref={(element) => {
                  pointRefs.current[index] = element;
                }}
                className="flex items-center gap-3 cursor-default"
              >
                <div className="about-point-icon w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Icon size={18} />
                </div>

                <div>
                  <p className="text-white text-[13px] font-medium">
                    {title}
                  </p>

                  <p className="text-gray-500 text-[11px]">
                    {subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Image Card + ambient glow + floating badges */}

          <div ref={imageWrapRef} className="relative">
            {/* Ambient animated glow */}

            <div
              ref={glowRef}
              className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-blue-500/30 via-blue-400/10 to-transparent blur-2xl opacity-50 -z-10"
            />

            <div
              ref={imageCardRef}
              className="relative rounded-2xl overflow-hidden min-h-[260px] border border-white/10"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <img
                ref={imageRef}
                src={about}
                alt="Developer workspace"
                className="w-full h-full object-cover"
              />

              {/* Image overlay */}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070f]/50 via-transparent to-blue-500/5" />

              {/* Image shine */}

              <div className="pointer-events-none absolute -inset-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shine_5s_ease-in-out_infinite]" />

              <p
                ref={quoteRef}
                className="absolute bottom-4 right-5 text-gray-300 italic text-[12px] font-serif drop-shadow"
              >
                Better Code
                <br />
                Better Tomorrow
              </p>
            </div>

            {/* Floating badges */}

            <div
              ref={floatBadgeTopRef}
              className="hidden sm:flex items-center gap-1.5 absolute -top-5 -left-5 bg-[#0c0f1a]/90 backdrop-blur border border-white/10 rounded-full px-3 py-1.5 text-[11px] text-blue-300 shadow-lg shadow-black/30"
            >
              <Braces size={12} className="text-blue-400" />
              Clean Code
            </div>

            <div
              ref={floatBadgeBottomRef}
              className="hidden sm:flex items-center gap-1.5 absolute -bottom-5 -right-5 bg-[#0c0f1a]/90 backdrop-blur border border-white/10 rounded-full px-3 py-1.5 text-[11px] text-blue-300 shadow-lg shadow-black/30"
            >
              <Workflow size={12} className="text-blue-400" />
              Automated
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}