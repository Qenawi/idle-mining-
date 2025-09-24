import { GameState, MineShaftState, ElevatorState, ElevatorStatus, MarketState, MineShaftSkill, MarketSkill, UpgradeAmount, ResourceMap, CartState, ElevatorSkill, CartStatus, CartSkill, AutoUpgradeTarget } from '../types';
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
    BASE_ELEVATOR_MANAGER_COST,
    ELEVATOR_MANAGER_BONUS,
    BASE_MARKET_MANAGER_COST,
    MARKET_MANAGER_BONUS,
    MANAGER_SKILL_POINT_INTERVAL,
    GEOLOGIST_EYE_CHANCE,
    GEOLOGIST_EYE_MULTIPLIER,
    DEEPER_VEINS_STORAGE_BONUS,
    ADVANCED_MACHINERY_PROD_BONUS,
    EXPRESS_LOAD_TIME_REDUCTION,
    LIGHTWEIGHT_MATERIALS_SPEED_BONUS,
    REINFORCED_FRAME_CAPACITY_BONUS,
    MASTER_NEGOTIATOR_CHANCE,
    MASTER_NEGOTIATOR_MULTIPLIER,
    BASE_CART_COST,
    CART_ACTION_TIME,
    CART_SPEED,
    CART_TRAVEL_DISTANCE,
    BASE_CART_MANAGER_COST,
    CART_MANAGER_BONUS,
    OVERCLOCKED_PUMPS_SPEED_BONUS,
    REINFORCED_PIPES_CAPACITY_BONUS,
    MATTER_DUPLICATOR_CHANCE,
    MAX_SKILL_LEVEL,
    MAX_SHAFTS,
    MARKET_INSIGHT_VALUE_BONUS,
} from '../constants';
import { saveGame, loadGame, clearSave } from '../services/gameService';
import { Resource } from '../services/resourceService';

// Constants that were in App.tsx
const ELEVATOR_SPEED = 100; // pixels per second
const ELEVATOR_ACTION_TIME = 1000; // ms to collect/deposit

// Visual positioning constants - should match Tailwind CSS classes
const SHAFT_HEIGHT_PX = 128; // From `min-h-[8rem]` in MineShaft.tsx
const ELEVATOR_HEIGHT_PX = 56; // From `h-14` in Elevator.tsx
const ELEVATOR_STOP_Y_OFFSET = Math.round((SHAFT_HEIGHT_PX / 2) - (ELEVATOR_HEIGHT_PX / 2)); // Vertically center elevator on shaft

export class GameManager {
    private gameState: GameState;
    private resourceMap: Map<string, Resource>;
    public offlineEarnings: number = 0;
    public timeOffline: number = 0;

    constructor() {
        const savedGameData = loadGame();
        if (savedGameData) {
            this.gameState = savedGameData.gameState;
        } else {
            this.gameState = JSON.parse(JSON.stringify(INITIAL_GAME_STATE));
        }

        this.resourceMap = new Map(this.gameState.resources.map(r => [r.id, r]));

        if (savedGameData) {
            const timeOffline = (Date.now() - savedGameData.lastSavedTimestamp) / 1000;
            if (timeOffline > 5) {
                this.timeOffline = timeOffline;
                const earnings = this.calculateOfflineEarnings(this.gameState, timeOffline);
                this.offlineEarnings = earnings;
                this.gameState.cash += earnings;
            }
        }
    }

    private calculateOfflineEarnings(state: GameState, timeOffline: number): number {
        const idleCashPerSecond = this.getIdleIncome();
        return Math.floor(idleCashPerSecond * timeOffline);
    }
    
    private getResourceValue(resourceId: string): number {
        return this.resourceMap.get(resourceId)?.value || 0;
    }

    private getTotalResourceCount(resourceMap: ResourceMap): number {
        return Object.values(resourceMap).reduce((sum, count) => sum + count, 0);
    }

    private getSkillLevel<T extends string>(skillLevels: Partial<Record<T, number>> | undefined, skill: T): number {
        return skillLevels?.[skill] ?? 0;
    }

    private getAdditiveMultiplier(base: number, level: number): number {
        if (level <= 0) return 1;
        return 1 + (base - 1) * level;
    }

    private getScaledChance(baseChance: number, level: number): number {
        if (level <= 0) return 0;
        return Math.min(1, baseChance * level);
    }

