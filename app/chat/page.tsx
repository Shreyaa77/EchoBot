'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface Weather {
  weather: Array<{ main: string; description: string }>;
  main: { temp: number; humidity: number };
  wind: { speed: number };
  name: string;
}

// Robot Avatar Component
const RobotAvatar = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="w-10 h-8 bg-gradient-to-b from-cyan-200 to-cyan-300 rounded-lg border-2 border-cyan-400 relative">
      {/* Eyes */}
      <div className="flex justify-center items-center pt-1 space-x-1">
        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
      </div>
      {/* Mouth */}
      <div className="w-3 h-0.5 bg-black rounded-full mx-auto mt-1"></div>
      {/* Antennas */}
      <div className="absolute -top-1 left-2 w-0.5 h-2 bg-pink-400 rounded-full"></div>
      <div className="absolute -top-1 right-2 w-0.5 h-2 bg-pink-400 rounded-full"></div>
    </div>
  </div>
);

// Sidebar Robot Component
const SidebarRobot = () => (
  <div className="fixed right-8 bottom-8 z-10 animate-bounce-slow">
    <div className="relative">
      {/* Head */}
      <div className="w-16 h-14 bg-gradient-to-b from-cyan-200 to-cyan-300 rounded-xl mx-auto relative border-3 border-cyan-400 shadow-lg">
        {/* Eyes */}
        <div className="flex justify-center items-center pt-2 space-x-2">
          <div className="w-2 h-2 bg-black rounded-full"></div>
          <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>
        {/* Mouth - happy */}
        <div className="w-4 h-1 bg-black rounded-full mx-auto mt-1 transform rotate-12"></div>
        {/* Blush */}
        <div className="absolute top-3 left-1 w-2 h-1 bg-pink-300 rounded-full opacity-60"></div>
        <div className="absolute top-3 right-1 w-2 h-1 bg-pink-300 rounded-full opacity-60"></div>
        {/* Antennas */}
        <div className="absolute -top-1 left-3 w-0.5 h-3 bg-pink-400 rounded-full"></div>
        <div className="absolute -top-1 right-3 w-0.5 h-3 bg-pink-400 rounded-full"></div>
        {/* Antenna balls */}
        <div className="absolute -top-2 left-2.5 w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
        <div className="absolute -top-2 right-2.5 w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="w-14 h-16 bg-gradient-to-b from-cyan-300 to-cyan-400 rounded-xl mx-auto mt-1 border-3 border-cyan-500 shadow-lg relative">
        {/* Heart */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-3 h-3 bg-pink-400 rounded-full relative">
            <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
          </div>
        </div>
        {/* Control Panel */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 space-y-0.5">
          <div className="w-6 h-0.5 bg-pink-400 rounded-full"></div>
          <div className="w-4 h-0.5 bg-pink-400 rounded-full mx-auto"></div>
          <div className="w-3 h-0.5 bg-pink-400 rounded-full mx-auto"></div>
        </div>
      </div>
      
      {/* Arms */}
      <div className="absolute top-10 -left-4 w-3 h-8 bg-pink-400 rounded-full transform rotate-12"></div>
      <div className="absolute top-10 -right-4 w-3 h-8 bg-pink-400 rounded-full transform -rotate-12 animate-wave"></div>
      
      {/* Legs */}
      <div className="flex justify-center space-x-2 mt-1">
        <div className="w-3 h-8 bg-pink-400 rounded-full"></div>
        <div className="w-3 h-8 bg-pink-400 rounded-full"></div>
      </div>
      
      {/* Feet */}
      <div className="flex justify-center space-x-2 -mt-1">
        <div className="w-4 h-2 bg-cyan-400 rounded-full border-2 border-cyan-500"></div>
        <div className="w-4 h-2 bg-cyan-400 rounded-full border-2 border-cyan-500"></div>
      </div>
    </div>
  </div>
);

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  console.log(showSuggestions);
  // Get user's location and weather on component mount
  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
                const weatherData = await response.json();
                console.log('Weather data fetched:', weatherData);
                setWeather(weatherData);
              } catch (error) {
                console.error('Weather fetch error:', error);
              }
            },
            (error) => {
              console.error('Geolocation error:', error);
            }
          );
        }
      } catch (error) {
        console.error('Location error:', error);
      }
    };

    getLocationAndWeather();
  }, []);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    // If this is the first message, add the greeting first
    if (!hasStartedChat) {
      const greetingMessage: Message = {
        id: 'greeting',
        content: "Hi! How are you feeling today?",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages([greetingMessage, userMessage]);
      setHasStartedChat(true);
    } else {
      setMessages(prev => [...prev, userMessage]);
    }

    setInput('');
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      // Get current messages for context (including the new user message)
      const currentMessages = hasStartedChat ? messages : [];
      const allMessages = hasStartedChat ? [...currentMessages, userMessage] : [userMessage];
      
      console.log('Sending chat data to API:', { message: textToSend, weather, messages: allMessages });
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: textToSend,
          weather: weather,
          messages: allMessages // Send conversation history
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Remember to take care of yourself today! 💙",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    { text: "Good!", emoji: "😊" },
    { text: "It's nice and sunny", emoji: "☀️" },
    { text: "I'm feeling stressed", emoji: "😰" },
    { text: "The weather affects my mood", emoji: "🌧️" },
    { text: "I need some motivation", emoji: "💪" },
    { text: "I'm tired today", emoji: "😴" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 relative">
      {/* Sidebar Robot */}
      <SidebarRobot />
      
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {!hasStartedChat ? (
          // Welcome State - Centered Input
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-center space-y-8 max-w-2xl w-full animate-in fade-in duration-500">
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold text-gray-800">
                  Hi, I&apos;m Echo! 👋
                </h1>
                <p className="text-lg text-gray-600">
                  Your friendly well-being companion
                </p>
                {weather && (
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-600 shadow-sm">
                      <span>📍 {weather.name}</span>
                      <span>•</span>
                      <span>{Math.round(weather.main.temp)}°C</span>
                      <span>•</span>
                      <span className="capitalize">{weather.weather[0].description}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Centered Input */}
              <div className="w-full max-w-2xl mx-auto space-y-4">
                <div className="relative flex items-center bg-white rounded-full shadow-lg border-2 border-gray-200">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="How are you feeling today?"
                    className="flex-1 h-14 px-6 text-base bg-transparent border-0 rounded-full focus:ring-0 focus:outline-none"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={() => handleSend()} 
                    disabled={!input.trim() || isTyping}
                    className="mr-2 h-10 w-10 p-0 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </Button>
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="bg-white/80 backdrop-blur-sm border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-gray-700 rounded-full px-4 py-2 text-sm shadow-sm transition-all duration-200 hover:scale-105"
                      disabled={isTyping}
                    >
                      <span className="mr-2">{suggestion.emoji}</span>
                      {suggestion.text}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Chat Mode - Messages + Bottom Input
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-in slide-in-from-top duration-700">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`flex items-start space-x-3 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {message.sender === 'assistant' && <RobotAvatar />}
                    <div className={`px-4 py-3 rounded-2xl shadow-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-sm' 
                        : 'bg-purple-200 text-gray-800 rounded-bl-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-start space-x-3 max-w-[70%]">
                    <RobotAvatar />
                    <div className="px-4 py-3 bg-purple-200 rounded-2xl rounded-bl-sm shadow-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area - Bottom */}
            <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-white/20 animate-in slide-in-from-bottom duration-700">
              <div className="max-w-3xl mx-auto space-y-3">
                {/* Weather Info */}
                {weather && (
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-600 shadow-sm">
                      <span>📍 {weather.name}</span>
                      <span>•</span>
                      <span>{Math.round(weather.main.temp)}°C</span>
                      <span>•</span>
                      <span className="capitalize">{weather.weather[0].description}</span>
                    </div>
                  </div>
                )}
                
                {/* Input Field */}
                <div className="relative flex items-center bg-white rounded-full shadow-lg border-2 border-gray-200">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 h-12 px-6 text-base bg-transparent border-0 rounded-full focus:ring-0 focus:outline-none"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={() => handleSend()} 
                    disabled={!input.trim() || isTyping}
                    className="mr-2 h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}