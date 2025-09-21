import { GameState, ElevatorStatus } from './types';

export const GAME_TICK_MS = 100;

export const BASE_SHAFT_COST = 100;
export const SHAFT_COST_MULTIPLIER = 2.5;
export const UPGRADE_COST_MULTIPLIER = 1.15;

export const BASE_MANAGER_COST = 5000;
export const MANAGER_COST_MULTIPLIER = 2;
export const MANAGER_BONUS_MULTIPLIER = 0.5;

export const SHAFT_POSITION_Y_OFFSET = 70; // Position of the first shaft from the top of the ground
export const SHAFT_POSITION_Y_INCREMENT = 150; // Vertical distance between shafts

// FIX: Renamed constant to follow naming conventions (UPPER_SNAKE_CASE), resolving an import error in App.tsx.
export const INITIAL_GAME_STATE: GameState = {
    cash: 1000000,
    mineShafts: [
        { id: 0, level: 1, resources: 0, y: SHAFT_POSITION_Y_OFFSET, managerLevel: 0 },
    ],
    elevator: {
        level: 1,
        load: 0,
        y: 0,
        status: ElevatorStatus.Idle,
        targetY: null,
        targetShaftId: null,
    },
    warehouse: {
        level: 1,
        resources: 0,
        lastDepositAmount: 0,
    },
};