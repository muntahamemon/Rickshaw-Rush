import React, { useReducer, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gameReducer, initialState } from '../game/reducer';
import { useGameLoop } from '../game/useGameLoop';
import { useAudioEngine } from '../game/useAudioEngine';
import { HUD } from './HUD';
import { Overlay } from './Overlay';
import { EntitySprite } from './EntitySprite';
import { LOGICAL_HEIGHT, LANE_WIDTH, RICKSHAW_Y, RICKSHAW_WIDTH, RICKSHAW_HEIGHT } from '../game/constants';

export const Game: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  useGameLoop(state, dispatch);
  useAudioEngine(state, dispatch);
  
  const [isPlayingMuzic, setIsPlayingMuzic] = useState(false);

  useEffect(() => {
    if (state.status === 'playing') {
      setIsPlayingMuzic(true);
    }
  }, [state.status]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        dispatch({ type: 'MOVE_LANE', payload: -1 });
      } else if (e.key === 'ArrowRight') {
        dispatch({ type: 'MOVE_LANE', payload: 1 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const touchStartX = useRef<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    if (diffX > 30) dispatch({ type: 'MOVE_LANE', payload: -1 });
    else if (diffX < -30) dispatch({ type: 'MOVE_LANE', payload: 1 });
    touchStartX.current = null;
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
       if (state.status === 'playing') e.preventDefault();
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', handleTouchMove);
  }, [state.status]);

  const handleStart = () => {
    dispatch({ type: state.status === 'gameover' ? 'RESTART' : 'START_GAME' });
  };

  const backgroundY = (state.distance * 0.5) % LOGICAL_HEIGHT;

  return (
    <div className="flex w-full min-h-[100dvh] lg:h-screen items-center justify-center bg-[#FFD700] overflow-hidden font-sans select-none relative">
      <div className="hidden">
        {isPlayingMuzic && (
           <iframe
             width="10"
             height="10"
             src="https://www.youtube.com/embed/R2_2zH3h1E8?autoplay=1&loop=1&playlist=R2_2zH3h1E8"
             allow="autoplay"
             title="pakistani-bgm"
           />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700] via-[#FF8C00] to-[#E65100]"></div>

      <div className="absolute top-0 w-full h-24 pointer-events-none opacity-40">
        <svg width="1024" height="100" viewBox="0 0 1024 100" fill="none" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          <path d="M0 10 Q 256 60, 512 10 T 1024 40" stroke="black" strokeWidth="1"/>
          <path d="M0 30 Q 300 80, 600 20 T 1024 70" stroke="black" strokeWidth="1.5"/>
          <path d="M0 50 Q 400 10, 800 90 T 1024 20" stroke="black" strokeWidth="0.8"/>
        </svg>
      </div>

      <div className="w-full max-w-[1024px] h-[100dvh] lg:h-[768px] flex flex-col lg:flex-row relative z-10 shadow-2xl bg-[#333333]">
        
        <div className="hidden lg:flex w-64 h-full bg-[#2D2D2D] border-r-8 border-[#1A1A1A] relative flex-col items-center pt-20 gap-12 z-10 shrink-0">
          <div className="w-48 h-32 bg-[#E91E63] border-4 border-white shadow-lg flex items-center justify-center transform -rotate-3">
            <span className="text-white font-bold text-3xl text-center leading-tight">کراچی<br/>ہوٹل</span>
          </div>
          <div className="w-48 h-24 bg-[#4CAF50] border-4 border-white shadow-lg flex items-center justify-center transform rotate-2">
            <span className="text-white font-bold text-2xl">چائے خانہ</span>
          </div>
          <div className="absolute bottom-10 left-4 text-white/20 font-black text-6xl opacity-20 tracking-widest" style={{ writingMode: 'vertical-rl' }}>KARACHI</div>
          
          <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none opacity-80">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" strokeDasharray="4 2"/>
              <path d="M20 50 Q 50 20, 80 50 T 50 80 T 20 50" fill="#D81B60"/>
              <circle cx="50" cy="50" r="10" fill="#FFD700"/>
            </svg>
          </div>
        </div>

        <div className="flex-1 relative flex justify-center bg-[#333333] h-full overflow-hidden w-full lg:w-auto"
             onTouchStart={handleTouchStart}
             onTouchEnd={handleTouchEnd}>
          
          <div className="relative w-full h-full max-w-[400px] bg-[#444] border-x-4 border-white/20 shadow-2xl overflow-hidden touch-none" style={{ backgroundPositionY: `${backgroundY}px` }}>
            
            <div className="absolute inset-0 flex justify-evenly pointer-events-none z-0">
               <div className="w-1 h-full border-l-4 border-dashed border-yellow-400 opacity-50 relative" style={{ top: `${backgroundY % 40}px` }}></div>
               <div className="w-1 h-full border-l-4 border-dashed border-yellow-400 opacity-50 relative" style={{ top: `${backgroundY % 40}px` }}></div>
            </div>

            {state.entities.map(entity => (
              <div
                key={entity.id}
                className="absolute will-change-transform z-10"
                style={{
                  left: entity.lane * LANE_WIDTH + (LANE_WIDTH - entity.width) / 2,
                  top: 0,
                  width: entity.width,
                  height: entity.height,
                  transform: `translateY(${entity.y}px)`
                }}
              >
                 <EntitySprite type={entity.type} />
              </div>
            ))}

            {/* The Player (Rickshaw) */}
            <motion.div
              className="absolute z-20"
              layout
              initial={false}
              animate={{
                x: state.lane * LANE_WIDTH + (LANE_WIDTH - RICKSHAW_WIDTH) / 2,
                y: RICKSHAW_Y
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{ width: RICKSHAW_WIDTH, height: RICKSHAW_HEIGHT }}
            >
               <motion.div animate={{ opacity: state.status === 'gameover' ? 0.5 : 1 }} className="w-full h-full">
                  <EntitySprite type="rickshaw" shielded={state.shieldActive} />
               </motion.div>
            </motion.div>

            <div className="lg:hidden">
               <Overlay status={state.status} score={state.score} onStart={handleStart} />
            </div>
            
            {/* Show Overlay on desktop only for initial start to grab attention, since buttons are right sidebar */}
            <div className="hidden lg:block">
              {state.status === 'start' && <Overlay status={state.status} score={state.score} onStart={handleStart} isDesktop />}
            </div>
          </div>
        </div>

        <HUD state={state} onAction={handleStart} />

        <div className="absolute bottom-4 right-4 text-[10px] text-white/30 font-mono tracking-tighter hidden lg:block z-20">
          BUILD v0.4.2-ALPHA // KARACHI_STREET_RACE
        </div>
      </div>
    </div>
  );
};
