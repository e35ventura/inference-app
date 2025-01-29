import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  // Extract think block if present
  const thinkMatch = message.match(/<think>(.*?)<\/think>/s);
  const thinkContent = thinkMatch ? thinkMatch[1].trim() : null;
  const mainContent = thinkMatch 
    ? message.replace(/<think>.*?<\/think>/s, '').trim()
    : message;

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-0.5 message-animation`}>
      {!isUser && thinkContent && (
        <div className="group flex items-end gap-1">
          <div className="relative px-3 py-[7px] text-[15px] leading-[1.35] select-text chat-message bg-[#f7f7f8] text-[#8e8e93] rounded-[20px] rounded-bl-[5px] italic">
            <div className="prose prose-sm max-w-none prose-p:my-0 prose-headings:text-[#8e8e93]">
              <p className="font-medium text-[#6b6b70] mb-1">Thinking Process:</p>
              <ReactMarkdown>{thinkContent}</ReactMarkdown>
            </div>
          </div>
          <span className="text-[11px] text-[#8e8e93] opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none px-1">
            thinking
          </span>
        </div>
      )}
      
      <div className={`group flex items-end gap-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div
          className={`relative px-3 py-[7px] text-[15px] leading-[1.35] select-text chat-message ${
            isUser
              ? 'bg-[#007aff] text-white rounded-[20px] rounded-br-[5px]'
              : 'bg-[#e9e9eb] text-[#1c1c1e] rounded-[20px] rounded-bl-[5px]'
          }`}
        >
          <div className={`prose prose-sm max-w-none ${
            isUser 
              ? 'prose-invert prose-p:my-0 prose-headings:text-white' 
              : 'prose-p:my-0 prose-headings:text-[#1c1c1e]'
          }`}>
            <ReactMarkdown>{mainContent}</ReactMarkdown>
          </div>
        </div>
        <span className="text-[11px] text-[#8e8e93] opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none px-1">
          {timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}