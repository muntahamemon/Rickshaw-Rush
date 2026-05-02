import { 
  START_SPEED, START_HEALTH, SPAWN_RATE_START, 
  SPEED_INCREMENT, MAX_SPEED, LEVEL_UP_SCORE, SHIELD_DURATION,
  RICKSHAW_Y, RICKSHAW_WIDTH, RICKSHAW_HEIGHT, ENTITY_SIZE, COW_WIDTH, COW_HEIGHT, LOGICAL_HEIGHT
} from './constants';

export type GameStatus = 'start' | 'playing' | 'gameover';
export type EntityType = 'pothole' | 'cow' | 'chai' | 'paratha';

export interface Entity {
  id: string;
  type: EntityType;
  lane: number; // 0, 1, 2
  y: number;
  width: number;
  height: number;
  speed: number; // For cows that might move (if any)
}

export interface GameState {
  status: GameStatus;
  score: number;
  chaiCount: number;
  health: number;
  speed: number;
  spawnRate: number;
  lane: number;
  entities: Entity[];
  shieldActive: boolean;
  shieldTimeRemaining: number;
  distance: number;
  lastSpawnTime: number;
  sfxQueue: string[];
}

export type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'TICK'; payload: { deltaTime: number, time: number } }
  | { type: 'MOVE_LANE'; payload: -1 | 1 }
  | { type: 'CLEAR_SFX' }
  | { type: 'RESTART' };

export const initialState: GameState = {
  status: 'start',
  score: 0,
  chaiCount: 0,
  health: START_HEALTH,
  speed: START_SPEED,
  spawnRate: SPAWN_RATE_START,
  lane: 1,
  entities: [],
  shieldActive: false,
  shieldTimeRemaining: 0,
  distance: 0,
  lastSpawnTime: 0,
  sfxQueue: [],
};

