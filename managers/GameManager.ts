import { GameState, MineShaftState, ElevatorState, ElevatorStatus, WarehouseState } from '../types';
import {
    INITIAL_GAME_STATE,
    BASE_SHAFT_COST,
    SHAFT_COST_MULTIPLIER,
    UPGRADE_COST_MULTIPLIER,
    BASE_MANAGER_COST,
    MANAGER_COST_MULTIPLIER,
    MANAGER_BONUS_MULTIPLIER,
    SHAFT_POSITION_Y_OFFSET,
    SHAFT_POSITION_Y_INCREMENT,
} from '../constants';
import { saveGame, loadGame, clearSave } from '../services/gameService';

// Constants that were in App.tsx
const WAREHOUSE_SELL_RATE = 50; // resources per second
const ELEVATOR_SPEED = 100; // pixels per second
const ELEVATOR_ACTION_TIME = 1000; // ms to collect/deposit

export class GameManager {
    private gameState: GameState;
    public offlineEarnings: number = 0;
    public timeOffline: number = 0;

    constructor() {
        const savedGameData = loadGame();
        if (savedGameData) {
            const timeOffline = (Date.now() - savedGameData.lastSavedTimestamp) / 1000;
            if (timeOffline > 5) {
                this.timeOffline = timeOffline;
                const earnings = this.calculateOfflineEarnings(savedGameData.gameState, timeOffline);
                this.offlineEarnings = earnings;
                this.gameState = {
                    ...savedGameData.gameState,
                    cash: savedGameData.gameState.cash + earnings,
                };
            } else {
                this.gameState = savedGameData.gameState;
            }
        } else {
            this.gameState = JSON.parse(JSON.stringify(INITIAL_GAME_STATE));
        }
    }

    private calculateOfflineEarnings(state: GameState, timeOffline: number): number {
        const { mineShafts: savedShafts, elevator: savedElevator } = state;
        const totalProduction = savedShafts.reduce((sum, shaft) => sum + this.getShaftProduction(shaft), 0);
        const avgTravelTimePerShaft = (SHAFT_POSITION_Y_INCREMENT / ELEVATOR_SPEED);
        const elevatorCycleTime = (savedShafts.length * avgTravelTimePerShaft * 2) + (savedShafts.length * (ELEVATOR_ACTION_TIME / 1000) * 2);
        const elevatorThroughput = elevatorCycleTime > 0 ? this.getElevatorCapacity(savedElevator) / elevatorCycleTime : Infinity;
        const warehouseThroughput = WAREHOUSE_SELL_RATE;
        const effectiveIncome = Math.min(totalProduction, elevatorThroughput, warehouseThroughput);
        return Math.floor(effectiveIncome * timeOffline);
    }

    public getState = (): GameState => {
        return this.gameState;
    }

    public saveGame = (): void => {
        saveGame(this.gameState);
    }

    public resetGame = (): void => {
        clearSave();
        this.gameState = JSON.parse(JSON.stringify(INITIAL_GAME_STATE));
    }
    
    // --- Getters for calculated values ---
    public getShaftUpgradeCost = (level: number) => BASE_SHAFT_COST * Math.pow(UPGRADE_COST_MULTIPLIER, level);
    public getManagerUpgradeCost = (level: number) => BASE_MANAGER_COST * Math.pow(MANAGER_COST_MULTIPLIER, level);
    public getManagerBonusMultiplier = () => MANAGER_BONUS_MULTIPLIER;
    public getElevatorUpgradeCost = (level: number) => 173 * Math.pow(UPGRADE_COST_MULTIPLIER, level - 1);
    public getWarehouseUpgradeCost = (level: number) => 230 * Math.pow(UPGRADE_COST_MULTIPLIER, level - 1);
    public getNewShaftCost = (shaftCount: number) => 625 * Math.pow(SHAFT_COST_MULTIPLIER, shaftCount - 1);
    public getShaftProduction = (shaft: MineShaftState) => (10 * shaft.level) * (1 + shaft.managerLevel * MANAGER_BONUS_MULTIPLIER);
    public getElevatorCapacity = (elevator: ElevatorState) => 100 * elevator.level;
    public getWarehouseCapacity = (warehouse: WarehouseState) => 200 * warehouse.level;
    public getIdleIncome = (): number => {
        const { mineShafts, elevator } = this.gameState;
        const totalProduction = mineShafts.reduce((sum, shaft) => sum + this.getShaftProduction(shaft), 0);
        const avgTravelTimePerShaft = (SHAFT_POSITION_Y_INCREMENT / ELEVATOR_SPEED);
        const elevatorCycleTime = (mineShafts.length * avgTravelTimePerShaft * 2) + (mineShafts.length * (ELEVATOR_ACTION_TIME / 1000) * 2);
        const elevatorThroughput = elevatorCycleTime > 0 ? this.getElevatorCapacity(elevator) / elevatorCycleTime : Infinity;
        const warehouseThroughput = WAREHOUSE_SELL_RATE;
        return Math.min(totalProduction, elevatorThroughput, warehouseThroughput);
    }

