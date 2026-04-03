"use client";

import Link from "next/link";
import{motion} from "framer-motion";
import {useEffect,useState} from "react";

export default function Home() {

const [position, setPosition] = useState({ x: 0, y: 0 });

const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (

   <div className= "pt-24">
  

{/* 🌐 NAVBAR */}
<div
  className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
  ${
    scrolled
      ? "bg-[#030712]/80 backdrop-blur-md border-b border-white/10"
      : "bg-[#030712]/60 backdrop-blur-sm"
  }`}
>
  <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
    
    <h1 className="text-white font-semibold tracking-wide">
      DUSK PATH AI
    </h1>

    <div className="text-purple-400 cursor-pointer">
      Shaik Afeez ▾
    </div>

  </div>
</div>


    {/* Hero Section */}
   <section className="relatiive top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030712] text-white">

      {/* 🌌 BACKGROUND GLOW */}
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-purple-600/30 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute top-[30%] right-[30%] w-[300px] h-[300px] bg-cyan-400/20 rounded-full blur-[120px] -z-10 animate-pulse" />

      {/* 🧠 AI ORB */}
       <div className="absolute top-[22%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 blur-3xl opacity-50 animate-pulse" />
       <div className="absolute top-[25%] w-[160px] h-[160px] rounded-full bg-[#030712] border border-white/10 flex items-center justify-center backdrop-blur-md">
        <span className="text-xl font-semibold text-white/80">AI</span>
      </div>

      {/* 🚀 CONTENT */}
      <div className="text-center w-full max-w-4xl space-y-8 z-10 px-6 mt-40">

        {/* 🔵 BADGE (CENTER FIXED) */}
          <div className="absolute top-[12%] left-1/2 transform -translate-x-1/2 z-20">
           <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm text-sm text-gray-300">
         <span className="relative flex h-3 w-3">
         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
         </span>
             Built for the Indian Student
         </div>
         </div>

        {/* 🧠 HEADING */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          Your Personal{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            AI Mentor
          </span>
        </h1>

        {/* ✍️ SUBTEXT */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Unlock your potential with tailored learning paths, real-time syllabus guidance, and proactive weakness mapping.
        </p>

        {/* 🚀 BUTTON */}
        <Link href="/chat">
          <button className="relative group overflow-hidden px-10 py-5 bg-white text-black font-bold rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-300">
            
            {/* ✨ SHIMMER */}
            <span className="absolute inset-0 block animate-shimmer h-full w-[400%] bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[30deg]"></span>

            <span className="relative z-10 text-lg">
              Start Learning →
            </span>
          </button>
        </Link>

      </div>
    </section>

      {/* 🚀 PREMIUM 3 CARDS */}
<section className="relative py-32 px-6 bg-[#030712] overflow-hidden">

  {/* 🌌 Background Glow */}
  <div className="absolute inset-0 flex justify-center">
    <div className="w-[500px] h-[250px] bg-gradient-to-r from-purple-500/20 to-cyan-400/20 blur-[120px] rounded-full"></div>
  </div>

  {/* 🧠 Heading */}
  <h2 className="text-center text-4xl md:text-5xl font-bold text-white mb-20 relative z-10">
    Your AI Learning Ecosystem
  </h2>

  {/* 🔥 CARDS */}
  <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8">

    {/* 💬 GENERAL CHAT */}
    <div className="card w-[280px] md:w-[300px]">
      <div className="icon">💬</div>
      <h3>General Chat</h3>
      <p>
        Ask any doubt or question. Your AI assistant is always ready to help you learn better.
      </p>
    </div>

    {/* 🧠 LEARNING PATH (MAIN CARD) */}
    <div className="card active scale-110 w-[300px] md:w-[340px]">
      <div className="icon">🧠</div>
      <h3>Learning Path</h3>
      <p>
        Get a complete roadmap and AI mentorship to achieve your dream career step-by-step.
      </p>
    </div>

    {/* 📝 TEST CENTER */}
    <div className="card w-[280px] md:w-[300px]">
      <div className="icon">📝</div>
      <h3>Test Center</h3>
      <p>
        Practice mock tests, solve model papers, and prepare with real exam-level questions.
      </p>
    </div>

  </div>

  {/* ✨ Floating particles */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
    <div className="absolute top-40 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
    <div className="absolute bottom-20 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
  </div>

</section>

       {/* 🚀 HOW IT WORKS */}
<section className="relative py-32 px-6 bg-[#020617] border-t border-white/10">

  {/* 🧠 Heading */}
  <h2 className="text-center text-4xl md:text-5xl font-bold text-white mb-20">
    How Dusk Path AI Works
  </h2>

  {/* 🔥 STEPS */}
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">

    {/* STEP 1 */}
      <motion.div
       initial={{ opacity: 0, y: 50 }}
       whileInView={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center group"
>
      <div className="text-6xl font-bold text-white/20 mb-4 group-hover:text-purple-400 transition">
        1
        <div className="absolute w-24 h-24 bg-purple-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition"></div>
      </div>
      <h3 className="text-xl text-white font-semibold mb-2">
        Choose Your Goal
      </h3>
      <p className="text-gray-400 max-w-xs">
        Select your class, exam, or career path you want to achieve.
      </p>
    </motion.div>

    {/* ARROW */}
    <div className="hidden md:flex items-center">
    <div className="w-16 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 animate-pulse"></div>
    </div>

    {/* STEP 2 */}
    <motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="flex flex-col items-center text-center group"
>
      <div className="text-6xl font-bold text-white/20 mb-4 group-hover:text-cyan-400 transition">
        2
        <div className="absolute w-24 h-24 bg-purple-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition"></div>
      </div>
      <h3 className="text-xl text-white font-semibold mb-2">
        Learn & Ask
      </h3>
      <p className="text-gray-400 max-w-xs">
        Use AI chat or follow your learning path to understand concepts deeply.
      </p>
    </motion.div>

    {/* ARROW */}
    <div className="hidden md:flex items-center">
    <div className="w-16 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 animate-pulse"></div>
    </div>

    {/* STEP 3 */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.6 }}
     className="flex flex-col items-center text-center group"
>
      <div className="text-6xl font-bold text-white/20 mb-4 group-hover:text-purple-400 transition">
        3
        <div className="absolute w-24 h-24 bg-purple-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition"></div>
      </div>
      <h3 className="text-xl text-white font-semibold mb-2">
        Test & Improve
      </h3>
      <p className="text-gray-400 max-w-xs">
        Practice mock tests, track progress, and improve continuously.
      </p>

  </motion.div>
  </div>
  {/* 🌌 Glow */}
  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-purple-500/20 blur-[120px] rounded-full"></div>

</section>


{/* 💰 PRICING SECTION */}
<section className="relative py-28 px-6 bg-[#030712] border-t border-white/10">

  <h2 className="text-center text-4xl md:text-6xl font-bold text-white mb-20">
    Choose Your{" "}
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
      Learning Plan
    </span>
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

    {/* 🟢 STARTER */}
    <div className="p-8 rounded-2xl border border-white/10 bg-[#0B1220] backdrop-blur-xl text-center hover:scale-105 transition">

      <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
      <p className="text-gray-300 text-sm mb-4">Explore the basics</p>

      <p className="text-5xl font-extrabold mb-6 text-white">
        ₹0<span className="text-lg text-gray-300">/month</span>
      </p>

      <ul className="text-gray-400 space-y-3 mb-8 text-sm">
        <li>✔ Limited Chat Access</li>
        <li>✔ 1 Mock Test / week</li>
        <li>✔ Basic Learning Path</li>
      </ul>

      <button className="w-full py-3 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-md transition">
        Start Free
      </button>
    </div>

    {/* 🔥 PRO STUDENT */}
    <div className="relative p-8 rounded-2xl border border-purple-500/40 bg-gradient-to-b from-purple-500/10 to-cyan-500/10 backdrop-blur-xl text-center scale-105 shadow-[0_0_40px_rgba(168,85,247,0.3)]">

      {/* Badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs px-4 py-1 rounded-full">
        MOST POPULAR
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">Pro Student</h3>
      <p className="text-gray-300 text-sm mb-4">Unlock your full potential</p>

      <p className="text-5xl font-extrabold mb-6 text-white">
        ₹199<span className="text-lg text-gray-300">/month</span>
      </p>

      <ul className="text-gray-200 space-y-3 mb-8 text-sm">
        <li>✔ Unlimited Chat</li>
        <li>✔ Full AI Learning Path</li>
        <li>✔ Unlimited Mock Tests</li>
        <li>✔ Weak Area Tracking</li>
        <li>✔ Smart AI Suggestions</li>
      </ul>

      <button className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:scale-105 transition">
        Get Pro 🚀
      </button>
    </div>

    {/* 🧠 TOPPER AI */}
    <div className="p-8 rounded-2xl border border-white/10 bg-[#0B1220] backdrop-blur-xl text-center hover:scale-105 transition">

      <h3 className="text-2xl font-bold text-white mb-2">Topper AI</h3>
      <p className="text-gray-300 text-sm mb-4">Designed for rank achievers</p>

      <p className="text-5xl font-extrabold mb-6 text-white">
        ₹399<span className="text-lg text-gray-300">/month</span>
      </p>

      <ul className="text-gray-200 space-y-3 mb-8 text-sm">
        <li>✔ Everything in Pro</li>
        <li>✔ AI Study Planner</li>
        <li>✔ Daily Schedules</li>
        <li>✔ Advanced Analytics</li>
        <li>✔ Exam Strategy</li>
      </ul>

      <button className="w-full py-3 rounded-lgbg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-md transition">
        Upgrade 🚀
      </button>
    </div>
  
  </div>
</section>

</div>
  );
}