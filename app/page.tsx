import Link from "next/link";
import { Button } from "@/components/ui/button";

// Robot Component
const Robot = () => (
  <div className="relative animate-bounce-slow">
    {/* Robot Body */}
    <div className="relative">
      {/* Head */}
      <div className="w-24 h-20 bg-gradient-to-b from-cyan-200 to-cyan-300 rounded-2xl mx-auto relative border-4 border-cyan-400 shadow-lg">
        {/* Eyes */}
        <div className="flex justify-center items-center pt-3 space-x-3">
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <div className="w-3 h-3 bg-black rounded-full"></div>
        </div>
        {/* Mouth */}
        <div className="w-8 h-1 bg-black rounded-full mx-auto mt-2"></div>
        {/* Antennas */}
        <div className="absolute -top-2 left-4 w-1 h-4 bg-pink-400 rounded-full"></div>
        <div className="absolute -top-2 right-4 w-1 h-4 bg-pink-400 rounded-full"></div>
        {/* Antenna balls */}
        <div className="absolute -top-4 left-3.5 w-2 h-2 bg-pink-500 rounded-full"></div>
        <div className="absolute -top-4 right-3.5 w-2 h-2 bg-pink-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="w-20 h-24 bg-gradient-to-b from-cyan-300 to-cyan-400 rounded-2xl mx-auto mt-2 border-4 border-cyan-500 shadow-lg relative">
        {/* Heart */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-pink-400 rounded-full relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-pink-400 rounded-full"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full"></div>
          </div>
        </div>
        {/* Control Panel */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 space-y-1">
          <div className="w-8 h-1 bg-pink-400 rounded-full"></div>
          <div className="w-6 h-1 bg-pink-400 rounded-full mx-auto"></div>
          <div className="w-4 h-1 bg-pink-400 rounded-full mx-auto"></div>
        </div>
      </div>
      
      {/* Arms */}
      <div className="absolute top-16 -left-6 w-4 h-12 bg-pink-400 rounded-full transform rotate-12"></div>
      <div className="absolute top-16 -right-6 w-4 h-12 bg-pink-400 rounded-full transform -rotate-12"></div>
      
      {/* Legs */}
      <div className="flex justify-center space-x-4 mt-2">
        <div className="w-4 h-12 bg-pink-400 rounded-full"></div>
        <div className="w-4 h-12 bg-pink-400 rounded-full"></div>
      </div>
      
      {/* Feet */}
      <div className="flex justify-center space-x-4 -mt-2">
        <div className="w-6 h-3 bg-cyan-400 rounded-full border-2 border-cyan-500"></div>
        <div className="w-6 h-3 bg-cyan-400 rounded-full border-2 border-cyan-500"></div>
      </div>
    </div>
  </div>
);

// Cloud Components
const Cloud = ({ className, emoji }: { className?: string; emoji?: string }) => (
  <div className={`absolute ${className} animate-float`}>
    <div className="relative">
      <div className="w-16 h-10 bg-white rounded-full opacity-90 shadow-lg"></div>
      <div className="absolute -top-2 left-3 w-8 h-8 bg-white rounded-full opacity-90"></div>
      <div className="absolute -top-1 right-2 w-6 h-6 bg-white rounded-full opacity-90"></div>
      {emoji && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-lg">
          {emoji}
        </div>
      )}
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 overflow-hidden relative">
      {/* Floating Clouds */}
      <Cloud className="top-20 left-20" emoji="😊" />
      <Cloud className="top-32 right-32" emoji="☀️" />
      <Cloud className="top-16 left-1/2 transform -translate-x-1/2" emoji="😴" />
      <Cloud className="top-40 right-20" emoji="🌧️" />
      
      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-12 max-w-4xl mx-auto">
          {/* Robot */}
          <div className="flex justify-center">
            <Robot />
          </div>
          
          {/* Title and Button */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                Talk to Echo
              </h1>
            </div>
            
            <Link href="/chat">
              <Button 
                size="lg" 
                className="px-12 py-6 text-xl font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Start Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
