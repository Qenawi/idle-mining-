import { Resource } from './services/resourceService';

// --- Skills ---
export enum MineShaftSkill {
    GEOLOGISTS_EYE = 'geologists-eye',
    DEEPER_VEINS = 'deeper-veins',
    ADVANCED_MACHINERY = 'advanced-machinery',
}

export enum ElevatorSkill {
    EXPRESS_LOAD = 'express-load',
    LIGHTWEIGHT_MATERIALS = 'lightweight-materials',
    REINFORCED_FRAME = 'reinforced-frame',
}

export enum CartSkill {
    OVERCLOCKED_PUMPS = 'overclocked-pumps',
    REINFORCED_PIPES = 'reinforced-pipes',
    MATTER_DUPLICATOR = 'matter-duplicator',
}

export enum MarketSkill {
    MASTER_NEGOTIATOR = 'master-negotiator',
    EXPANDED_STORAGE = 'expanded-storage',
    EFFICIENT_LOGISTICS = 'efficient-logistics',
}

// --- Game State ---
export type ResourceMap = { [resourceId: string]: number };

export interface MineShaftState {
    id: number;
    level: number;
    resources: number; // A single shaft produces one type of resource
    resourceId: string;
    y: number;
    managerLevel: number;
    skillPoints: number;
    unlockedSkills: MineShaftSkill[];
}

export enum ElevatorStatus {
    Idle,
    MovingDown,
    MovingUp,
    Depositing,
}

export interface ElevatorState {
    level: number;
    load: ResourceMap; // Elevator can carry multiple resource types
    storage: ResourceMap; // Elevator's own warehouse at the top
    y: number;
    status: ElevatorStatus;
    targetY: number | null;
    targetShaftId: number | null;
    managerLevel: number;
    skillPoints: number;
    unlockedSkills: ElevatorSkill[];
    actionTimer?: number;
}

export enum CartStatus {
    Idle,
    Collecting,
    MovingToMarket,
    Depositing,
    Returning,
}

export interface CartState {
    level: number;
    load: ResourceMap;
    x: number; // horizontal position
    status: CartStatus;
    actionTimer?: number;
    managerLevel: number;
    skillPoints: number;
    unlockedSkills: CartSkill[];
}

export interface MarketState {
    level: number;
    resources: ResourceMap; // Market stores multiple resource types for selling
    lastDepositAmount: number;
    managerLevel: number;
    skillPoints: number;
    unlockedSkills: MarketSkill[];
}

export interface GameState {
    cash: number;
    mineShafts: MineShaftState[];
    elevator: ElevatorState;
    cart: CartState;
    market: MarketState;
    resources: Resource[];
}

// --- UI Types ---
export type ModalManagerInfo = 
    | { type: 'mineshaft'; data: MineShaftState }
    | { type: 'elevator'; data: ElevatorState }
    | { type: 'market'; data: MarketState }
    | { type: 'cart'; data: CartState };

export type UpgradeAmount = 1 | 10 | 'MAX';

export type UpgradeModalInfo =
    | { type: 'mineshaft'; id: number; data: MineShaftState }
    | { type: 'elevator'; data: ElevatorState }
    | { type: 'market'; data: MarketState }
    | { type: 'cart'; data: CartState };