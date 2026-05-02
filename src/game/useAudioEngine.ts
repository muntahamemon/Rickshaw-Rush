import { useEffect, useRef } from 'react';
import { GameState, GameAction } from './reducer';
import { Dispatch } from 'react';

// Placeholders for actual audio
// The instructions mentioned placeholders but requested descriptions in code comments.
// We use simple silent/beep data URIs or just mock the Audio API.

// Audio Engine (The Soul of the Game)
// Background Music: A high-tempo Desi-Synth Fusion. Lead: Sitar or Rabab. Beat: Tabla and Dholak (120 BPM).
// SFX: Engine (phut-phut-phut), Horn ("Peeeep!"), Collect ("tink"), Collision ("Mooo!", "thud")

class MockAudio {
  play() {
    // console.log('Playing audio placeholder');
  }
  pause() {}
  loop = false;
  volume = 1;
}

export const useAudioEngine = (state: GameState, dispatch: Dispatch<GameAction>) => {
  const bgmRef = useRef<MockAudio | null>(null);
  const sfxRefs = useRef<Record<string, MockAudio>>({});

  useEffect(() => {
    // Initialize mock audio "elements"
    bgmRef.current = new MockAudio();
    bgmRef.current.loop = true;
    
    sfxRefs.current = {
      start_engine: new MockAudio(),
      horn: new MockAudio(),
      tink: new MockAudio(),
      thud: new MockAudio(),
      moo: new MockAudio(),
      powerup: new MockAudio(),
      shield_block: new MockAudio(),
      gameover: new MockAudio(),
    };
  }, []);

  // Handle BGM based on game status
  useEffect(() => {
    if (state.status === 'playing') {
      bgmRef.current?.play();
      // Increase volume/pitch slightly as the game speeds up
      if (bgmRef.current) {
         // Example: bgmRef.current.playbackRate = 1 + (state.speed - START_SPEED) / 1000;
      }
    } else {
      bgmRef.current?.pause();
    }
  }, [state.status, state.speed]);

  // Handle SFX Queue
  useEffect(() => {
    if (state.sfxQueue.length > 0) {
      state.sfxQueue.forEach(sfx => {
        const audio = sfxRefs.current[sfx];
        if (audio) {
          audio.play();
        }
      });
      // Clear queue after playing
      dispatch({ type: 'CLEAR_SFX' });
    }
  }, [state.sfxQueue, dispatch]);
};