    private getTimeReductionMultiplier(baseReduction: number, level: number): number {
        if (level <= 0) return 1;
        const extraPerLevel = baseReduction / MAX_SKILL_LEVEL;
        const totalReduction = baseReduction + (level - 1) * extraPerLevel;
        return Math.max(0.1, 1 - totalReduction);
    }

    private getDepositTimeMultiplier(level: number): number {
        if (level <= 0) return 1;
        const baseReduction = 0.6;
        const perLevelBonus = 0.1;
        const totalReduction = baseReduction + (level - 1) * perLevelBonus;
        return Math.max(0, 1 - totalReduction);
    }

    public getState = (): GameState => {
        return this.gameState;
    }

    public getAutoUpgradeTarget = (): AutoUpgradeTarget | null => {
        return this.gameState.autoUpgradeTarget;
    }

    public saveGame = (): void => {
        saveGame(this.gameState);
    }

    public resetGame = (): void => {
        clearSave();
        const freshState = JSON.parse(JSON.stringify(INITIAL_GAME_STATE));
        this.gameState = freshState;
        this.resourceMap = new Map(this.gameState.resources.map(r => [r.id, r]));
    }

    public setAutoUpgradeTarget = (target: AutoUpgradeTarget | null): void => {
        if (target && target.type === 'mineshaft') {
            const exists = this.gameState.mineShafts.some(shaft => shaft.id === target.id);
            if (!exists) {
                this.gameState.autoUpgradeTarget = null;
                return;
            }
        }

        this.gameState.autoUpgradeTarget = target;
    }
    
    // --- Getters for calculated values ---
    public getShaftUpgradeCost = (level: number) => BASE_SHAFT_COST * Math.pow(UPGRADE_COST_MULTIPLIER, level);
    public getManagerUpgradeCost = (level: number) => BASE_MANAGER_COST * Math.pow(MANAGER_COST_MULTIPLIER, level);
    public getElevatorManagerUpgradeCost = (level: number) => BASE_ELEVATOR_MANAGER_COST * Math.pow(MANAGER_COST_MULTIPLIER, level);
    public getMarketManagerUpgradeCost = (level: number) => BASE_MARKET_MANAGER_COST * Math.pow(MANAGER_COST_MULTIPLIER, level);
    public getCartManagerUpgradeCost = (level: number) => BASE_CART_MANAGER_COST * Math.pow(MANAGER_COST_MULTIPLIER, level);

    public getManagerBonusMultiplier = () => MANAGER_BONUS_MULTIPLIER;
    public getElevatorUpgradeCost = (level: number) => 173 * Math.pow(UPGRADE_COST_MULTIPLIER, level - 1);
    public getMarketUpgradeCost = (level: number) => 230 * Math.pow(UPGRADE_COST_MULTIPLIER, level - 1);
    public getCartUpgradeCost = (level: number) => BASE_CART_COST * Math.pow(UPGRADE_COST_MULTIPLIER, level);
    public getNewShaftCost = (shaftCount: number) => 625 * Math.pow(SHAFT_COST_MULTIPLIER, shaftCount - 1);
    
    public getShaftProduction = (shaft: MineShaftState): number => {
        const baseProduction = 10 * Math.pow(10, shaft.id);
        let production = (baseProduction * shaft.level) * (1 + shaft.managerLevel * MANAGER_BONUS_MULTIPLIER);
        const machineryLevel = this.getSkillLevel(shaft.skillLevels, MineShaftSkill.ADVANCED_MACHINERY);
        if (machineryLevel > 0) {
            production *= this.getAdditiveMultiplier(ADVANCED_MACHINERY_PROD_BONUS, machineryLevel);
        }
        return production;
    }

    public getShaftCapacity = (shaft: MineShaftState): number => {
        const baseCapacity = 1000 * Math.pow(10, shaft.id);
        let capacity = baseCapacity * shaft.level;
        const storageLevel = this.getSkillLevel(shaft.skillLevels, MineShaftSkill.DEEPER_VEINS);
        if (storageLevel > 0) {
            capacity *= this.getAdditiveMultiplier(DEEPER_VEINS_STORAGE_BONUS, storageLevel);
        }
        return capacity;
    }

    public getElevatorCapacity = (elevator: ElevatorState): number => {
        let capacity = 100 * elevator.level;
        const frameLevel = this.getSkillLevel(elevator.skillLevels, ElevatorSkill.REINFORCED_FRAME);
        if (frameLevel > 0) {
            capacity *= this.getAdditiveMultiplier(REINFORCED_FRAME_CAPACITY_BONUS, frameLevel);
        }
        return capacity;
    }

