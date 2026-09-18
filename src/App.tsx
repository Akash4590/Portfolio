import React from "react";
import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import Stats from "./component/Stats";
import About from "./component/About";
import Skills from "./component/Skills";
import Projects from "./component/Project";
import Services from "./component/Services";
import Experience from "./component/Experience";
import Testimonials from "./component/Testimonials";
import CTA from "./component/Cta";
import Footer from "./component/Footer";
import CustomCursor from "./component/CustomCursor";

export default function App() {
  return (
    <div className="min-h-screen bg-[#05070f] font-sans antialiased">
      <CustomCursor />

      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Skills />
      <Projects />
      <Services />
      <Experience />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}