const checkCollision = (rickshawLane: number, entity: Entity) => {
  if (rickshawLane !== entity.lane) return false;
  
  // Rickshaw bounds
  const rLeft = 0; 
  const rRight = RICKSHAW_WIDTH;
  const rTop = RICKSHAW_Y;
  const rBottom = RICKSHAW_Y + RICKSHAW_HEIGHT;

  // Entity bounds (local to their lane)
  const eLeft = (entity.width < RICKSHAW_WIDTH) ? (RICKSHAW_WIDTH - entity.width) / 2 : 0;
  const eRight = eLeft + entity.width;
  const eTop = entity.y;
  const eBottom = entity.y + entity.height;

  return (
    rLeft < eRight &&
    rRight > eLeft &&
    rTop < eBottom &&
    rBottom > eTop
  );
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return { ...initialState, status: 'playing', sfxQueue: ['start_engine'] };

    case 'RESTART':
      return { ...initialState, status: 'playing', sfxQueue: ['start_engine'] };

    case 'MOVE_LANE': {
      if (state.status !== 'playing') return state;
      const newLane = Math.max(0, Math.min(2, state.lane + action.payload));
      if (newLane !== state.lane) {
         return {
           ...state,
           lane: newLane,
           sfxQueue: [...state.sfxQueue, 'horn']
         };
      }
      return state;
    }

    case 'CLEAR_SFX':
      return { ...state, sfxQueue: [] };

    case 'TICK': {
      if (state.status !== 'playing') return state;
      
      const { deltaTime, time } = action.payload;
      
      // Update distance and score
      // Score increases proportionally to distance covered
      const distanceDelta = (state.speed * deltaTime) / 1000;
      const newDistance = state.distance + distanceDelta;
      // Let's say 1 score per 10 pixels
      const distanceScore = Math.floor(newDistance / 10);
      // Wait, let's keep base score as distanceScore + chai * 50
      
      let nextSpeed = START_SPEED + Math.floor(distanceScore / LEVEL_UP_SCORE) * SPEED_INCREMENT;
      if (nextSpeed > MAX_SPEED) nextSpeed = MAX_SPEED;

      let nextSpawnRate = SPAWN_RATE_START - Math.floor(distanceScore / LEVEL_UP_SCORE) * 100;
      if (nextSpawnRate < 600) nextSpawnRate = 600;

      // Shield timer
      let nextShieldActive = state.shieldActive;
      let nextShieldTimeRemaining = state.shieldTimeRemaining;
      if (state.shieldActive) {
        nextShieldTimeRemaining -= deltaTime;
        if (nextShieldTimeRemaining <= 0) {
          nextShieldActive = false;
          nextShieldTimeRemaining = 0;
        }
      }

      // Move entities
      let nextHealth = state.health;
      let nextChaiCount = state.chaiCount;
      const nextSfxQueue = [...state.sfxQueue];
      let comboScore = 0;

      const remainingEntities: Entity[] = [];

      for (const entity of state.entities) {
        // Move down
        const newY = entity.y + (state.speed * deltaTime) / 1000;
        
        let shouldKeep = newY < LOGICAL_HEIGHT + 100;
        
        if (shouldKeep) {
          const updatedEntity = { ...entity, y: newY };
          
          // Collision check
          if (checkCollision(state.lane, updatedEntity)) {
            shouldKeep = false; // Remove entity on collision
            
            if (updatedEntity.type === 'chai') {
              nextChaiCount += 1;
              comboScore += 50;
              nextSfxQueue.push('tink');
            } else if (updatedEntity.type === 'paratha') {
              nextShieldActive = true;
              nextShieldTimeRemaining = SHIELD_DURATION;
              comboScore += 20;
              nextSfxQueue.push('powerup');
            } else if (!state.shieldActive) {
              if (updatedEntity.type === 'pothole') {
                nextHealth -= 20;
                nextSfxQueue.push('thud');
              } else if (updatedEntity.type === 'cow') {
                nextHealth -= 40;
                nextSfxQueue.push('moo');
              }
            } else {
               // Hit hazard while shielded, just play a blocked sound
               nextSfxQueue.push('shield_block');
            }
          }
          
          if (shouldKeep) {
            remainingEntities.push(updatedEntity);
          }
        }
      }

      // Spawn new entity
      let nextLastSpawnTime = state.lastSpawnTime;
      if (time - state.lastSpawnTime > state.spawnRate) {
        nextLastSpawnTime = time;
        
        const lane = Math.floor(Math.random() * 3);
        const rand = Math.random();
        let type: EntityType = 'pothole';
        let width = ENTITY_SIZE;
        let height = ENTITY_SIZE;

        if (rand < 0.2) {
          type = 'chai';
          width = 40; height = 40;
        } else if (rand < 0.25) {
          type = 'paratha';
          width = 40; height = 40;
        } else if (rand < 0.5) {
          type = 'cow';
          width = COW_WIDTH; height = COW_HEIGHT;
        }

        remainingEntities.push({
          id: `entity_${Math.random().toString(36).substring(2,9)}`,
          type,
          lane,
          y: -100, // spawn above screen
          width,
          height,
          speed: 0
        });
      }

      const totalScore = distanceScore + (nextChaiCount * 50) + comboScore;
      let nextStatus: 'start' | 'playing' | 'gameover' = state.status;
      if (nextHealth <= 0) {
        nextStatus = 'gameover';
        nextSfxQueue.push('gameover');
      }

      return {
        ...state,
        status: nextStatus,
        distance: newDistance,
        score: totalScore,
        speed: nextSpeed,
        spawnRate: nextSpawnRate,
        health: nextHealth,
        chaiCount: nextChaiCount,
        shieldActive: nextShieldActive,
        shieldTimeRemaining: nextShieldTimeRemaining,
        entities: remainingEntities,
        lastSpawnTime: nextLastSpawnTime,
        sfxQueue: nextSfxQueue
      };
    }

    default:
      return state;
  }
};