    public getElevatorStorageCapacity = (elevator: ElevatorState): number => 1000 * elevator.level;
    public getCartCapacity = (cart: CartState): number => {
        let capacity = 150 * cart.level * (1 + cart.managerLevel * CART_MANAGER_BONUS);
        const reinforcementLevel = this.getSkillLevel(cart.skillLevels, CartSkill.REINFORCED_PIPES);
        if (reinforcementLevel > 0) {
            capacity *= this.getAdditiveMultiplier(REINFORCED_PIPES_CAPACITY_BONUS, reinforcementLevel);
        }
        return capacity;
    }

    private getCartSpeed = (cart: CartState): number => {
        let speed = CART_SPEED;
        const pumpLevel = this.getSkillLevel(cart.skillLevels, CartSkill.OVERCLOCKED_PUMPS);
        if (pumpLevel > 0) {
            speed *= this.getAdditiveMultiplier(OVERCLOCKED_PUMPS_SPEED_BONUS, pumpLevel);
        }
        return speed;
    }

    public getElevatorSpeed = (elevator: ElevatorState): number => {
        let speed = ELEVATOR_SPEED * (1 + elevator.managerLevel * ELEVATOR_MANAGER_BONUS);
        const lightweightLevel = this.getSkillLevel(elevator.skillLevels, ElevatorSkill.LIGHTWEIGHT_MATERIALS);
        if (lightweightLevel > 0) {
            speed *= this.getAdditiveMultiplier(LIGHTWEIGHT_MATERIALS_SPEED_BONUS, lightweightLevel);
        }
        return speed;
    }

    private getElevatorActionTime = (elevator: ElevatorState): number => {
        let time = ELEVATOR_ACTION_TIME;
        const expressLevel = this.getSkillLevel(elevator.skillLevels, ElevatorSkill.EXPRESS_LOAD);
        if (expressLevel > 0) {
            time *= this.getTimeReductionMultiplier(1 - EXPRESS_LOAD_TIME_REDUCTION, expressLevel);
        }
        return time;
    }

    public getMarketValueMultiplier = (market: MarketState): number => {
        let multiplier = 1 + (market.level - 1) * 0.01; // 1% per level above 1
        multiplier += market.managerLevel * MARKET_MANAGER_BONUS;

        const insightLevel = this.getSkillLevel(market.skillLevels, MarketSkill.EXPANDED_STORAGE);
        if (insightLevel > 0) {
            multiplier *= this.getAdditiveMultiplier(MARKET_INSIGHT_VALUE_BONUS, insightLevel);
        }
        return multiplier;
    }

    public getIdleIncome = (): number => {
        const { mineShafts, elevator, cart } = this.gameState;
        
        const totalProductionUnits = mineShafts.reduce((sum, shaft) => sum + this.getShaftProduction(shaft), 0);
        const productionValuePerSecond = mineShafts.reduce((sum, shaft) => {
            const production = this.getShaftProduction(shaft);
            const value = this.getResourceValue(shaft.resourceId);
            return sum + (production * value);
        }, 0);
        const avgResourceValue = totalProductionUnits > 0 ? productionValuePerSecond / totalProductionUnits : 0;
        
        const elevatorActionTime = this.getElevatorActionTime(elevator) / 1000;
        const avgTravelTimePerShaft = (SHAFT_POSITION_Y_INCREMENT / this.getElevatorSpeed(elevator));
        const elevatorCycleTime = (mineShafts.length * avgTravelTimePerShaft * 2) + (mineShafts.length * elevatorActionTime * 2);
        const elevatorThroughputUnits = elevatorCycleTime > 0 ? this.getElevatorCapacity(elevator) / elevatorCycleTime : Infinity;
        
        const cartActionTime = (CART_ACTION_TIME * 2) / 1000;
        const cartTravelTime = (CART_TRAVEL_DISTANCE / this.getCartSpeed(cart)) * 2;
        const cartCycleTime = cartActionTime + cartTravelTime;
        const cartThroughputUnits = cartCycleTime > 0 ? this.getCartCapacity(cart) / cartCycleTime : Infinity;

        const minThroughputUnits = Math.min(totalProductionUnits, elevatorThroughputUnits, cartThroughputUnits);

        return minThroughputUnits * avgResourceValue;
    }

