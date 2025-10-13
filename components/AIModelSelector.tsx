'use client';

import { useState } from 'react';
import { appConfig } from '@/config/app.config';

interface AIModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  className?: string;
}

export default function AIModelSelector({ selectedModel, onModelChange, className = '' }: AIModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentModelName = appConfig.ai.modelDisplayNames[selectedModel] || selectedModel;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-300">AI Model:</span>
          <span className="text-white font-medium">{currentModelName}</span>
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
          <div className="absolute top-full left-0 mt-1 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-sm font-medium text-white mb-1">Choose AI Model</h3>
              <p className="text-xs text-gray-400">All models powered by Groq for fast inference</p>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {appConfig.ai.availableModels.map((model) => {
                const displayName = appConfig.ai.modelDisplayNames[model] || model;
                const isSelected = model === selectedModel;
                
                // Get model description based on model name
                const getModelDescription = (modelId: string) => {
                  if (modelId.includes('70b')) return 'Most capable, best for complex tasks';
                  if (modelId.includes('8b')) return 'Fast and efficient, good for most tasks';
                  if (modelId.includes('mixtral')) return 'Excellent for code generation';
                  if (modelId.includes('gemma')) return 'Optimized for instruction following';
                  return 'High-performance AI model';
                };

                return (
                  <button
                    key={model}
                    onClick={() => {
                      onModelChange(model);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 hover:bg-gray-700 transition-colors border-b border-gray-700/50 last:border-b-0 ${
                      isSelected ? 'bg-gray-700' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">{displayName}</span>
                          {isSelected && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{getModelDescription(model)}</p>
                      </div>
                      
                      {/* Speed indicator */}
                      <div className="flex items-center gap-1 ml-2">
                        {model.includes('8b') || model.includes('instant') ? (
                          <>
                            <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                            <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                            <div className="w-1 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-400 ml-1">Fast</span>
                          </>
                        ) : model.includes('70b') ? (
                          <>
                            <div className="w-1 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-1 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-1 h-3 bg-gray-600 rounded-full"></div>
                            <span className="text-xs text-yellow-400 ml-1">Powerful</span>
                          </>
                        ) : (
                          <>
                            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                            <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-blue-400 ml-1">Balanced</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="p-3 border-t border-gray-700 bg-gray-800/50">
              <p className="text-xs text-gray-400">
                💡 Tip: Use 8B models for faster responses, 70B for complex tasks
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}