import { GameState, CartStatus } from '../types';
import { generateResources } from './resourceService';

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
            // Basic validation to prevent crashes from malformed old saves
            let parsed = JSON.parse(savedStateJSON);
            if (parsed && parsed.gameState && parsed.gameState.mineShafts) {
                 // --- MIGRATIONS FOR OLD SAVES ---
                if (!parsed.gameState.resources || parsed.gameState.resources.length === 0) {
                    parsed.gameState.resources = generateResources(10);
                }

                parsed.gameState.mineShafts.forEach((shaft: any) => {
                    if (shaft.skillPoints === undefined) shaft.skillPoints = 0;
                    if (shaft.unlockedSkills === undefined) shaft.unlockedSkills = [];
                    if (shaft.resourceId === undefined) shaft.resourceId = parsed.gameState.resources[0].id;
                });

                if (parsed.gameState.elevator) {
                    if (parsed.gameState.elevator.skillPoints === undefined) parsed.gameState.elevator.skillPoints = 0;
                    if (parsed.gameState.elevator.unlockedSkills === undefined) parsed.gameState.elevator.unlockedSkills = [];
                    if (parsed.gameState.elevator.storage === undefined) parsed.gameState.elevator.storage = {};
                    // Convert old `load: number` to `load: ResourceMap`
                    if (typeof parsed.gameState.elevator.load === 'number') {
                        const defaultResourceId = parsed.gameState.resources[0].id;
                        parsed.gameState.elevator.load = { [defaultResourceId]: parsed.gameState.elevator.load };
                    }
                }
                
                // Migration: Rename warehouse to market
                if (parsed.gameState.warehouse) {
                    parsed.gameState.market = parsed.gameState.warehouse;
                    delete parsed.gameState.warehouse;
                }

                if (parsed.gameState.market) {
                    if (parsed.gameState.market.skillPoints === undefined) parsed.gameState.market.skillPoints = 0;
                    if (parsed.gameState.market.unlockedSkills === undefined) parsed.gameState.market.unlockedSkills = [];
                    // Convert old `resources: number` to `resources: ResourceMap`
                    if (typeof parsed.gameState.market.resources === 'number') {
                        const defaultResourceId = parsed.gameState.resources[0].id;
                        parsed.gameState.market.resources = { [defaultResourceId]: parsed.gameState.market.resources };
                    }
                }

                // Migration: Add cart
                if (!parsed.gameState.cart) {
                    parsed.gameState.cart = {
                        level: 1,
                        load: {},
                        x: 0,
                        status: CartStatus.Idle,
                        managerLevel: 0,
                        skillPoints: 0,
                        unlockedSkills: [],
                    };
                } else {
                    // Migration: Add manager fields to existing cart
                    if (parsed.gameState.cart.managerLevel === undefined) parsed.gameState.cart.managerLevel = 0;
                    if (parsed.gameState.cart.skillPoints === undefined) parsed.gameState.cart.skillPoints = 0;
                    if (parsed.gameState.cart.unlockedSkills === undefined) parsed.gameState.cart.unlockedSkills = [];
                }

                return parsed as SavedGame;
            }
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