import { GameState, ElevatorStatus, MineShaftSkill, ElevatorSkill, MarketSkill, CartStatus, CartSkill } from './types';
import { generateResources } from './services/resourceService';

export const GAME_TICK_MS = 100;
export const MAX_SHAFTS = 12;
export const MAX_SKILL_LEVEL = 5;

export const BASE_SHAFT_COST = 100;
export const SHAFT_COST_MULTIPLIER = 20; // Increased to balance 10x production
export const UPGRADE_COST_MULTIPLIER = 1.15;

export const BASE_MANAGER_COST = 5000;
export const MANAGER_COST_MULTIPLIER = 1.6;
export const MANAGER_BONUS_MULTIPLIER = 0.5; // Shaft production bonus

// New Cart/Pipeline Constants
export const BASE_CART_COST = 500;
export const CART_ACTION_TIME = 1000; // ms to collect/deposit
export const CART_SPEED = 100; // pixels per second
export const CART_TRAVEL_DISTANCE = 150; // pixels to travel from elevator to market
export const BASE_CART_MANAGER_COST = 20000;
export const CART_MANAGER_BONUS = 0.25; // 25% capacity boost per level

// New Manager Constants
export const BASE_ELEVATOR_MANAGER_COST = 25000;
export const ELEVATOR_MANAGER_BONUS = 0.1; // 10% speed boost per level

export const BASE_MARKET_MANAGER_COST = 30000;
export const MARKET_MANAGER_BONUS = 0.01; // 1% value boost per level

// Skill System Constants
export const MANAGER_SKILL_POINT_INTERVAL = 10;

// Mineshaft Skill Effects
export const GEOLOGIST_EYE_CHANCE = 0.02; // 2%
export const GEOLOGIST_EYE_MULTIPLIER = 50;
export const DEEPER_VEINS_STORAGE_BONUS = 2; // 100% bonus
export const ADVANCED_MACHINERY_PROD_BONUS = 1.25; // 25% bonus

// Elevator Skill Effects
export const EXPRESS_LOAD_TIME_REDUCTION = 0.5; // 50% faster
export const LIGHTWEIGHT_MATERIALS_SPEED_BONUS = 1.20; // 20% bonus
export const REINFORCED_FRAME_CAPACITY_BONUS = 1.25; // 25% bonus

// Cart/Pipeline Skill Effects
export const OVERCLOCKED_PUMPS_SPEED_BONUS = 1.25; // 25% bonus
export const REINFORCED_PIPES_CAPACITY_BONUS = 1.25; // 25% bonus
export const MATTER_DUPLICATOR_CHANCE = 0.02; // 2% chance

// Market Skill Effects
export const MASTER_NEGOTIATOR_CHANCE = 0.05; // 5%
export const MASTER_NEGOTIATOR_MULTIPLIER = 2;
export const MARKET_INSIGHT_VALUE_BONUS = 1.25; // 25% bonus


export const SHAFT_POSITION_Y_OFFSET = 16; // Corresponds to pt-4 in App.tsx
export const SHAFT_POSITION_Y_INCREMENT = 128 + 16; // Corresponds to min-h-[8rem] of MineShaft.tsx + space-y-4 in App.tsx

const initialResources = generateResources(MAX_SHAFTS); // Generate resources for all possible shafts

export const INITIAL_GAME_STATE: GameState = {
    cash: 1000,
    mineShafts: [
        {
            id: 0,
            level: 1,
            resources: 0,
            resourceId: initialResources[0].id,
            y: SHAFT_POSITION_Y_OFFSET,
            managerLevel: 0,
            skillPoints: 0,
            skillLevels: {},
        },
    ],
    elevator: {
        level: 1,
        load: {},
        storage: {},
        y: 0,
        status: ElevatorStatus.Idle,
        targetY: null,
        targetShaftId: null,
        managerLevel: 0,
        skillPoints: 0,
        skillLevels: {},
    },
    cart: {
        level: 1,
        load: {},
        x: 0,
        status: CartStatus.Idle,
        managerLevel: 0,
        skillPoints: 0,
        skillLevels: {},
    },
    market: {
        level: 1,
        resources: {},
        lastDepositAmount: 0,
        managerLevel: 0,
        skillPoints: 0,
        skillLevels: {},
    },
    resources: initialResources,
    autoUpgradeTarget: null,
};

// --- Skill Definitions ---
export const MINE_SHAFT_SKILLS = [
    { id: MineShaftSkill.GEOLOGISTS_EYE, name: "Geologist's Eye", description: "Adds a 2% chance per level to discover gems worth 50x production times the skill level." },
    { id: MineShaftSkill.DEEPER_VEINS, name: "Deeper Veins", description: "Increases this shaft's storage capacity by 100% per level." },
    { id: MineShaftSkill.ADVANCED_MACHINERY, name: "Advanced Machinery", description: "Boosts this shaft's production by 25% per level." }
];

export const ELEVATOR_SKILLS = [
    { id: ElevatorSkill.EXPRESS_LOAD, name: "Express Load", description: "Cuts elevator collect/deposit time—50% at level 1 and faster with each level." },
    { id: ElevatorSkill.LIGHTWEIGHT_MATERIALS, name: "Lightweight Materials", description: "Increases the elevator's base movement speed by 20% per level." },
    { id: ElevatorSkill.REINFORCED_FRAME, name: "Reinforced Frame", description: "Increases the elevator's carrying capacity by 25% per level." }
];

export const CART_SKILLS = [
    { id: CartSkill.OVERCLOCKED_PUMPS, name: "Overclocked Pumps", description: "Increases pipeline transport speed by 25% per level." },
    { id: CartSkill.REINFORCED_PIPES, name: "Reinforced Pipes", description: "Increases pipeline transport capacity by 25% per level." },
    { id: CartSkill.MATTER_DUPLICATOR, name: "Matter Duplicator", description: "Adds a 2% chance per level to double resources collected from the elevator." }
];

export const MARKET_SKILLS = [
    { id: MarketSkill.MASTER_NEGOTIATOR, name: "Master Negotiator", description: "Adds a 5% chance per level to negotiate sales worth 2x value plus extra at higher levels." },
    { id: MarketSkill.EXPANDED_STORAGE, name: "Market Insight", description: "Increases the value of sold resources by 25% per level." },
    { id: MarketSkill.EFFICIENT_LOGISTICS, name: "Logistical Genius", description: "Reduces pipeline deposit time by 60% at level 1 and reaches instant deposits at max level." }
];