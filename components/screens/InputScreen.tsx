import React, { useState } from 'react';
import type { CopyRequest } from '../../types';
import ImageUploader from '../ui/ImageUploader';

interface InputScreenProps {
  onSubmit: (request: CopyRequest) => void;
  onBack: () => void;
  error?: string | null;
  initialRequest?: CopyRequest | null;
}

const contentTypes = ["Tooltip", "Error message", "Button (CTA)", "Success message", "Onboarding tip", "Empty state", "Modal title", "Modal body"];
const tones = ["Friendly", "Neutral", "Serious", "Formal", "Casual", "Empathetic"];

const InputScreen: React.FC<InputScreenProps> = ({ onSubmit, onBack, error, initialRequest }) => {
  const [formState, setFormState] = useState<CopyRequest>(initialRequest || {
    description: '',
    contentType: '',
    location: '',
    trigger: '',
    outcome: '',
    tone: '',
    charLimit: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (fileData: { mimeType: string, data: string } | null) => {
    setFormState(prev => ({ ...prev, image: fileData || undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.description.trim()) {
      onSubmit(formState);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2 text-black dark:text-white">🧠 Tell us what you need help with</h1>
      <p className="text-center text-[#A6A6A6] mb-8">The more context you provide, the better the suggestions will be.</p>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6 text-center">
            <p className="font-bold">An Error Occurred</p>
            <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Core Inputs */}
          <div className="space-y-6 p-6 bg-white dark:bg-black rounded-xl shadow-lg">
            <div>
              <label htmlFor="description" className="block text-md font-semibold mb-2 text-black dark:text-white">📝 Describe what you want to say or explain <span className="text-red-500">*</span></label>
              <textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full p-3 border-2 border-[#A6A6A6] rounded-lg focus:ring-2 focus:ring-[#FF5308] focus:border-[#FF5308] transition duration-200 bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                placeholder="e.g., Tooltip explaining why the export button is disabled when no filters are selected."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contentType" className="block text-sm font-medium mb-1 text-[#A6A6A6]">Content type</label>
                <select id="contentType" name="contentType" value={formState.contentType} onChange={handleChange} className="w-full p-3 border-2 border-[#A6A6A6] rounded-lg focus:ring-2 focus:ring-[#FF5308] focus:border-[#FF5308] transition duration-200 bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                  <option value="">Optional</option>
                  {contentTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="tone" className="block text-sm font-medium mb-1 text-[#A6A6A6]">Tone</label>
                <select id="tone" name="tone" value={formState.tone} onChange={handleChange} className="w-full p-3 border-2 border-[#A6A6A6] rounded-lg focus:ring-2 focus:ring-[#FF5308] focus:border-[#FF5308] transition duration-200 bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                  <option value="">Optional</option>
                  {tones.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
            <div>
                <label htmlFor="charLimit" className="block text-sm font-medium mb-1 text-[#A6A6A6]">Character limit</label>
                <input id="charLimit" name="charLimit" type="number" value={formState.charLimit} onChange={handleChange} className="w-full p-3 border-2 border-[#A6A6A6] rounded-lg focus:ring-2 focus:ring-[#FF5308] focus:border-[#FF5308] transition duration-200 bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600" placeholder="e.g., 100" />
            </div>
          </div>
          {/* Right Column: Context & Image */}
          <div className="space-y-6 p-6 bg-white dark:bg-black rounded-xl shadow-lg">
             <ImageUploader onUpload={handleImageUpload} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-1 text-[#A6A6A6]">Component or location</label>
                    <input id="location" name="location" value={formState.location} onChange={handleChange} className="w-full p-3 border-2 border-[#A6A6A6] rounded-lg focus:ring-2 focus:ring-[#FF5308] focus:border-[#FF5308] transition duration-200 bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600" placeholder="e.g., Settings panel" />
                </div>
                 <div>
                    <label htmlFor="trigger" className="block text-sm font-medium mb-1 text-[#A6A6A6]">Trigger / User action</label>
                    <input id="trigger" name="trigger" value={formState.trigger} onChange={handleChange} className="w-full p-3 border-2 border-[#A6A6A6] rounded-lg focus:ring-2 focus:ring-[#FF5308] focus:border-[#FF5308] transition duration-200 bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600" placeholder="e.g., User deletes project" />
                </div>
             </div>
             <div>
                <label htmlFor="outcome" className="block text-sm font-medium mb-1 text-[#A6A6A6]">Intended outcome</label>
                <input id="outcome" name="outcome" value={formState.outcome} onChange={handleChange} className="w-full p-3 border-2 border-[#A6A6A6] rounded-lg focus:ring-2 focus:ring-[#FF5308] focus:border-[#FF5308] transition duration-200 bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600" placeholder="e.g., Warn them but let them proceed" />
             </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
            <button type="button" onClick={onBack} className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200">
                ⬅️ Start Over
            </button>
            <button type="submit" disabled={!formState.description.trim()} className="bg-[#FF5308] text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:bg-[#A6A6A6] disabled:cursor-not-allowed">
                → Generate Copy
            </button>
        </div>
      </form>
    </div>
  );
};

export default InputScreen;
