import { useEffect, useRef, Dispatch } from 'react';
import { GameAction, GameState } from './reducer';

export const useGameLoop = (state: GameState, dispatch: Dispatch<GameAction>) => {
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      // Limit deltaTime to avoid huge jumps if tab was inactive
      if (deltaTime < 100) {
        dispatch({ type: 'TICK', payload: { deltaTime, time } });
      } else {
        // Just update time reference without ticking logic
         dispatch({ type: 'TICK', payload: { deltaTime: 16, time } });
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (state.status === 'playing') {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      previousTimeRef.current = undefined;
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [state.status, dispatch]);
};