    // --- Bulk Upgrade Calculations ---
    private calculateBulkCost(startLevel: number, count: number, costFn: (level: number) => number, costMultiplier: number): number {
        if (count <= 0) return 0;
        if (count === 1) return costFn(startLevel);

        const firstUpgradeCost = costFn(startLevel);
        if (costMultiplier === 1) return firstUpgradeCost * count;
        
        return firstUpgradeCost * (1 - Math.pow(costMultiplier, count)) / (1 - costMultiplier);
    }

    private calculateMaxAffordableLevels(startLevel: number, cash: number, costFn: (level: number) => number, costMultiplier: number): { levels: number, cost: number } {
        const firstUpgradeCost = costFn(startLevel);
        if (cash < firstUpgradeCost) return { levels: 0, cost: 0 };
        if (costMultiplier === 1) {
            const levels = Math.floor(cash / firstUpgradeCost);
            return { levels, cost: levels * firstUpgradeCost };
        }
        
        const ratio = costMultiplier;
        let numLevels = Math.floor(Math.log((cash * (ratio - 1) / firstUpgradeCost) + 1) / Math.log(ratio));
        
        if (numLevels <= 0) {
            numLevels = cash >= firstUpgradeCost ? 1 : 0;
        }
    
        const totalCost = this.calculateBulkCost(startLevel, numLevels, costFn, costMultiplier);
        return { levels: numLevels, cost: totalCost };
    }

    private getUpgradeInfo(
        currentLevel: number, 
        amount: UpgradeAmount,
        cash: number, 
        costFn: (level: number) => number, 
        costMultiplier: number
    ): { levels: number, cost: number } {
        if (amount === 'MAX') {
            return this.calculateMaxAffordableLevels(currentLevel, cash, costFn, costMultiplier);
        } else {
            const cost = this.calculateBulkCost(currentLevel, amount, costFn, costMultiplier);
            return { levels: amount, cost };
        }
    }

    public getShaftUpgradeInfo(shaft: MineShaftState, amount: UpgradeAmount, cash: number) {
        return this.getUpgradeInfo(shaft.level, amount, cash, this.getShaftUpgradeCost, UPGRADE_COST_MULTIPLIER);
    }

    public getElevatorUpgradeInfo(elevator: ElevatorState, amount: UpgradeAmount, cash: number) {
        return this.getUpgradeInfo(elevator.level, amount, cash, (l) => this.getElevatorUpgradeCost(l), UPGRADE_COST_MULTIPLIER);
    }
    
    public getMarketUpgradeInfo(market: MarketState, amount: UpgradeAmount, cash: number) {
        return this.getUpgradeInfo(market.level, amount, cash, (l) => this.getMarketUpgradeCost(l), UPGRADE_COST_MULTIPLIER);
    }

    public getCartUpgradeInfo(cart: CartState, amount: UpgradeAmount, cash: number) {
        return this.getUpgradeInfo(cart.level, amount, cash, this.getCartUpgradeCost, UPGRADE_COST_MULTIPLIER);
    }

    public getManagerUpgradeInfo(manager: { managerLevel: number }, amount: UpgradeAmount, cash: number) {
        return this.getUpgradeInfo(manager.managerLevel, amount, cash, this.getManagerUpgradeCost, MANAGER_COST_MULTIPLIER);
    }

    public getElevatorManagerUpgradeInfo(manager: { managerLevel: number }, amount: UpgradeAmount, cash: number) {
        return this.getUpgradeInfo(manager.managerLevel, amount, cash, this.getElevatorManagerUpgradeCost, MANAGER_COST_MULTIPLIER);
    }

    public getMarketManagerUpgradeInfo(manager: { managerLevel: number }, amount: UpgradeAmount, cash: number) {
        return this.getUpgradeInfo(manager.managerLevel, amount, cash, this.getMarketManagerUpgradeCost, MANAGER_COST_MULTIPLIER);
    }

    public getCartManagerUpgradeInfo(manager: { managerLevel: number }, amount: UpgradeAmount, cash: number) {
        return this.getUpgradeInfo(manager.managerLevel, amount, cash, this.getCartManagerUpgradeCost, MANAGER_COST_MULTIPLIER);
    }


