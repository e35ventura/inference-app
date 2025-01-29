import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ModelSelector } from './components/ModelSelector';
import { ModelCard } from './components/ModelCard';
import { streamCompletion, ModelType, MODELS, MODEL_INFO } from './lib/openai';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
  id: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('GPT4');
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClear = () => {
    setMessages([]);
    setHasStarted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!hasStarted) {
      setHasStarted(true);
    }

    const userMessage = input.trim();
    setInput('');
    const messageId = Date.now().toString();
    setMessages(prev => [...prev, { content: userMessage, isUser: true, timestamp: new Date(), id: messageId }]);
    setIsLoading(true);

    let assistantMessage = '';
    try {
      for await (const chunk of streamCompletion(userMessage, selectedModel)) {
        assistantMessage += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages[newMessages.length - 1].isUser) {
            newMessages.push({
              content: assistantMessage,
              isUser: false,
              timestamp: new Date(),
              id: `${messageId}-response`
            });
          } else {
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              content: assistantMessage,
            };
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        {
          content: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date(),
          id: `${messageId}-error`
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5]">
      <header className="px-4 py-2.5 bg-[#f5f5f5]">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-base font-medium text-[#1c1c1e] select-none">Ventura Labs</h1>
          <div className="flex items-center gap-2">
            {hasStarted && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[#ff3b30] hover:bg-[#ff3b30]/5 active:bg-[#ff3b30]/10 rounded-full text-sm transition-colors"
              >
                <Trash2 size={14} className="stroke-2" />
                Clear
              </button>
            )}
            <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-4">
        {!hasStarted ? (
          <div className="flex-1 flex flex-col">
            <div className="w-full pt-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message"
                    className="flex-1 h-9 px-4 bg-white border border-[#e5e5e5] rounded-full text-[15px] placeholder-[#8e8e93] focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                      input.trim()
                        ? 'bg-[#007aff] text-white hover:bg-[#0051a8] active:bg-[#003d7f]'
                        : 'bg-[#e5e5e5] text-[#8e8e93]'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label="Send message"
                  >
                    <Send size={18} className="stroke-2" />
                  </button>
                </form>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {(Object.keys(MODELS) as ModelType[]).map((modelKey) => (
                <ModelCard
                  key={modelKey}
                  modelKey={modelKey}
                  modelName={MODEL_INFO[modelKey].name}
                  description={MODEL_INFO[modelKey].description}
                  isSelected={selectedModel === modelKey}
                  onSelect={setSelectedModel}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm mb-4 chat-box-animation">
              <div className="min-h-0 p-4 space-y-1">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.content}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 message-bar-slide-down">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message"
                  className="flex-1 h-9 px-4 bg-white border border-[#e5e5e5] rounded-full text-[15px] placeholder-[#8e8e93] focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                    input.trim()
                      ? 'bg-[#007aff] text-white hover:bg-[#0051a8] active:bg-[#003d7f]'
                      : 'bg-[#e5e5e5] text-[#8e8e93]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="Send message"
                >
                  <Send size={18} className="stroke-2" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <footer className="py-1.5 bg-[#f5f5f5]">
        <div className="max-w-2xl mx-auto text-center text-xs text-[#8e8e93] select-none">
          © 2024 Ventura Labs
        </div>
      </footer>
    </div>
  );
}

export default App;