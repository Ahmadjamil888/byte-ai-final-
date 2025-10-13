'use client';

import { useState } from 'react';
import { appConfig } from '@/config/app.config';

interface AIModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
  className?: string;
}

export default function AIModelSelector({ value, onChange, className = '' }: AIModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentModel = appConfig.ai.availableModels.find(model => model === value) || appConfig.ai.availableModels[0];
  const currentDisplayName = appConfig.ai.modelDisplayNames[currentModel] || currentModel;

  const getModelIcon = (modelId: string) => {
    if (modelId.includes('llama')) {
      return '🦙';
    } else if (modelId.includes('mixtral')) {
      return '🔀';
    } else if (modelId.includes('gemma')) {
      return '💎';
    }
    return '🤖';
  };

  const getModelDescription = (modelId: string) => {
    if (modelId.includes('70b')) {
      return 'Most capable, slower';
    } else if (modelId.includes('8b')) {
      return 'Fast and efficient';
    } else if (modelId.includes('mixtral')) {
      return 'Great for code';
    } else if (modelId.includes('gemma')) {
      return 'Instruction tuned';
    }
    return 'AI model';
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors focus:outline-none focus:border-orange-500 min-w-[200px]"
      >
        <span className="text-lg">{getModelIcon(currentModel)}</span>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium truncate">{currentDisplayName}</div>
          <div className="text-xs text-gray-400">{getModelDescription(currentModel)}</div>
        </div>
        <svg 
          width="16" 
          height="16" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 overflow-hidden">
            <div className="p-2">
              <div className="text-xs text-gray-400 px-2 py-1 font-medium uppercase tracking-wide">
                Groq AI Models
              </div>
              {appConfig.ai.availableModels.map((model) => {
                const displayName = appConfig.ai.modelDisplayNames[model] || model;
                const isSelected = model === currentModel;
                
                return (
                  <button
                    key={model}
                    onClick={() => {
                      onChange(model);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors ${
                      isSelected 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <span className="text-lg">{getModelIcon(model)}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{displayName}</div>
                      <div className="text-xs text-gray-400">{getModelDescription(model)}</div>
                    </div>
                    {isSelected && (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-orange-400">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="border-t border-gray-700 p-2">
              <div className="text-xs text-gray-500 px-2">
                Powered by Groq for ultra-fast inference
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}