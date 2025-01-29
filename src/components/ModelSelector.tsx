import React, { useState, useEffect, useRef } from 'react';
import { ModelType, MODELS } from '../lib/openai';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative select-none" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-sm shadow-sm hover:bg-gray-50 transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-[#10b981] model-indicator" />
        <span>{MODELS[selectedModel].split('/').pop()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-64 p-1 bg-white rounded-lg shadow-lg border border-gray-100">
          <div className="px-2 py-1.5 mb-1">
            <input
              type="text"
              placeholder="Search models..."
              className="w-full px-2 py-1 text-sm bg-gray-50 rounded-md border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981]"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(MODELS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => {
                  onModelChange(key as ModelType);
                  setIsOpen(false);
                }}
                className="w-full px-2 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2 rounded transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${
                  selectedModel === key ? 'bg-[#10b981] model-indicator' : 'bg-gray-300'
                }`} />
                {value.split('/').pop()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}