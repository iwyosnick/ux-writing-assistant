import React from 'react';
import type { CopyResponse } from '../../types';
import OutputCard from '../ui/OutputCard';

interface OutputScreenProps {
  response: CopyResponse | null;
  onRegenerate: () => void;
  onStartOver: () => void;
}

const OutputScreen: React.FC<OutputScreenProps> = ({ response, onRegenerate, onStartOver }) => {
  if (!response) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-[#A6A6A6] mb-4">We couldn't generate any copy. Please try again.</p>
        <button onClick={onStartOver} className="bg-[#FF5308] text-white font-bold py-2 px-4 rounded-lg">
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2 text-black dark:text-white">✅ Here are your copy suggestions</h1>
      <p className="text-center text-[#A6A6A6] mb-8">Review the options below and copy your favorite.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {response.options.map((option, index) => (
          <OutputCard key={index} option={option} />
        ))}
      </div>

      <div className="mt-12 flex items-center justify-center gap-4">
        <button onClick={onStartOver} className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200">
            ⬅️ Start Over
        </button>
        <button onClick={onRegenerate} className="bg-[#FF5308] text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200">
            🔄 Regenerate All
        </button>
      </div>
    </div>
  );
};

export default OutputScreen;
