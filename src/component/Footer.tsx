import { useEffect, useRef } from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const links = ["Home", "About", "Skills", "Projects", "Services", "Experience", "Contact"];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;

    if (!footer) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(
          [logoRef.current, navRef.current, socialRef.current, bottomBarRef.current],
          { opacity: 1, y: 0 }
        );
        return;
      }

      gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: footer,
          start: "top 95%",
          once: true,
        },
      })
        .from(logoRef.current, { opacity: 0, y: 14, duration: 0.5 })
        .from(navRef.current, { opacity: 0, y: 14, duration: 0.5 }, "-=0.35")
        .from(socialRef.current, { opacity: 0, y: 14, duration: 0.5 }, "-=0.35")
        .from(bottomBarRef.current, { opacity: 0, duration: 0.5 }, "-=0.2");

      const logo = logoRef.current?.querySelector<HTMLElement>("[data-logo-badge]");

      const logoEnter = () => {
        if (!logo) return;
        gsap.to(logo, {
          rotate: -6,
          scale: 1.08,
          duration: 0.35,
          ease: "back.out(2)",
        });
      };

      const logoLeave = () => {
        if (!logo) return;
        gsap.to(logo, { rotate: 0, scale: 1, duration: 0.35, ease: "power2.out" });
      };

      logo?.addEventListener("mouseenter", logoEnter);
      logo?.addEventListener("mouseleave", logoLeave);

      return () => {
        logo?.removeEventListener("mouseenter", logoEnter);
        logo?.removeEventListener("mouseleave", logoLeave);
      };
    }, footer);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#05070f]">
      {/* Scoped styles: animated nav underline, per-icon social glow,
          and the heartbeat pulse — kept local to this component */}
      <style>{`
        .footer-nav-link {
          position: relative;
        }
        .footer-nav-link::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -4px;
          width: 0%;
          height: 1px;
          background: #60a5fa;
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }
        .footer-nav-link:hover::after {
          width: 100%;
        }

        .footer-social-icon {
          transition: transform 0.25s ease, color 0.25s ease, filter 0.25s ease;
        }
        .footer-social-icon:hover {
          transform: translateY(-3px);
          filter: drop-shadow(0 0 8px var(--glow-color, rgba(255, 255, 255, 0.4)));
        }

        @keyframes footerHeartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.25); }
          30% { transform: scale(1); }
          45% { transform: scale(1.2); }
          60% { transform: scale(1); }
        }
        .footer-heart {
          display: inline-block;
          animation: footerHeartbeat 2.4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-heart {
            animation: none;
          }
          .footer-nav-link::after {
            transition: none;
          }
        }
      `}</style>

      <div className="max-w-[1280px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div ref={logoRef} className="flex items-center gap-3">
          <div
            data-logo-badge
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[12px] cursor-pointer"
          >
            AK
          </div>
          <div className="leading-tight">
            <p className="text-white font-semibold text-[14px]">
              Akash <span className="text-blue-500">Khan</span>
            </p>
            <p className="text-gray-400 text-[10px]">Full Stack Developer &amp; AI Automation Specialist</p>
          </div>
        </div>

        <ul ref={navRef} className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-gray-400">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="footer-nav-link hover:text-white transition-colors">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div ref={socialRef} className="flex items-center gap-4 text-gray-400">
          <a
            href="https://github.com/Akash4590"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="footer-social-icon hover:text-white transition-colors"
            style={{ "--glow-color": "rgba(255,255,255,0.45)" } as React.CSSProperties}
          >
            <FaGithub size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/akashkhan-dev"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="footer-social-icon hover:text-white transition-colors"
            style={{ "--glow-color": "rgba(56,189,248,0.55)" } as React.CSSProperties}
          >
            <FaLinkedin size={16} />
          </a>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=akashjaved4590@gmail.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Email"
            className="footer-social-icon hover:text-white transition-colors"
            style={{ "--glow-color": "rgba(96,165,250,0.55)" } as React.CSSProperties}
          >
            <FaEnvelope size={16} />
          </a>
        </div>
      </div>

      <div ref={bottomBarRef} className="border-t border-white/5">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-gray-500 text-[12px]">
          <p>© 2025 Akash Khan. All rights reserved.</p>
          <p>
            Build with <span className="footer-heart text-red-500">♥</span> and a lot of coffee
          </p>
        </div>
      </div>
    </footer>
  );
}