    // --- Game Logic Update ---
    public update(deltaTime: number): void {
        const state = this.gameState;

        if (state.market.lastDepositAmount) {
            state.market.lastDepositAmount = 0;
        }

        // --- Shaft Production ---
        state.mineShafts.forEach(shaft => {
            const production = this.getShaftProduction(shaft);
            const maxResources = this.getShaftCapacity(shaft);
            shaft.resources = Math.min(maxResources, shaft.resources + production * deltaTime);

            const geologistLevel = this.getSkillLevel(shaft.skillLevels, MineShaftSkill.GEOLOGISTS_EYE);
            if (geologistLevel > 0) {
                const chance = this.getScaledChance(GEOLOGIST_EYE_CHANCE, geologistLevel);
                if (Math.random() < chance) {
                    const bonusMultiplier = GEOLOGIST_EYE_MULTIPLIER * geologistLevel;
                    const bonusCash = production * this.getResourceValue(shaft.resourceId) * bonusMultiplier;
                    state.cash += bonusCash;
                }
            }
        });
        
        // --- Elevator Logic ---
        this.updateElevator(deltaTime);
        
        // --- Cart Logic ---
        this.updateCart(deltaTime);

        this.processAutoUpgrade();

        this.gameState = state;
    }

    private processAutoUpgrade(): void {
        const target = this.gameState.autoUpgradeTarget;
        if (!target) return;

        switch (target.type) {
            case 'mineshaft': {
                const shaft = this.gameState.mineShafts.find(s => s.id === target.id);
                if (!shaft) {
                    this.gameState.autoUpgradeTarget = null;
                    return;
                }

                if (target.subject === 'level') {
                    const upgradeInfo = this.getShaftUpgradeInfo(shaft, 1, this.gameState.cash);
                    if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
                        this.upgradeShaft(shaft.id, 1);
                    }
                } else {
                    const upgradeInfo = this.getManagerUpgradeInfo(shaft, 1, this.gameState.cash);
                    if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
                        this.upgradeManager(shaft.id, 1);
                    }
                }
                break;
            }
            case 'elevator': {
                if (target.subject === 'level') {
                    const upgradeInfo = this.getElevatorUpgradeInfo(this.gameState.elevator, 1, this.gameState.cash);
                    if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
                        this.upgradeElevator(1);
                    }
                } else {
                    const upgradeInfo = this.getElevatorManagerUpgradeInfo(this.gameState.elevator, 1, this.gameState.cash);
                    if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
                        this.upgradeElevatorManager(1);
                    }
                }
                break;
            }
            case 'market': {
                if (target.subject === 'level') {
                    const upgradeInfo = this.getMarketUpgradeInfo(this.gameState.market, 1, this.gameState.cash);
                    if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
                        this.upgradeMarket(1);
                    }
                } else {
                    const upgradeInfo = this.getMarketManagerUpgradeInfo(this.gameState.market, 1, this.gameState.cash);
                    if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
                        this.upgradeMarketManager(1);
                    }
                }
                break;
            }
            case 'cart': {
                if (target.subject === 'level') {
                    const upgradeInfo = this.getCartUpgradeInfo(this.gameState.cart, 1, this.gameState.cash);
                    if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
                        this.upgradeCart(1);
                    }
                } else {
                    const upgradeInfo = this.getCartManagerUpgradeInfo(this.gameState.cart, 1, this.gameState.cash);
                    if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
                        this.upgradeCartManager(1);
                    }
                }
                break;
            }
        }
    }

    private updateElevator(deltaTime: number): void {
        const { elevator, mineShafts } = this.gameState;
        const elevatorCapacity = this.getElevatorCapacity(elevator);
        const elevatorSpeed = this.getElevatorSpeed(elevator);
        const elevatorActionTime = this.getElevatorActionTime(elevator);
        const currentElevatorLoad = this.getTotalResourceCount(elevator.load);
        
        switch (elevator.status) {
            case ElevatorStatus.Idle:
                const targetShaft = mineShafts.find(shaft => shaft.resources > 0);
                if (targetShaft && currentElevatorLoad < elevatorCapacity) {
                    elevator.targetY = targetShaft.y + ELEVATOR_STOP_Y_OFFSET;
                    elevator.targetShaftId = targetShaft.id;
                    elevator.status = ElevatorStatus.MovingDown;
                } else if (currentElevatorLoad > 0) {
                    elevator.targetY = 0;
                    elevator.status = ElevatorStatus.MovingUp;
                }
                break;

            case ElevatorStatus.MovingDown:
                if (elevator.targetY !== null) {
                    const moveAmount = elevatorSpeed * deltaTime;
                    if (elevator.y + moveAmount >= elevator.targetY) {
                        elevator.y = elevator.targetY;
                        const shaft = mineShafts.find(s => s.id === elevator.targetShaftId);
                        if (shaft) {
                            const spaceInElevator = elevatorCapacity - currentElevatorLoad;
                            const collectAmount = Math.min(shaft.resources, spaceInElevator);
                            
                            elevator.load[shaft.resourceId] = (elevator.load[shaft.resourceId] || 0) + collectAmount;
                            shaft.resources -= collectAmount;
                        }

                        if (this.getTotalResourceCount(elevator.load) >= elevatorCapacity) {
                            elevator.targetY = 0;
                            elevator.status = ElevatorStatus.MovingUp;
                        } else {
                            const currentShaftIndex = mineShafts.findIndex(s => s.id === shaft?.id);
                            const nextTargetShaft = currentShaftIndex > -1 ? mineShafts.slice(currentShaftIndex + 1).find(s => s.resources > 0) : undefined;
                            if (nextTargetShaft) {
                                elevator.targetY = nextTargetShaft.y + ELEVATOR_STOP_Y_OFFSET;
                                elevator.targetShaftId = nextTargetShaft.id;
                            } else {
                                elevator.targetY = 0;
                                elevator.status = ElevatorStatus.MovingUp;
                            }
                        }
                    } else {
                        elevator.y += moveAmount;
                    }
                }
                break;

            case ElevatorStatus.MovingUp:
                if (elevator.y <= 0) {
                    elevator.y = 0;
                    elevator.status = ElevatorStatus.Depositing;
                    elevator.actionTimer = elevatorActionTime;
                } else {
                    elevator.y = Math.max(0, elevator.y - elevatorSpeed * deltaTime);
                }
                break;

            case ElevatorStatus.Depositing:
                elevator.actionTimer! -= (deltaTime * 1000);
                if (elevator.actionTimer! <= 0) {
                    const storageCapacity = this.getElevatorStorageCapacity(elevator);
                    const currentStorageLoad = this.getTotalResourceCount(elevator.storage);
                    let spaceInStorage = storageCapacity - currentStorageLoad;
                    
                    for (const resourceId in elevator.load) {
                        if(spaceInStorage <= 0) break;
                        const amountToDeposit = Math.min(elevator.load[resourceId], spaceInStorage);
                        if (amountToDeposit > 0) {
                            elevator.storage[resourceId] = (elevator.storage[resourceId] || 0) + amountToDeposit;
                            elevator.load[resourceId] -= amountToDeposit;
                            if (elevator.load[resourceId] <= 0) {
                                delete elevator.load[resourceId];
                            }
                            spaceInStorage -= amountToDeposit;
                        }
                    }
                    elevator.status = ElevatorStatus.Idle;
                }
                break;
        }
    }

    private updateCart(deltaTime: number): void {
        const { cart, elevator, market } = this.gameState;
        const cartSpeed = this.getCartSpeed(cart);

        switch (cart.status) {
            case CartStatus.Idle:
                const elevatorHasResources = this.getTotalResourceCount(elevator.storage) > 0;
                const cartHasSpace = this.getTotalResourceCount(cart.load) < this.getCartCapacity(cart);
                if (elevatorHasResources && cartHasSpace) {
                    cart.status = CartStatus.Collecting;
                    cart.actionTimer = CART_ACTION_TIME;
                }
                break;

            case CartStatus.Collecting:
                cart.actionTimer! -= (deltaTime * 1000);
                if (cart.actionTimer! <= 0) {
                    const cartCapacity = this.getCartCapacity(cart);
                    let spaceInCart = cartCapacity - this.getTotalResourceCount(cart.load);

                    for (const resourceId in elevator.storage) {
                        if (spaceInCart <= 0) break;
                        let amountToCollect = Math.min(elevator.storage[resourceId], spaceInCart);

                        const duplicatorLevel = this.getSkillLevel(cart.skillLevels, CartSkill.MATTER_DUPLICATOR);
                        if (duplicatorLevel > 0) {
                            const duplicateChance = this.getScaledChance(MATTER_DUPLICATOR_CHANCE, duplicatorLevel);
                            if (Math.random() < duplicateChance) {
                                amountToCollect *= 2;
                            }
                        }
                        amountToCollect = Math.min(elevator.storage[resourceId], amountToCollect);

                        if (amountToCollect > 0) {
                            cart.load[resourceId] = (cart.load[resourceId] || 0) + amountToCollect;
                            elevator.storage[resourceId] -= amountToCollect;
                            if (elevator.storage[resourceId] <= 0) {
                                delete elevator.storage[resourceId];
                            }
                            spaceInCart -= amountToCollect;
                        }
                    }
                    cart.status = CartStatus.MovingToMarket;
                }
                break;

            case CartStatus.MovingToMarket:
                cart.x += cartSpeed * deltaTime;
                if (cart.x >= CART_TRAVEL_DISTANCE) {
                    cart.x = CART_TRAVEL_DISTANCE;
                    cart.status = CartStatus.Depositing;
                    const logisticsLevel = this.getSkillLevel(market.skillLevels, MarketSkill.EFFICIENT_LOGISTICS);
                    const depositMultiplier = this.getDepositTimeMultiplier(logisticsLevel);
                    cart.actionTimer = CART_ACTION_TIME * depositMultiplier;
                }
                break;

            case CartStatus.Depositing:
                if (cart.actionTimer !== undefined) {
                    cart.actionTimer -= (deltaTime * 1000);
                }

                if (cart.actionTimer === undefined || cart.actionTimer <= 0) {
                    let cashGained = 0;
                    const valueMultiplier = this.getMarketValueMultiplier(market);
                    const negotiatorLevel = this.getSkillLevel(market.skillLevels, MarketSkill.MASTER_NEGOTIATOR);
                    const negotiatorChance = this.getScaledChance(MASTER_NEGOTIATOR_CHANCE, negotiatorLevel);

                    for (const resourceId in cart.load) {
                        const amount = cart.load[resourceId];
                        if (amount > 0) {
                            let value = amount * this.getResourceValue(resourceId) * valueMultiplier;

                            if (negotiatorLevel > 0 && Math.random() < negotiatorChance) {
                                const bonusMultiplier = MASTER_NEGOTIATOR_MULTIPLIER + ((negotiatorLevel - 1) * 0.5);
                                value *= bonusMultiplier;
                            }
                            cashGained += value;
                        }
                    }

                    if (cashGained > 0) {
                        this.gameState.cash += cashGained;
                        market.lastDepositAmount = cashGained;
                    }
                    
                    cart.load = {};
                    market.resources = {}; // Ensure market storage is cleared
                    cart.status = CartStatus.Returning;
                }
                break;
            
            case CartStatus.Returning:
                cart.x -= cartSpeed * deltaTime;
                if (cart.x <= 0) {
                    cart.x = 0;
                    cart.status = CartStatus.Idle;
                }
                break;
        }
    }
    
    private checkAndAwardSkillPoint(manager: { managerLevel: number; skillPoints: number }, newLevel: number) {
        const previousThreshold = Math.floor(manager.managerLevel / MANAGER_SKILL_POINT_INTERVAL);
        const newThreshold = Math.floor(newLevel / MANAGER_SKILL_POINT_INTERVAL);
        const pointsEarned = newThreshold - previousThreshold;

        if (pointsEarned > 0) {
            manager.skillPoints += pointsEarned;
        }
    }

    public upgradeShaft(id: number, amount: UpgradeAmount): void {
        const shaft = this.gameState.mineShafts.find(s => s.id === id);
        if (!shaft) return;
        const upgradeInfo = this.getShaftUpgradeInfo(shaft, amount, this.gameState.cash);
        if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
            this.gameState.cash -= upgradeInfo.cost;
            shaft.level += upgradeInfo.levels;
        }
    }

    public upgradeManager(id: number, amount: UpgradeAmount): void {
        const shaft = this.gameState.mineShafts.find(s => s.id === id);
        if (!shaft) return;
        const upgradeInfo = this.getManagerUpgradeInfo(shaft, amount, this.gameState.cash);

        if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
            this.gameState.cash -= upgradeInfo.cost;
            const newLevel = shaft.managerLevel + upgradeInfo.levels;
            this.checkAndAwardSkillPoint(shaft, newLevel);
            shaft.managerLevel = newLevel;
        }
    }
    
    public unlockShaftSkill(shaftId: number, skill: MineShaftSkill) {
        const shaft = this.gameState.mineShafts.find(s => s.id === shaftId);
        if (!shaft || shaft.skillPoints <= 0) return;

        const currentLevel = this.getSkillLevel(shaft.skillLevels, skill);
        if (currentLevel >= MAX_SKILL_LEVEL) return;

        shaft.skillPoints -= 1;
        shaft.skillLevels[skill] = currentLevel + 1;
    }

    public addShaft(): void {
        if (this.gameState.mineShafts.length >= MAX_SHAFTS) {
            return;
        }
        const cost = this.getNewShaftCost(this.gameState.mineShafts.length);
        if (this.gameState.cash >= cost) {
            this.gameState.cash -= cost;
            const newShaftId = this.gameState.mineShafts.length;
            const resourceIndex = Math.min(newShaftId, this.gameState.resources.length - 1);

            const newShaft: MineShaftState = {
                id: newShaftId,
                level: 1,
                resources: 0,
                resourceId: this.gameState.resources[resourceIndex].id,
                y: SHAFT_POSITION_Y_OFFSET + (newShaftId * SHAFT_POSITION_Y_INCREMENT),
                managerLevel: 0,
                skillPoints: 0,
                skillLevels: {},
            };
            this.gameState.mineShafts.push(newShaft);
        }
    }

    public upgradeElevator(amount: UpgradeAmount): void {
        const upgradeInfo = this.getElevatorUpgradeInfo(this.gameState.elevator, amount, this.gameState.cash);
        if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
            this.gameState.cash -= upgradeInfo.cost;
            this.gameState.elevator.level += upgradeInfo.levels;
        }
    }

    public upgradeElevatorManager(amount: UpgradeAmount): void {
        const elevator = this.gameState.elevator;
        const upgradeInfo = this.getElevatorManagerUpgradeInfo(elevator, amount, this.gameState.cash);
        if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
            this.gameState.cash -= upgradeInfo.cost;
            const newLevel = elevator.managerLevel + upgradeInfo.levels;
            this.checkAndAwardSkillPoint(elevator, newLevel);
            elevator.managerLevel = newLevel;
        }
    }
    
    public unlockElevatorSkill(skill: ElevatorSkill) {
        const elevator = this.gameState.elevator;
        if (elevator.skillPoints <= 0) return;

        const currentLevel = this.getSkillLevel(elevator.skillLevels, skill);
        if (currentLevel >= MAX_SKILL_LEVEL) return;

        elevator.skillPoints -= 1;
        elevator.skillLevels[skill] = currentLevel + 1;
    }

    public upgradeMarket(amount: UpgradeAmount): void {
        const upgradeInfo = this.getMarketUpgradeInfo(this.gameState.market, amount, this.gameState.cash);
        if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
            this.gameState.cash -= upgradeInfo.cost;
            this.gameState.market.level += upgradeInfo.levels;
        }
    }

    public upgradeMarketManager(amount: UpgradeAmount): void {
        const market = this.gameState.market;
        const upgradeInfo = this.getMarketManagerUpgradeInfo(market, amount, this.gameState.cash);
        if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
            this.gameState.cash -= upgradeInfo.cost;
            const newLevel = market.managerLevel + upgradeInfo.levels;
            this.checkAndAwardSkillPoint(market, newLevel);
            market.managerLevel = newLevel;
        }
    }
    
    public unlockMarketSkill(skill: MarketSkill) {
        const market = this.gameState.market;
        if (market.skillPoints <= 0) return;

        const currentLevel = this.getSkillLevel(market.skillLevels, skill);
        if (currentLevel >= MAX_SKILL_LEVEL) return;

        market.skillPoints -= 1;
        market.skillLevels[skill] = currentLevel + 1;
    }

    public upgradeCart(amount: UpgradeAmount): void {
        const upgradeInfo = this.getCartUpgradeInfo(this.gameState.cart, amount, this.gameState.cash);
        if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
            this.gameState.cash -= upgradeInfo.cost;
            this.gameState.cart.level += upgradeInfo.levels;
        }
    }

    public upgradeCartManager(amount: UpgradeAmount): void {
        const cart = this.gameState.cart;
        const upgradeInfo = this.getCartManagerUpgradeInfo(cart, amount, this.gameState.cash);
        if (upgradeInfo.levels > 0 && this.gameState.cash >= upgradeInfo.cost) {
            this.gameState.cash -= upgradeInfo.cost;
            const newLevel = cart.managerLevel + upgradeInfo.levels;
            this.checkAndAwardSkillPoint(cart, newLevel);
            cart.managerLevel = newLevel;
        }
    }

    public unlockCartSkill(skill: CartSkill) {
        const cart = this.gameState.cart;
        if (cart.skillPoints <= 0) return;

        const currentLevel = this.getSkillLevel(cart.skillLevels, skill);
        if (currentLevel >= MAX_SKILL_LEVEL) return;

        cart.skillPoints -= 1;
        cart.skillLevels[skill] = currentLevel + 1;
    }
}