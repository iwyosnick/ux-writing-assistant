import React from 'react';
import type { CopyOption } from '../../types';
import CopyButton from './CopyButton';

interface OutputCardProps {
  option: CopyOption;
}

const OutputCard: React.FC<OutputCardProps> = ({ option }) => {
  return (
    <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6 flex flex-col h-full">
      <div className="flex-grow">
        <p className="text-lg text-black dark:text-white mb-4">{option.text}</p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <div className="flex justify-between items-center text-sm text-[#A6A6A6]">
            <div>
                <span className="font-mono bg-orange-100 dark:bg-orange-900/50 text-[#FF5308] px-2 py-1 rounded">{option.tone}</span>
                <span className="ml-2">{option.characterCount} chars</span>
            </div>
            <CopyButton textToCopy={option.text} />
        </div>
      </div>
    </div>
  );
};

export default OutputCard;
