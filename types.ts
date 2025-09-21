export interface GameState {
    cash: number;
    mineShafts: MineShaftState[];
    elevator: ElevatorState;
    warehouse: WarehouseState;
}

export interface MineShaftState {
    id: number;
    level: number;
    resources: number;
    y: number; // Vertical position
    managerLevel: number;
}

export enum ElevatorStatus {
    Idle,
    MovingDown,
    Collecting,
    MovingUp,
    Depositing,
}

export interface ElevatorState {
    level: number;
    load: number;
    y: number;
    status: ElevatorStatus;
    targetY: number | null;
    targetShaftId: number | null;
    actionTimer?: number;
}

export interface WarehouseState {
    level: number;
    resources: number;
    lastDepositAmount?: number;
}