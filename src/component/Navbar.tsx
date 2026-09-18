import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { gsap, useGSAP, ScrollTrigger } from "../lib/gsap";
import logo from "../assets/logo.png";

const navLinks = [
  "Home",
  "About",
  "Skills",
  "Projects",
  "Services",
  "Experience",
  "Contact",
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Glass effect on scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Navbar entrance animation
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.6,
      })
        .from(
          logoRef.current,
          {
            opacity: 0,
            x: -15,
            duration: 0.5,
          },
          "-=0.35"
        )
        .from(
          linksRef.current
            ? Array.from(linksRef.current.children).filter(
                (child) => child.tagName === "LI"
              )
            : [],
          {
            opacity: 0,
            y: -10,
            duration: 0.4,
            stagger: 0.06,
          },
          "-=0.3"
        )
        .from(
          ctaRef.current,
          {
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
          },
          "-=0.25"
        );
    },
    {
      scope: headerRef,
    }
  );

  // Scroll spy
  useGSAP(() => {
    const triggers = navLinks.map((link, index) => {
      const id = link.toLowerCase();
      const el = document.getElementById(id);

      if (!el) return null;

      return ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",

        onEnter: () => {
          setActiveIndex(index);
        },

        onEnterBack: () => {
          setActiveIndex(index);
        },
      });
    });

    return () => {
      triggers.forEach((trigger) => trigger?.kill());
    };
  }, []);

  // Active underline animation
  useGSAP(() => {
    const updateIndicator = () => {
      const activeLink = linkRefs.current[activeIndex];
      const list = linksRef.current;
      const indicator = indicatorRef.current;

      if (!activeLink || !list || !indicator) return;

      const linkRect = activeLink.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();

      gsap.to(indicator, {
        x: linkRect.left - listRect.left,
        width: linkRect.width,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    // Initial position
    updateIndicator();

    // Update on resize
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeIndex]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full backdrop-blur-xl border-b transition-all duration-500 ${
        scrolled
          ? "bg-[#05070f]/95 border-white/10 shadow-lg shadow-black/20"
          : "bg-[#05070f]/70 border-white/5"
      }`}
    >
      <nav
        className={`max-w-[1280px] mx-auto px-6 transition-all duration-500 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            ref={logoRef}
            href="#home"
            className="flex items-center gap-3 group"
            onClick={() => {
              setIsOpen(false);
              setActiveIndex(0);
            }}
          >
            <div className="relative w-10 h-10 shrink-0">
              <div className="absolute inset-0 rounded-lg bg-blue-500/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <img
                src={logo}
                alt="Akash Khan logo"
                className="relative w-10 h-10 rounded-lg object-cover ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105 group-hover:ring-blue-400/50"
              />
            </div>

            <div className="leading-tight">
              <p className="text-white font-semibold text-[15px]">
                Akash <span className="text-blue-500">Khan</span>
              </p>

              <p className="text-gray-400 text-[11px]">
                Full Stack Developer &amp; AI Automation Specialist
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <ul
            ref={linksRef}
            className="relative hidden lg:flex items-center gap-7 pb-2 text-[14px] text-gray-400"
          >
            {/* Active underline */}
            <span
              ref={indicatorRef}
              className="absolute bottom-0 left-0 h-[2px] bg-blue-500 rounded-full pointer-events-none"
              style={{
                width: 0,
              }}
            />

            {navLinks.map((link, index) => {
              const href = `#${link.toLowerCase()}`;

              return (
                <li key={link}>
                  <a
                    ref={(el) => {
                      linkRefs.current[index] = el;
                    }}
                    href={href}
                    onClick={() => {
                      setActiveIndex(index);
                    }}
                    className={`relative py-2 transition-colors duration-300 hover:text-white ${
                      activeIndex === index ? "text-white" : ""
                    }`}
                  >
                    {link}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <a
            ref={ctaRef}
            href="#contact"
            className="hidden lg:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium px-4 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 group"
          >
            Let's Work Together

            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <span
              className={`transition-transform duration-300 ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
            >
              {isOpen ? <X size={21} /> : <Menu size={21} />}
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isOpen
              ? "max-h-[500px] opacity-100 mt-5"
              : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-1 pb-4">
            {navLinks.map((link, index) => {
              const href = `#${link.toLowerCase()}`;

              return (
                <li
                  key={link}
                  className="transition-all duration-300"
                  style={{
                    transitionDelay: isOpen
                      ? `${index * 40}ms`
                      : "0ms",

                    opacity: isOpen ? 1 : 0,

                    transform: isOpen
                      ? "translateX(0)"
                      : "translateX(-8px)",
                  }}
                >
                  <a
                    href={href}
                    onClick={() => {
                      setIsOpen(false);
                      setActiveIndex(index);
                    }}
                    className={`block px-4 py-3 rounded-lg text-[14px] transition-all duration-300 ${
                      activeIndex === index
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile CTA */}
          <a
            href="#contact"
            onClick={() => {
              setIsOpen(false);
              setActiveIndex(navLinks.indexOf("Contact"));
            }}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium px-4 py-3 rounded-full transition-all duration-300"
          >
            Let's Work Together

            <ArrowRight size={15} />
          </a>
        </div>
      </nav>
    </header>
  );
}