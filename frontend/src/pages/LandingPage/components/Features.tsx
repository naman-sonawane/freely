// src/pages/LandingPage/components/Features.tsx
import React from 'react';
import LiveIcon from './assets/Live.svg';
import LearningIcon from './assets/Leaning.svg';
import RecordIcon from './assets/Record.svg';
import AnalyticsIcon from './assets/Analytics.svg';
import LockIcon from './assets/Lock.svg';
import Elipse from './assets/Elipse-Bottom.svg';

const features = [
  {
    icon: <img src={LiveIcon} alt="Personalized Profile Management" className="object-contain transition-transform duration-300 hover:scale-105" />,
    title: 'Personalized Profile Management',
    description: 'Define and manage your goals, projects, and interests all in one organized profile section.',
  },
  {
    icon: <img src={LearningIcon} alt="Curated Content Feed" className="object-contain transition-transform duration-300 hover:scale-105" />,
    title: 'Curated Content Feed',
    description: 'Receive a personalized feed of videos, live streams, and articles tailored to your interests.',
  },
  {
    icon: <img src={RecordIcon} alt="Interactive Progression Tree" className="object-contain transition-transform duration-300 hover:scale-105" />,
    title: 'Interactive Progression Tree',
    description: 'Explore and learn new skills with a visual roadmap tailored to your chosen topics.',
  },
  {
    icon: <img src={AnalyticsIcon} alt="Dynamic Quiz Creator" className="object-contain transition-transform duration-300 hover:scale-105" />,
    title: 'Dynamic Quiz Creator',
    description: 'Test your knowledge with automatically generated quizzes based on your learning path.',
  },
  {
    icon: <img src={LockIcon} alt="Goal-Oriented Learning" className="object-contain transition-transform duration-300 hover:scale-105" />,
    title: 'Goal-Oriented Learning',
    description: 'Align your learning activities with your personal and professional goals, and track your progress.',
  },
];


const Features: React.FC = () => {
  return (
    <section id="solutions" className="bg-white h-screen flex flex-col justify-center pt-16 relative">
      <div className="container mx-auto px-6 flex-1 flex flex-col justify-center">
        {/* Top row with 3 boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {features.slice(0, 3).map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center transform transition-transform duration-300 hover:-translate-y-2 hover:scale-105"
            >
              {feature.icon}
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        {/* Centered row with 2 boxes */}
        <div className="flex justify-center mt-32 space-x-8">
          {features.slice(3).map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center border-2 w-96 text-center h-48 transform transition-transform duration-400 hover:-translate-y-2 hover:scale-105"
            >
              {feature.icon}
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Elipse SVG Positioned Off-Screen with Top Showing */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <img src={Elipse} alt="Elipse Decoration" className="w-full max-w-none" style={{ marginBottom: '-10%' }} />
      </div>
    </section>
  );
};

export default Features;