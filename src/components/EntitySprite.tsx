import React from 'react';
import { EntityType } from '../game/reducer';
import { COW_WIDTH, COW_HEIGHT, RICKSHAW_WIDTH, RICKSHAW_HEIGHT } from '../game/constants';

interface EntityProps {
  type: EntityType | 'rickshaw';
  shielded?: boolean;
}

export const EntitySprite: React.FC<EntityProps> = ({ type, shielded }) => {
  if (type === 'rickshaw') {
    return (
      <div className="relative group w-full h-full flex flex-col items-center justify-center">
        <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] font-sans" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <pattern id="truckArtPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 20 10 L 10 20 L 0 10 Z" fill="#E91E63" opacity="0.8"/>
              <circle cx="10" cy="10" r="3" fill="#00E676" />
            </pattern>
          </defs>

          {/* Underbody/Shadow */}
          <rect x="25" y="10" width="50" height="130" fill="rgba(0,0,0,0.4)" rx="10" />

          {/* Wheels */}
          <rect x="42" y="0" width="16" height="25" fill="#111" rx="4"/>
          <rect x="2" y="100" width="18" height="35" fill="#111" rx="4"/>
          <rect x="80" y="100" width="18" height="35" fill="#111" rx="4"/>

          {/* Main Chassis/Body (Yellow) */}
          <path d="M 15 50 C 15 40 85 40 85 50 L 95 140 C 95 145 5 145 5 140 Z" fill="#FFEB3B" stroke="#D81B60" strokeWidth="4" strokeLinejoin="round"/>
          
          <path d="M 15 50 C 15 40 85 40 85 50 L 95 140 C 95 145 5 145 5 140 Z" fill="url(#truckArtPattern)" opacity="0.3" />

          {/* Front nose/Triangle */}
          <path d="M 40 5 L 60 5 L 65 65 L 35 65 Z" fill="#FFC107" stroke="#D81B60" strokeWidth="3" strokeLinejoin="round"/>
          
          {/* Windshield/Dashboard area */}
          <path d="M 23 70 L 77 70 L 65 55 L 35 55 Z" fill="#444" stroke="#FFF" strokeWidth="2" />
          <path d="M 28 65 L 72 65 L 62 58 L 38 58 Z" fill="#81D4FA" opacity="0.5" />

          {/* Roof / Canvas (Black) */}
          <path d="M 8 140 L 92 140 L 80 80 L 20 80 Z" fill="#111" stroke="#00C853" strokeWidth="4" strokeLinejoin="round"/>
          
          {/* Decorative Patterns & Truck Art Elements */}
          <text x="50" y="115" textAnchor="middle" fill="#FFEB3B" fontSize="20" fontWeight="bold">ماشاللہ</text>
          
          {/* Tassels/Jhalar */}
          <circle cx="20" cy="142" r="5" fill="#00E676" />
          <circle cx="35" cy="142" r="5" fill="#FF1744" />
          <circle cx="50" cy="142" r="5" fill="#00E676" />
          <circle cx="65" cy="142" r="5" fill="#FF1744" />
          <circle cx="80" cy="142" r="5" fill="#00E676" />
          
          <text x="50" y="45" textAnchor="middle" fill="#D81B60" fontSize="11" fontWeight="bolder">K H I</text>

          {/* Headlights */}
          <circle cx="35" cy="40" r="6" fill="#FFF" stroke="#FF5722" strokeWidth="2" filter="url(#glow)"/>
          <circle cx="65" cy="40" r="6" fill="#FFF" stroke="#FF5722" strokeWidth="2" filter="url(#glow)"/>

          {/* Shield Outline */}
          {shielded && (
            <rect x="0" y="0" width="100" height="150" fill="none" stroke="#00E676" strokeWidth="6" rx="20" filter="url(#glow)" />
          )}
        </svg>
      </div>
    );
  }

  if (type === 'pothole') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-16 h-8 bg-black/50 rounded-[100%] blur-[2px] shadow-inner"></div>
      </div>
    );
  }

  if (type === 'cow') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center drop-shadow-lg">
        <div className="w-12 h-8 bg-white border-2 border-black rounded-lg relative flex items-center justify-center">
           <div className="absolute -right-1 top-1 w-3 h-3 bg-white border-2 border-black rounded-full"></div>
           <div className="w-3 h-3 bg-black absolute top-1 left-2 rounded-sm"></div>
           <div className="absolute -bottom-2 w-2 h-4 bg-black/20"></div>
        </div>
        <span className="text-[10px] font-bold bg-white px-1 mt-2 text-black border border-black uppercase tracking-tighter">COW!</span>
      </div>
    );
  }

  if (type === 'chai') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse">
          <div className="text-2xl drop-shadow-md">☕</div>
        </div>
      </div>
    );
  }

  if (type === 'paratha') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-10 h-10 bg-[#FFD700]/20 rounded-full flex items-center justify-center border-2 border-[#FFD700] shadow-[0_0_20px_#FFD700] animate-spin-slow">
           <div className="text-2xl drop-shadow-md">⚡</div>
        </div>
      </div>
    );
  }

  return null;
};
