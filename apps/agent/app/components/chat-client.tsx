'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Send, Bot, User, TrendingUp, LogOut } from 'lucide-react';
import type { User as Auth0User } from '@auth0/nextjs-auth0/types';

interface ChatClientProps {
  user?: Auth0User;
}

export default function ChatClient({ user }: ChatClientProps) {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  const suggestedQuestions = [
    "What's the difference between stocks and bonds?",
    "How do I evaluate a company's financial health?",
    "What are the basics of stock market investing?"
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">DemoTradePro AI Agent</h1>
          </div>
          <div className="flex items-center justify-center gap-4">
            <p className="text-muted-foreground">
              Welcome back, {user?.name || 'Trader'}! Your intelligent trading assistant for fictional companies.
            </p>
            <div className="flex items-center gap-3">
              {/* <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <a href="/auth/logout" className="flex items-center gap-1">
                  <LogOut className="h-3 w-3" />
                  Sign Out
                </a>
              </button> */}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-lg border h-[600px] flex flex-col">
          <div className="border-b p-4">
            <h2 className="flex items-center gap-2 font-semibold">
              <Bot className="h-5 w-5 text-primary" />
              Trading Assistant
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-medium mb-2">Hello {user?.given_name || user?.name || 'there'}!</h3>
                  <p className="text-muted-foreground mb-6">
                    I can help you learn about trading concepts and strategies. Try asking about our fictional companies or trading basics.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="text-xs h-auto py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                        onClick={() => sendMessage({ text: question })}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.parts.map((part, i) => {
                          switch (part.type) {
                            case 'text':
                              return <span key={`${message.id}-${i}`}>{part.text}</span>;
                            default:
                              return null;
                          }
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage({ text: input });
                  setInput('');
                }
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about trading, stocks, or market concepts..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-4 text-sm text-muted-foreground">
          <p>
            This is a demo trading assistant for workshop purposes. 
            Companies like Wayne Enterprises and Stark Industries are fictional. 
            All trading involves risk.
          </p>
        </div>
      </div>
    </div>
  );
}
