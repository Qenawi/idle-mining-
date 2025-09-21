import { GameState } from '../types';

const GAME_STATE_KEY = 'idleMiningTycoonState';

interface SavedGame {
    gameState: GameState;
    lastSavedTimestamp: number;
}

export const saveGame = (gameState: GameState): void => {
    try {
        const stateToSave: SavedGame = {
            gameState,
            lastSavedTimestamp: Date.now(),
        };
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
        console.error("Failed to save game state:", error);
    }
};

export const loadGame = (): SavedGame | null => {
    try {
        const savedStateJSON = localStorage.getItem(GAME_STATE_KEY);
        if (savedStateJSON) {
            return JSON.parse(savedStateJSON) as SavedGame;
        }
        return null;
    } catch (error) {
        console.error("Failed to load game state:", error);
        return null;
    }
};

export const clearSave = (): void => {
    try {
        localStorage.removeItem(GAME_STATE_KEY);
    } catch (error) {
        console.error("Failed to clear game state:", error);
    }
};
