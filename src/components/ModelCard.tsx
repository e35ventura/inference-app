import React from 'react';
import { Cpu } from 'lucide-react';
import { ModelType } from '../lib/openai';

interface ModelCardProps {
  modelKey: ModelType;
  modelName: string;
  description: string;
  isSelected: boolean;
  onSelect: (model: ModelType) => void;
}

export function ModelCard({ modelKey, modelName, description, isSelected, onSelect }: ModelCardProps) {
  return (
    <button
      onClick={() => onSelect(modelKey)}
      className={`w-full p-4 rounded-lg text-left transition-all ${
        isSelected
          ? 'bg-[#007aff]/5 border-2 border-[#007aff] shadow-md'
          : 'bg-white border border-[#e5e5e5] hover:border-[#007aff] hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${isSelected ? 'bg-[#007aff]/10' : 'bg-gray-100'}`}>
          <Cpu size={20} className={`${isSelected ? 'text-[#007aff]' : 'text-gray-600'} stroke-2`} />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium ${isSelected ? 'text-[#007aff]' : 'text-[#1c1c1e]'}`}>
              {modelName}
            </h3>
            {isSelected && (
              <div className="w-2 h-2 rounded-full bg-[#10b981] model-indicator" />
            )}
          </div>
          <p className="text-sm text-[#8e8e93]">{description}</p>
        </div>
      </div>
    </button>
  );
}