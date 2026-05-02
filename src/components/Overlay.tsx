import React from 'react';
import { GameStatus } from '../game/reducer';

interface OverlayProps {
  status: GameStatus;
  score: number;
  onStart: () => void;
  isDesktop?: boolean;
}

export const Overlay: React.FC<OverlayProps> = ({ status, score, onStart, isDesktop }) => {
  if (status === 'playing') return null;

  const isGameOver = status === 'gameover';

  return (
    <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-4 ${isDesktop ? 'bg-transparent' : 'bg-black/80 backdrop-blur-sm'}`}>
      
      {!isDesktop && (
        <h1 className="text-6xl font-black text-[#FFD700] uppercase tracking-tighter text-center mb-8 bg-black/50 px-4 py-2 border-y-4 border-[#FFD700]">
           {isGameOver ? 'CRASHED!' : 'KARACHI RACE'}
        </h1>
      )}

      {isDesktop && status === 'start' && (
        <div className="bg-black/90 p-8 border-4 border-[#00FF41] transform -skew-x-3 mb-12 shadow-[10px_10px_0_#FFF]">
           <h1 className="text-6xl font-black text-[#00FF41] uppercase tracking-tighter mb-4 text-center">KARACHI<br/>STREET RACE</h1>
           <p className="text-white font-bold text-center text-xl uppercase tracking-widest">Use arrows or swipe</p>
        </div>
      )}

      {isGameOver && (
        <div className="bg-[#E91E63] border-4 border-white transform rotate-3 p-8 mb-8 shadow-[10px_10px_0_#000]">
          <h2 className="text-white text-sm font-black uppercase tracking-widest text-center mb-2">Final Score</h2>
          <div className="text-7xl font-black text-white tabular-nums tracking-tighter text-center">{score}</div>
        </div>
      )}

      {!isDesktop && (
        <button
          onClick={onStart}
          className="w-full max-w-xs py-4 bg-[#FFD700] text-black font-black text-2xl uppercase skew-x-[-10deg] border-4 border-black hover:bg-white transition-colors active:translate-y-1 shadow-[5px_5px_0_#FFF]"
        >
          {isGameOver ? 'PLAY AGAIN' : 'START GAME'}
        </button>
      )}

    </div>
  );
};
