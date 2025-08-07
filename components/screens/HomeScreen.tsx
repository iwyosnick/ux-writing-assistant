import React from 'react';
import SparklesIcon from '../icons/SparklesIcon';

interface HomeScreenProps {
  onStart: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-[70vh] animate-fade-in">
      <h1 className="text-5xl md:text-6xl font-extrabold text-black dark:text-white mb-4">
        <span className="text-5xl md:text-6xl mr-2">✍️</span>
        Need help writing product content?
      </h1>
      <p className="max-w-2xl text-lg text-[#A6A6A6] mb-8">
        Generate consistent, on-brand UX copy for buttons, tooltips, error messages, and more, powered by AI.
      </p>
      <button
        onClick={onStart}
        className="bg-[#FF5308] text-white font-bold text-lg py-4 px-8 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        → Start Writing
      </button>
    </div>
  );
};

export default HomeScreen;
