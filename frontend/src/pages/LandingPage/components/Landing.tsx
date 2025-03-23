// src/pages/LandingPage/components/Landing.tsx
import React from "react";
import Check from "./assets/Check.svg";
import Chat from "./assets/Chat.svg";
import Members from "./assets/Members.svg";

// Reusable Feature Item Component
const FeatureItem = ({ text }: { text: string }) => (
  <span className="flex items-center space-x-4">
    <img src={Check} alt="Check Mark" className="h-5 w-5 opacity-80" />
    <p className="text-gray-300">{text}</p>
  </span>
);

const Landing: React.FC = () => {
  return (
    <section
      id="product"
      className="bg-[#1a1a2e] min-h-screen w-full flex flex-col justify-between font-ubuntu relative overflow-hidden"
    >
      <div className="w-full flex items-center" style={{ minHeight: "calc(100vh - 150px)" }}>
        {/* Left Side Content */}
        <div className="w-full pl-44 relative z-10">
          <h1 className="text-7xl font-bold text-white tracking-wide">
            Smarter Investing, <br />
            <span className="bg-gradient-to-r from-[#ff2e63] to-[#9d50bb] text-transparent bg-clip-text">
              Personalized for You
            </span>
            .
          </h1>

          {/* Feature List */}
          <div className="mt-4 text-xl text-gray-300 flex flex-col space-y-2 text-left">
            {[
              "AI-driven stock recommendations tailored to your portfolio.",
              "Swipe through trending stocks—just like a social feed.",
              "Learn market trends & insights in real-time.",
              "Build confidence with simplified investing education.",
              "Join a community of investors & share insights.",
            ].map((item, index) => (
              <FeatureItem key={index} text={item} />
            ))}
          </div>
        </div>

        {/* Right Side Decorative Elements 
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end overflow-hidden">
          <img src={Dots} alt="Decorative Dots" className="h-full max-w-none w-[70%] opacity-40" />
        </div>

        <div className="absolute right-40 top-1/2 -translate-y-1/2">
          <img src={Squiggle} alt="Decorative Squiggle" className="h-20 w-auto mt-10 opacity-60" />
        </div>
        */}

        {/* Floating Info Cards */}
        <div className="absolute right-96 top-1/3 transform -translate-y-1/2 w-48 h-16 bg-[#23234b] shadow-md rounded-lg border border-[#ff2e63] flex items-center justify-center">
          <img src={Members} alt="Members Icon" className="h-6 mr-2" />
          <span className="text-gray-300 font-medium">1.2K investors</span>
        </div>
        <div className="absolute right-[34rem] top-1/4 transform -translate-y-1/2 w-48 h-16 bg-[#23234b] shadow-md rounded-lg border border-[#ff2e63] flex items-center justify-center">
          <img src={Chat} alt="Chat Icon" className="h-6 mr-2" />
          <span className="text-gray-300 font-medium">8.5K discussions</span>
        </div>
      </div>
    </section>
  );
};

export default Landing;
