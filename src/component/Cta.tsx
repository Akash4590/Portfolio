import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState("");
  const [resultType, setResultType] = useState<"success" | "error" | "">("");

  /* =====================================================
     WEB3FORMS SUBMIT
  ===================================================== */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsSubmitting(true);
    setResult("");
    setResultType("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Web3Forms Access Key
    formData.append(
      "access_key",
      "80386be6-e69e-4334-bed2-41d0c3b89522"
    );

    // Fixed email subject
    formData.append(
      "subject",
      "New Portfolio Project Inquiry"
    );

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setResult(
          "Your project request has been sent successfully. I'll get back to you shortly."
        );

        setResultType("success");

        form.reset();
      } else {
        setResult(
          data.message ||
            "Something went wrong. Please try again."
        );

        setResultType("error");
      }
    } catch (error) {
      setResult(
        "Unable to send your message. Please try again later."
      );

      setResultType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =====================================================
     GSAP ANIMATION
  ===================================================== */

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(
          [contentRef.current, formRef.current],
          {
            opacity: 1,
            x: 0,
            y: 0,
          }
        );

        return;
      }

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },

        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      tl.from(contentRef.current, {
        opacity: 0,
        x: -30,
        duration: 0.7,
      }).from(
        formRef.current,
        {
          opacity: 0,
          x: 30,
          duration: 0.7,
        },
        "-=0.45"
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700"
    >
      {/* =====================================================
          CUSTOM ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes ctaOrbDriftOne {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }

          50% {
            transform: translate(35px, 25px) scale(1.15);
            opacity: 0.8;
          }
        }

        @keyframes ctaOrbDriftTwo {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }

          50% {
            transform: translate(-40px, -20px) scale(1.1);
            opacity: 0.7;
          }
        }

        @keyframes ctaSpotlightDrift {
          0%, 100% {
            background-position: 20% 20%;
          }

          50% {
            background-position: 30% 30%;
          }
        }

        .cta-orb-1 {
          animation: ctaOrbDriftOne 14s ease-in-out infinite;
        }

        .cta-orb-2 {
          animation: ctaOrbDriftTwo 17s ease-in-out infinite;
        }

        .cta-spotlight {
          background-image: radial-gradient(
            circle at 20% 20%,
            white,
            transparent 35%
          );

          animation: ctaSpotlightDrift 12s ease-in-out infinite;
        }

        .cta-submit {
          position: relative;
          overflow: hidden;
        }

        .cta-submit::after {
          content: "";
          position: absolute;
          inset: 0;

          background: linear-gradient(
            120deg,
            transparent 20%,
            rgba(59, 130, 246, 0.35) 50%,
            transparent 80%
          );

          background-size: 250% 100%;
          background-position: 100% 0;

          opacity: 0;
          transition: opacity 0.3s ease;

          pointer-events: none;
        }

        .cta-submit:hover::after {
          opacity: 1;
          animation: ctaButtonShimmer 1.1s ease-in-out;
        }

        @keyframes ctaButtonShimmer {
          0% {
            background-position: 130% 0;
          }

          100% {
            background-position: -30% 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-orb-1,
          .cta-orb-2,
          .cta-spotlight {
            animation: none;
          }

          .cta-submit:hover::after {
            animation: none;
          }
        }
      `}</style>

      {/* =====================================================
          BACKGROUND EFFECTS
      ===================================================== */}

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="cta-spotlight absolute inset-0 opacity-20" />

        <div className="cta-orb-1 absolute right-1/4 top-0 h-[280px] w-[280px] rounded-full bg-white/10 blur-[90px]" />

        <div className="cta-orb-2 absolute bottom-0 left-1/4 h-[240px] w-[240px] rounded-full bg-white/10 blur-[80px]" />
      </div>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative mx-auto max-w-[1100px] px-6 py-16 sm:py-20">

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* =====================================================
              LEFT SIDE
          ===================================================== */}

          <div ref={contentRef}>

            <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.18em] text-blue-100">
              Let&apos;s Build Together
            </p>

            <h2 className="max-w-[500px] text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[42px]">
              Have a project in mind?
            </h2>

            <p className="mt-5 max-w-[480px] text-sm leading-6 text-blue-100 sm:text-[15px]">
              Tell me what you&apos;re looking to build. Share your
              requirements, timeline, and budget, and let&apos;s turn
              your idea into a fast, scalable, and meaningful digital
              product.
            </p>

            {/* Services */}

            <div className="mt-7 space-y-3">

              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs text-white">
                  ✓
                </span>

                <span className="text-sm text-white/90">
                  Full-Stack Web Development
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs text-white">
                  ✓
                </span>

                <span className="text-sm text-white/90">
                  AI Automation &amp; Integration
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs text-white">
                  ✓
                </span>

                <span className="text-sm text-white/90">
                  Modern React Applications
                </span>
              </div>

            </div>

            {/* Availability */}

            <div className="mt-8 flex items-center gap-3">

              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75" />

                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
              </span>

              <span className="text-xs text-blue-100">
                Available for new projects
              </span>

            </div>

          </div>

          {/* =====================================================
              RIGHT SIDE - CONTACT FORM
          ===================================================== */}

          <div ref={formRef}>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7">

              {/* Form Header */}

              <div className="mb-6">

                <h3 className="text-xl font-semibold text-white">
                  Start a project
                </h3>

                <p className="mt-1 text-sm leading-5 text-blue-100">
                  Share a few details about your project and I&apos;ll
                  get back to you with the next steps.
                </p>

              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* =================================================
                    NAME + EMAIL
                ================================================= */}

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-medium text-white"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      required
                      autoComplete="name"
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-blue-100/50 transition focus:border-white/60 focus:bg-white/15"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-medium text-white"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-blue-100/50 transition focus:border-white/60 focus:bg-white/15"
                    />

                  </div>

                </div>

                {/* =================================================
                    WHATSAPP
                ================================================= */}

                <div>

                  <label
                    htmlFor="whatsapp"
                    className="mb-2 block text-xs font-medium text-white"
                  >
                    WhatsApp Number
                    <span className="ml-1 font-normal text-blue-100/60">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="whatsapp"
                    type="tel"
                    name="whatsapp"
                    placeholder="+92 300 1234567"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-blue-100/50 transition focus:border-white/60 focus:bg-white/15"
                  />

                  <p className="mt-1.5 text-[10px] text-blue-100/60">
                    Add your WhatsApp if you prefer a faster response.
                  </p>

                </div>

                {/* =================================================
                    PROJECT TYPE
                ================================================= */}

                <div>

                  <label
                    htmlFor="projectType"
                    className="mb-2 block text-xs font-medium text-white"
                  >
                    What do you need?
                  </label>

                  <select
                    id="projectType"
                    name="project_type"
                    required
                    defaultValue=""
                    className="w-full appearance-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-white/60 focus:bg-white/15"
                  >
                    <option
                      value=""
                      disabled
                      className="bg-blue-700 text-white"
                    >
                      Select project type
                    </option>

                    <option
                      value="Website Development"
                      className="bg-blue-700 text-white"
                    >
                      Website Development
                    </option>

                    <option
                      value="E-commerce Website"
                      className="bg-blue-700 text-white"
                    >
                      E-commerce Website
                    </option>

                    <option
                      value="React Application"
                      className="bg-blue-700 text-white"
                    >
                      React Application
                    </option>

                    <option
                      value="AI Automation"
                      className="bg-blue-700 text-white"
                    >
                      AI Automation &amp; Integration
                    </option>

                    <option
                      value="API / Backend Development"
                      className="bg-blue-700 text-white"
                    >
                      API / Backend Development
                    </option>

                    <option
                      value="Other"
                      className="bg-blue-700 text-white"
                    >
                      Something Else
                    </option>

                  </select>

                </div>

                {/* =================================================
                    BUDGET + TIMELINE
                ================================================= */}

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="budget"
                      className="mb-2 block text-xs font-medium text-white"
                    >
                      Budget Range
                    </label>

                    <select
                      id="budget"
                      name="budget"
                      required
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-white/60 focus:bg-white/15"
                    >
                      <option
                        value=""
                        disabled
                        className="bg-blue-700 text-white"
                      >
                        Select budget
                      </option>

                      <option
                        value="Under $500"
                        className="bg-blue-700 text-white"
                      >
                        Under $500
                      </option>

                      <option
                        value="$500 - $1,000"
                        className="bg-blue-700 text-white"
                      >
                        $500 - $1,000
                      </option>

                      <option
                        value="$1,000 - $2,500"
                        className="bg-blue-700 text-white"
                      >
                        $1,000 - $2,500
                      </option>

                      <option
                        value="$2,500 - $5,000"
                        className="bg-blue-700 text-white"
                      >
                        $2,500 - $5,000
                      </option>

                      <option
                        value="$5,000+"
                        className="bg-blue-700 text-white"
                      >
                        $5,000+
                      </option>

                      <option
                        value="Not sure yet"
                        className="bg-blue-700 text-white"
                      >
                        Not sure yet
                      </option>

                    </select>

                  </div>

                  <div>

                    <label
                      htmlFor="timeline"
                      className="mb-2 block text-xs font-medium text-white"
                    >
                      Expected Timeline
                    </label>

                    <select
                      id="timeline"
                      name="timeline"
                      required
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-white/60 focus:bg-white/15"
                    >
                      <option
                        value=""
                        disabled
                        className="bg-blue-700 text-white"
                      >
                        Select timeline
                      </option>

                      <option
                        value="ASAP"
                        className="bg-blue-700 text-white"
                      >
                        As soon as possible
                      </option>

                      <option
                        value="1 - 2 weeks"
                        className="bg-blue-700 text-white"
                      >
                        1 - 2 weeks
                      </option>

                      <option
                        value="2 - 4 weeks"
                        className="bg-blue-700 text-white"
                      >
                        2 - 4 weeks
                      </option>

                      <option
                        value="1 - 2 months"
                        className="bg-blue-700 text-white"
                      >
                        1 - 2 months
                      </option>

                      <option
                        value="Flexible"
                        className="bg-blue-700 text-white"
                      >
                        Flexible
                      </option>

                    </select>

                  </div>

                </div>

                {/* =================================================
                    MESSAGE
                ================================================= */}

                <div>

                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs font-medium text-white"
                  >
                    Project Details
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell me about your idea, requirements, features, or any specific goals you have..."
                    required
                    className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-blue-100/50 transition focus:border-white/60 focus:bg-white/15"
                  />

                  <p className="mt-1.5 text-[10px] text-blue-100/60">
                    The more details you provide, the better I can
                    understand your project.
                  </p>

                </div>

                {/* =================================================
                    SUBMIT BUTTON
                ================================================= */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cta-submit w-full rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-blue-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-700/30 border-t-blue-700" />
                      Sending Request...
                    </span>
                  ) : (
                    <>
                      Send Project Request
                      <span className="ml-2">
                        →
                      </span>
                    </>
                  )}
                </button>

                {/* =================================================
                    SUCCESS / ERROR MESSAGE
                ================================================= */}

                {result && (
                  <div
                    className={`rounded-xl border px-4 py-3 text-center text-xs leading-5 ${
                      resultType === "success"
                        ? "border-green-300/20 bg-green-400/10 text-green-100"
                        : "border-red-300/20 bg-red-400/10 text-red-100"
                    }`}
                    role="alert"
                  >
                    {result}
                  </div>
                )}

                {/* =================================================
                    PRIVACY / RESPONSE NOTE
                ================================================= */}

                <p className="text-center text-[11px] leading-5 text-blue-100/70">
                  Your information is only used to discuss your
                  project. I&apos;ll get back to you as soon as
                  possible.
                </p>

              </form>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}