    // --- Game Logic Update ---
    public update(deltaTime: number): void {
        const newState: GameState = this.gameState;

        // Reset one-time signals at the start of the tick
        if (newState.warehouse.lastDepositAmount) {
            newState.warehouse.lastDepositAmount = 0;
        }

        // Shaft Production
        newState.mineShafts.forEach(shaft => {
            const production = this.getShaftProduction(shaft);
            const maxResources = 1000 * shaft.level;
            shaft.resources = Math.min(maxResources, shaft.resources + production * deltaTime);
        });

        // Warehouse Selling
        const soldAmount = Math.min(newState.warehouse.resources, WAREHOUSE_SELL_RATE * deltaTime);
        if (soldAmount > 0) {
            newState.warehouse.resources -= soldAmount;
            newState.cash += soldAmount;
        }

        // Elevator Logic
        const elevatorCapacity = this.getElevatorCapacity(newState.elevator);
        switch (newState.elevator.status) {
            case ElevatorStatus.Idle:
                const targetShaft = newState.mineShafts.find(shaft => shaft.resources > 0);
                if (targetShaft) {
                    newState.elevator.targetY = targetShaft.y + 64;
                    newState.elevator.targetShaftId = targetShaft.id;
                    newState.elevator.status = ElevatorStatus.MovingDown;
                } else if (newState.elevator.load > 0) {
                    newState.elevator.targetY = 0;
                    newState.elevator.status = ElevatorStatus.MovingUp;
                }
                break;
            case ElevatorStatus.MovingDown:
                if (newState.elevator.targetY !== null) {
                    // FIX: Corrected typo from ELEVator_SPEED to ELEVATOR_SPEED
                    const moveAmount = ELEVATOR_SPEED * deltaTime;
                    if (newState.elevator.y + moveAmount >= newState.elevator.targetY) {
                        newState.elevator.y = newState.elevator.targetY;
                        const shaft = newState.mineShafts.find(s => s.id === newState.elevator.targetShaftId);
                        if (shaft) {
                            const collectAmount = Math.min(shaft.resources, elevatorCapacity - newState.elevator.load);
                            newState.elevator.load += collectAmount;
                            shaft.resources -= collectAmount;
                        }
                        if (newState.elevator.load >= elevatorCapacity) {
                            newState.elevator.targetY = 0;
                            newState.elevator.status = ElevatorStatus.MovingUp;
                        } else {
                            const currentShaftIndex = newState.mineShafts.findIndex(s => s.id === shaft?.id);
                            const nextTargetShaft = currentShaftIndex > -1 ? newState.mineShafts.slice(currentShaftIndex + 1).find(s => s.resources > 0) : undefined;
                            if (nextTargetShaft) {
                                newState.elevator.targetY = nextTargetShaft.y + 64;
                                newState.elevator.targetShaftId = nextTargetShaft.id;
                            } else {
                                newState.elevator.targetY = 0;
                                newState.elevator.status = ElevatorStatus.MovingUp;
                            }
                        }
                    } else {
                        newState.elevator.y += moveAmount;
                    }
                }
                break;
            case ElevatorStatus.MovingUp:
                if (newState.elevator.y <= 0) {
                    newState.elevator.y = 0;
                    newState.elevator.status = ElevatorStatus.Depositing;
                    newState.elevator.actionTimer = ELEVATOR_ACTION_TIME;
                } else {
                    newState.elevator.y = Math.max(0, newState.elevator.y - ELEVATOR_SPEED * deltaTime);
                }
                break;
            case ElevatorStatus.Depositing:
                newState.elevator.actionTimer! -= (deltaTime * 1000);
                if (newState.elevator.actionTimer! <= 0) {
                    const warehouseCapacity = this.getWarehouseCapacity(newState.warehouse);
                    const depositAmount = Math.min(newState.elevator.load, warehouseCapacity - newState.warehouse.resources);
                    newState.warehouse.resources += depositAmount;
                    newState.elevator.load -= depositAmount;
                    newState.warehouse.lastDepositAmount = depositAmount; // Signal for UI
                    newState.elevator.status = ElevatorStatus.Idle;
                }
                break;
        }
        this.gameState = newState;
    }
    
    // --- Player Actions ---
    public upgradeShaft(id: number): void {
        const shaft = this.gameState.mineShafts.find(s => s.id === id);
        if (!shaft) return;
        const cost = this.getShaftUpgradeCost(shaft.level);
        if (this.gameState.cash >= cost) {
            this.gameState.cash -= cost;
            shaft.level += 1;
        }
    }

    public upgradeManager(id: number): void {
        const shaft = this.gameState.mineShafts.find(s => s.id === id);
        if (!shaft) return;
        const cost = this.getManagerUpgradeCost(shaft.managerLevel);
        if (this.gameState.cash >= cost) {
            this.gameState.cash -= cost;
            shaft.managerLevel += 1;
        }
    }

    public addShaft(): void {
        const cost = this.getNewShaftCost(this.gameState.mineShafts.length);
        if (this.gameState.cash >= cost) {
            this.gameState.cash -= cost;
            const newShaft: MineShaftState = {
                id: this.gameState.mineShafts.length,
                level: 1,
                resources: 0,
                y: SHAFT_POSITION_Y_OFFSET + (this.gameState.mineShafts.length * SHAFT_POSITION_Y_INCREMENT),
                managerLevel: 0,
            };
            this.gameState.mineShafts.push(newShaft);
        }
    }

    public upgradeElevator(): void {
        const cost = this.getElevatorUpgradeCost(this.gameState.elevator.level);
        if (this.gameState.cash >= cost) {
            this.gameState.cash -= cost;
            this.gameState.elevator.level += 1;
        }
    }

    public upgradeWarehouse(): void {
        const cost = this.getWarehouseUpgradeCost(this.gameState.warehouse.level);
        if (this.gameState.cash >= cost) {
            this.gameState.cash -= cost;
            this.gameState.warehouse.level += 1;
        }
    }
}