import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import HomeScreen from './components/screens/HomeScreen';
import InputScreen from './components/screens/InputScreen';
import OutputScreen from './components/screens/OutputScreen';
import LoadingSpinner from './components/LoadingSpinner';
import { generateCopy } from './services/geminiService';
import type { CopyRequest, CopyResponse } from './types';

type Screen = 'home' | 'input' | 'loading' | 'output';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [request, setRequest] = useState<CopyRequest | null>(null);
  const [response, setResponse] = useState<CopyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = useCallback(() => {
    setScreen('input');
    setError(null);
    setResponse(null);
    setRequest(null);
  }, []);

  const handleGenerate = useCallback(async (newRequest: CopyRequest) => {
    setScreen('loading');
    setError(null);
    setRequest(newRequest);
    
    try {
      const result = await generateCopy(newRequest);
      setResponse(result);
      setScreen('output');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setScreen('input'); // Go back to input screen on error
    }
  }, []);
  
  const handleRegenerate = useCallback(async () => {
     if(request) {
        handleGenerate(request);
     }
  }, [request, handleGenerate]);

  const renderScreen = () => {
    switch (screen) {
      case 'input':
        return <InputScreen onSubmit={handleGenerate} onBack={handleStart} error={error} initialRequest={request} />;
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center text-center text-[#A6A6A6] h-[60vh]">
            <LoadingSpinner />
            <p className="text-lg mt-4">Generating copy suggestions...</p>
            <p>The AI is thinking, this might take a moment.</p>
          </div>
        );
      case 'output':
        return <OutputScreen response={response} onRegenerate={handleRegenerate} onStartOver={handleStart} />;
      case 'home':
      default:
        return <HomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;