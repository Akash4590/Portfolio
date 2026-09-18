import { useEffect, useRef, useState } from "react";
import { Users, FileCheck, Smile, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

const stats: Stat[] = [
  { icon: Users, value: "0-1", label: "Years Experience" },
  { icon: FileCheck, value: "5+", label: "Projects Completed" },
  { icon: Smile, value: "100%", label: "Client Satisfaction" },
  { icon: Clock, value: "100%", label: "On-Time Delivery" },
];

// Splits a value like "100%" or "0-1" into a static prefix, the final
// number to count up to, and a static suffix — e.g. "0-1" -> ["0-", 1, ""]
function parseValue(value: string) {
  const match = value.match(/(\d+)(?!.*\d)/);
  if (!match || match.index === undefined) {
    return { prefix: "", target: null as number | null, suffix: value };
  }
  const prefix = value.slice(0, match.index);
  const suffix = value.slice(match.index + match[1].length);
  return { prefix, target: parseInt(match[1], 10), suffix };
}

// Smooth "ease out" curve — fast start, gentle settle
function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function useCountUp(target: number | null, active: boolean, duration = 1400) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || target === null) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, target, duration]);

  return count;
}

function StatCard({
  icon: Icon,
  value,
  label,
  index,
  inView,
}: Stat & { index: number; inView: boolean }) {
  const { prefix, target, suffix } = parseValue(value);
  // Slight per-card delay so the count-up starts after the card has
  // finished its entrance animation
  const delay = index * 130;
  const [countActive, setCountActive] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setCountActive(true), delay + 200);
    return () => clearTimeout(t);
  }, [inView, delay]);

  const count = useCountUp(target, countActive);
  const display = target === null ? value : `${prefix}${count}${suffix}`;

  return (
    <div
      className="group flex items-center gap-3 rounded-xl px-3 py-2 -mx-3 -my-2 transition-all duration-500 ease-out will-change-transform hover:-translate-y-1 hover:bg-white/[0.03] hover:shadow-[0_8px_30px_-8px_rgba(59,130,246,0.35)]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transitionProperty: "opacity, transform",
        transitionDuration: "700ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <span className="relative flex items-center justify-center shrink-0">
        <span className="absolute inset-0 rounded-full bg-blue-500/0 blur-md transition-all duration-500 group-hover:bg-blue-500/30" />
        <Icon
          className="relative text-blue-500 transition-transform duration-500 ease-out group-hover:scale-110"
          size={22}
        />
      </span>
      <div>
        <p className="text-white text-[20px] font-bold leading-tight tabular-nums">
          {display}
        </p>
        <p className="text-gray-400 text-[13px]">{label}</p>
      </div>
    </div>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#05070f] border-b border-white/5">
      <div
        ref={sectionRef}
        className="max-w-[1280px] mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8"
      >
        {stats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} index={index} inView={inView} />
        ))}
      </div>
    </section>
  );
}