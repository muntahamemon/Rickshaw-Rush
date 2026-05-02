import React from 'react';
import { GameState } from '../game/reducer';
import { Shield } from 'lucide-react';

interface HUDProps {
  state: GameState;
  onAction?: () => void;
}

export const HUD: React.FC<HUDProps> = ({ state, onAction }) => {
  return (
    <div className="w-full lg:w-80 shrink-0 h-full bg-[#1A1A1A] p-4 lg:p-8 flex flex-col gap-4 lg:gap-8 z-10 lg:static absolute top-0 right-0 left-0">
      <div className="flex lg:flex-col justify-between items-center lg:items-start lg:border-b lg:border-white/10 lg:pb-6">
        <div>
          <h2 className="hidden lg:block text-[#FFD700] text-xs font-black uppercase tracking-widest mb-1">Score</h2>
          <div className="text-3xl lg:text-6xl font-black text-white tabular-nums tracking-tighter">
            {state.score}
          </div>
        </div>
        
        <div className="flex gap-4 lg:hidden">
          <div className="text-right">
            <div className="text-[#FFD700] text-[10px] font-black uppercase tracking-widest">Chai</div>
            <div className="text-xl font-black text-white">{state.chaiCount}</div>
          </div>
          <div className="text-right">
            <div className="text-[#FFD700] text-[10px] font-black uppercase tracking-widest">Health</div>
            <div className="text-xl font-black text-[#00FF41]">{Math.max(0, state.health)}%</div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex justify-between items-end">
        <div>
          <h2 className="text-[#FFD700] text-xs font-black uppercase tracking-widest mb-1">Chai Collected</h2>
          <div className="text-4xl font-black text-white">{state.chaiCount}</div>
        </div>
        <div className="text-right">
          <h2 className="text-[#FFD700] text-xs font-black uppercase tracking-widest mb-1">Distance</h2>
          <div className="text-4xl font-black text-white">{Math.floor(state.distance)}<span className="text-sm ml-1 text-white/50">m</span></div>
        </div>
      </div>

      <div className="hidden lg:block mt-4">
        <div className="flex justify-between items-end mb-2">
           <h2 className="text-[#FFD700] text-xs font-black uppercase tracking-widest">Rickshaw Condition</h2>
           {state.shieldActive && <Shield size={16} className="text-[#00FF41] animate-pulse" />}
        </div>
        <div className="w-full h-8 bg-black border-2 border-white/20 p-1">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-[#00FF41] transition-all duration-300"
            style={{ 
              width: `${Math.max(0, Math.min(100, state.health))}%`,
              boxShadow: state.health > 50 ? '0 0 10px rgba(0,255,65,0.5)' : (state.health > 20 ? '0 0 10px rgba(253,224,71,0.5)' : '0 0 10px rgba(239,68,68,0.5)')
            }}
          ></div>
        </div>
      </div>

      {/* Game Menu Action Buttons */}
      <div className="hidden lg:flex mt-auto flex-col gap-4">
        <button 
          onClick={onAction}
          className="w-full py-4 bg-[#FFD700] text-black font-black text-xl uppercase skew-x-[-10deg] hover:bg-white transition-colors cursor-pointer"
        >
          {state.status === 'playing' ? 'RESTART GAME' : 'START GAME'}
        </button>
        <div className="w-full py-4 bg-transparent border-2 border-white/20 text-white font-black text-xl uppercase skew-x-[-10deg] hover:bg-white/10 transition-colors text-center cursor-not-allowed opacity-50">
          SETTINGS
        </div>
      </div>
    </div>
  );
};
