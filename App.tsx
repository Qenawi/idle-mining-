import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GameState, MineShaftState, ElevatorState, MarketState, MineShaftSkill, ElevatorSkill, MarketSkill, ModalManagerInfo, UpgradeAmount, UpgradeModalInfo, CartState, CartSkill } from './types';
import { GAME_TICK_MS, MINE_SHAFT_SKILLS, ELEVATOR_SKILLS, MARKET_SKILLS, ELEVATOR_MANAGER_BONUS, MARKET_MANAGER_BONUS, CART_SKILLS, CART_MANAGER_BONUS, MAX_SHAFTS } from './constants';
import Header from './components/Header';
import MineShaftComponent from './components/MineShaft';
import ElevatorShaft from './components/ElevatorShaft';
import Ground from './components/Ground';
import WelcomeBackModal from './components/WelcomeBackModal';
import SettingsModal from './components/SettingsModal';
import ManagerSkillModal from './components/ManagerSkillModal';
import ManagerDetailModal from './components/ManagerDetailModal';
import { GameManager } from './managers/GameManager';
import UpgradeModal from './components/UpgradeModal';
import { getGameTip } from './services/aiService';

const SI_SUFFIXES = ['', 'K', 'M', 'B', 'T'];
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

const formatNumber = (num: number): string => {
    if (num < 1000) return num.toFixed(0);
    
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

    if (tier < SI_SUFFIXES.length) {
        const suffix = SI_SUFFIXES[tier];
        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;
        return scaled.toFixed(2) + suffix;
    }

    const exp = tier - SI_SUFFIXES.length;
    const firstLetter = ALPHABET[Math.floor(exp / ALPHABET.length)];
    const secondLetter = ALPHABET[exp % ALPHABET.length];
    const suffix = `${firstLetter}${secondLetter}`;
    
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;

    return scaled.toFixed(2) + suffix;
};


const App: React.FC = () => {
    const gameManagerRef = useRef<GameManager | null>(null);
    if (gameManagerRef.current === null) {
        gameManagerRef.current = new GameManager();
    }
    const gameManager = gameManagerRef.current;

    const [gameState, setGameState] = useState<GameState>(gameManager.getState());
    const [upgradeModalInfo, setUpgradeModalInfo] = useState<UpgradeModalInfo | null>(null);
    const [isAddingShaft, setIsAddingShaft] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [skillModalManager, setSkillModalManager] = useState<ModalManagerInfo | null>(null);
    const [detailModalManager, setDetailModalManager] = useState<ModalManagerInfo | null>(null);
    
    const [offlineEarnings] = useState(gameManager.offlineEarnings);
    const [timeOffline] = useState(gameManager.timeOffline);
    const [showWelcomeBackModal, setShowWelcomeBackModal] = useState(offlineEarnings > 0);
    
    // AI Advisor State
    const [aiTip, setAiTip] = useState<string | null>(null);
    const [isFetchingAiTip, setIsFetchingAiTip] = useState(false);
    const [aiTipError, setAiTipError] = useState<string | null>(null);

    const lastTickRef = useRef<number>(Date.now());
    const { cash, mineShafts, elevator, cart, market, resources } = gameState;
    const resourceMap = useMemo(() => new Map(resources.map(r => [r.id, r])), [resources]);

    useEffect(() => {
        lastTickRef.current = Date.now();
        
        const gameLoop = () => {
            const now = Date.now();
            const deltaTime = (now - lastTickRef.current) / 1000;
            lastTickRef.current = now;
            
            gameManager.update(deltaTime);
            setGameState({ ...gameManager.getState() });
        };

        const timer = setInterval(gameLoop, GAME_TICK_MS);
        return () => clearInterval(timer);
    }, [gameManager]);

    useEffect(() => {
        const handler = setTimeout(() => gameManager.saveGame(), 1000);
        return () => clearTimeout(handler);
    }, [gameState, gameManager]);

    // --- AI Advisor Handler ---
    const handleGetAiTip = async () => {
        setIsFetchingAiTip(true);
        setAiTip(null);
        setAiTipError(null);
        try {
            const tip = await getGameTip(gameManager.getState(), gameManager);
            setAiTip(tip);
        } catch (error) {
            setAiTipError(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setIsFetchingAiTip(false);
        }
    };

    // --- Action Handlers ---
    const handleOpenUpgradeModal = (type: 'mineshaft' | 'elevator' | 'market' | 'cart', id?: number) => {
        const state = gameManager.getState();
        if (type === 'mineshaft' && id !== undefined) {
            const shaft = state.mineShafts.find(s => s.id === id);
            if (shaft) setUpgradeModalInfo({ type, id, data: shaft });
        } else if (type === 'elevator') {
            setUpgradeModalInfo({ type, data: state.elevator });
        } else if (type === 'market') {
            setUpgradeModalInfo({ type, data: state.market });
        } else if (type === 'cart') {
            setUpgradeModalInfo({ type, data: state.cart });
        }
    };
    
    const handleConfirmUpgrade = (amount: UpgradeAmount) => {
        if (!upgradeModalInfo) return;

        switch(upgradeModalInfo.type) {
            case 'mineshaft':
                gameManager.upgradeShaft(upgradeModalInfo.id, amount);
                break;
            case 'elevator':
                gameManager.upgradeElevator(amount);
                break;
            case 'market':
                gameManager.upgradeMarket(amount);
                break;
            case 'cart':
                gameManager.upgradeCart(amount);
                break;
        }
        setGameState({ ...gameManager.getState() });
    };

    const handleAddShaft = () => {
        const cost = gameManager.getNewShaftCost(mineShafts.length);
        if (cash >= cost && mineShafts.length < MAX_SHAFTS) {
            setIsAddingShaft(true);
            setTimeout(() => setIsAddingShaft(false), 150);
            gameManager.addShaft();
            setGameState({ ...gameManager.getState() });
        }
    };

    const handleResetGame = () => {
        gameManager.resetGame();
        setGameState({ ...gameManager.getState() });
        setIsSettingsModalOpen(false);
    };

    const handleUnlockSkill = (skillId: MineShaftSkill | ElevatorSkill | MarketSkill | CartSkill) => {
        if (!skillModalManager) return;

        switch(skillModalManager.type) {
            case 'mineshaft':
                gameManager.unlockShaftSkill(skillModalManager.data.id, skillId as MineShaftSkill);
                break;
            case 'elevator':
                gameManager.unlockElevatorSkill(skillId as ElevatorSkill);
                break;
            case 'market':
                gameManager.unlockMarketSkill(skillId as MarketSkill);
                break;
            case 'cart':
                gameManager.unlockCartSkill(skillId as CartSkill);
                break;
        }
        const updatedState = gameManager.getState();
        setGameState({ ...updatedState });

        // Refresh modal data
        switch(skillModalManager.type) {
            case 'mineshaft':
                const updatedShaft = updatedState.mineShafts.find(s => s.id === skillModalManager.data.id);
                if (updatedShaft) setSkillModalManager({ type: 'mineshaft', data: updatedShaft });
                break;
            case 'elevator':
                setSkillModalManager({ type: 'elevator', data: updatedState.elevator });
                break;
            case 'market':
                setSkillModalManager({ type: 'market', data: updatedState.market });
                break;
            case 'cart':
                setSkillModalManager({ type: 'cart', data: updatedState.cart });
                break;
        }
    };

    const handleUpgradeManagerFromModal = (amount: UpgradeAmount) => {
        if (!detailModalManager) return;
        
        switch(detailModalManager.type) {
            case 'mineshaft':
                gameManager.upgradeManager(detailModalManager.data.id, amount);
                break;
            case 'elevator':
                gameManager.upgradeElevatorManager(amount);
                break;
            case 'market':
                gameManager.upgradeMarketManager(amount);
                break;
            case 'cart':
                gameManager.upgradeCartManager(amount);
                break;
        }

        const updatedState = gameManager.getState();
        setGameState({ ...updatedState });

        // Refresh modal data
        switch(detailModalManager.type) {
            case 'mineshaft':
                const updatedShaft = updatedState.mineShafts.find(s => s.id === detailModalManager.data.id);
                if (updatedShaft) setDetailModalManager({ type: 'mineshaft', data: updatedShaft });
                else setDetailModalManager(null);
                break;
            case 'elevator':
                setDetailModalManager({ type: 'elevator', data: updatedState.elevator });
                break;
            case 'market':
                setDetailModalManager({ type: 'market', data: updatedState.market });
                break;
            case 'cart':
                setDetailModalManager({ type: 'cart', data: updatedState.cart });
                break;
        }
    };

    const handleOpenSkillsFromDetail = () => {
        if (detailModalManager) {
            setSkillModalManager(detailModalManager);
            setDetailModalManager(null);
        }
    };

    const newShaftCost = gameManager.getNewShaftCost(mineShafts.length);
    const addShaftClickedClass = isAddingShaft ? 'scale-95' : '';
    
    const upgradeModalProps = useMemo(() => {
        if (!upgradeModalInfo) {
            return null;
        }

        const { type, data } = upgradeModalInfo;
        let title = '';
        let currentLevel = 0;
        let upgrades: { '1': any; '10': any; 'MAX': any; };
        let details = null;

        if (type === 'mineshaft') {
            const shaft = data as MineShaftState;
            const resource = resourceMap.get(shaft.resourceId);
            title = `Mineshaft ${shaft.id + 1} (${resource?.name || '...'})`;
            currentLevel = shaft.level;
            upgrades = {
                '1': gameManager.getShaftUpgradeInfo(shaft, 1, cash),
                '10': gameManager.getShaftUpgradeInfo(shaft, 10, cash),
                'MAX': gameManager.getShaftUpgradeInfo(shaft, 'MAX', cash),
            };
            const nextLevelShaft = { ...shaft, level: shaft.level + 1 };
            details = {
                current: [
                    { label: 'Production', value: `${formatNumber(gameManager.getShaftProduction(shaft))}/s` },
                    { label: 'Capacity', value: formatNumber(gameManager.getShaftCapacity(shaft)) },
                ],
                next: [
                    { label: 'Production', value: `${formatNumber(gameManager.getShaftProduction(nextLevelShaft))}/s` },
                    { label: 'Capacity', value: formatNumber(gameManager.getShaftCapacity(nextLevelShaft)) },
                ],
            };
        } else if (type === 'elevator') {
            const elevator = data as ElevatorState;
            title = 'Elevator';
            currentLevel = elevator.level;
            upgrades = {
                '1': gameManager.getElevatorUpgradeInfo(elevator, 1, cash),
                '10': gameManager.getElevatorUpgradeInfo(elevator, 10, cash),
                'MAX': gameManager.getElevatorUpgradeInfo(elevator, 'MAX', cash),
            };
            const nextLevelElevator = { ...elevator, level: elevator.level + 1 };
            details = {
                current: [
                    { label: 'Capacity', value: formatNumber(gameManager.getElevatorCapacity(elevator)) },
                    { label: 'Speed', value: `${gameManager.getElevatorSpeed(elevator).toFixed(0)} px/s` },
                ],
                next: [
                    { label: 'Capacity', value: formatNumber(gameManager.getElevatorCapacity(nextLevelElevator)) },
                    { label: 'Speed', value: `${gameManager.getElevatorSpeed(nextLevelElevator).toFixed(0)} px/s` },
                ],
            };
        } else if (type === 'market') {
            const market = data as MarketState;
            title = 'Market';
            currentLevel = market.level;
            upgrades = {
                '1': gameManager.getMarketUpgradeInfo(market, 1, cash),
                '10': gameManager.getMarketUpgradeInfo(market, 10, cash),
                'MAX': gameManager.getMarketUpgradeInfo(market, 'MAX', cash),
            };
            const nextLevelMarket = { ...market, level: market.level + 1 };
            details = {
                current: [
                    { label: 'Value Multiplier', value: `${(gameManager.getMarketValueMultiplier(market) * 100).toFixed(0)}%` },
                ],
                next: [
                    { label: 'Value Multiplier', value: `${(gameManager.getMarketValueMultiplier(nextLevelMarket) * 100).toFixed(0)}%` },
                ],
            };
        } else if (type === 'cart') {
            const cart = data as CartState;
            title = 'Pipeline';
            currentLevel = cart.level;
            upgrades = {
                '1': gameManager.getCartUpgradeInfo(cart, 1, cash),
                '10': gameManager.getCartUpgradeInfo(cart, 10, cash),
                'MAX': gameManager.getCartUpgradeInfo(cart, 'MAX', cash),
            };
             const nextLevelCart = { ...cart, level: cart.level + 1 };
            details = {
                current: [
                    { label: 'Capacity', value: formatNumber(gameManager.getCartCapacity(cart)) },
                ],
                next: [
                    { label: 'Capacity', value: formatNumber(gameManager.getCartCapacity(nextLevelCart)) },
                ],
            }
        }

        return { title, currentLevel, upgrades, details };
    }, [upgradeModalInfo, cash, gameManager, resourceMap]);

    const canAddShaft = cash >= newShaftCost && mineShafts.length < MAX_SHAFTS;
    const addShaftButtonText = mineShafts.length >= MAX_SHAFTS
        ? 'MAX SHAFTS REACHED'
        : `ADD NEW SHAFT (${formatNumber(newShaftCost)})`;

    return (
        <div className="bg-[#3a2d27] min-h-screen flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto h-[95vh] max-h-[800px] md:max-h-[900px] xl:max-h-[1080px] bg-[#6d4c41] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-4 border-black/20">
                {showWelcomeBackModal && <WelcomeBackModal earnings={offlineEarnings} timeOffline={timeOffline} onClose={() => setShowWelcomeBackModal(false)} formatNumber={formatNumber} />}
                <SettingsModal 
                    isOpen={isSettingsModalOpen}
                    onClose={() => setIsSettingsModalOpen(false)}
                    onResetGame={handleResetGame}
                />
                {upgradeModalProps && (
                    <UpgradeModal 
                        isOpen={!!upgradeModalInfo}
                        onClose={() => setUpgradeModalInfo(null)}
                        onUpgrade={handleConfirmUpgrade}
                        title={upgradeModalProps.title}
                        currentLevel={upgradeModalProps.currentLevel}
                        formatNumber={formatNumber}
                        upgrades={upgradeModalProps.upgrades}
                        cash={cash}
                        details={upgradeModalProps.details}
                    />
                )}
                {skillModalManager && (
                    <ManagerSkillModal
                        isOpen={!!skillModalManager}
                        onClose={() => setSkillModalManager(null)}
                        managerInfo={skillModalManager}
                        onUnlockSkill={handleUnlockSkill}
                        skills={
                            skillModalManager.type === 'mineshaft' ? MINE_SHAFT_SKILLS :
                            skillModalManager.type === 'elevator' ? ELEVATOR_SKILLS :
                            skillModalManager.type === 'cart' ? CART_SKILLS :
                            MARKET_SKILLS
                        }
                    />
                )}
                 {detailModalManager && (
                    <ManagerDetailModal
                        isOpen={!!detailModalManager}
                        onClose={() => setDetailModalManager(null)}
                        managerInfo={detailModalManager}
                        onUpgrade={handleUpgradeManagerFromModal}
                        onOpenSkills={handleOpenSkillsFromDetail}
                        gameManager={gameManager}
                        bonusInfo={
                            detailModalManager.type === 'mineshaft' ? { description: 'Increases this shaft\'s production.', value: `+${(detailModalManager.data.managerLevel * gameManager.getManagerBonusMultiplier() * 100).toFixed(0)}%` } :
                            detailModalManager.type === 'elevator' ? { description: 'Increases elevator movement speed.', value: `+${(detailModalManager.data.managerLevel * ELEVATOR_MANAGER_BONUS * 100).toFixed(0)}%` } :
                            detailModalManager.type === 'cart' ? { description: 'Increases pipeline transport capacity.', value: `+${(detailModalManager.data.managerLevel * CART_MANAGER_BONUS * 100).toFixed(0)}%`} :
                            { description: 'Increases value of sold resources.', value: `+${(detailModalManager.data.managerLevel * MARKET_MANAGER_BONUS * 100).toFixed(0)}%` }
                        }
                        formatNumber={formatNumber}
                        cash={cash}
                    />
                 )}
                
                <Header 
                    cash={cash} 
                    idleIncome={gameManager.getIdleIncome()} 
                    formatNumber={formatNumber}
                    onSettingsClick={() => setIsSettingsModalOpen(true)}
                    onGetAiTip={handleGetAiTip}
                    aiTip={aiTip}
                    isFetchingAiTip={isFetchingAiTip}
                    aiTipError={aiTipError}
                    clearAiTip={() => { setAiTip(null); setAiTipError(null); }}
                />
                
                <Ground 
                    market={market}
                    elevator={elevator}
                    cart={cart}
                    onUpgradeMarket={() => handleOpenUpgradeModal('market')}
                    onUpgradeElevator={() => handleOpenUpgradeModal('elevator')}
                    onUpgradeCart={() => handleOpenUpgradeModal('cart')}
                    onOpenMarketManagerDetails={() => setDetailModalManager({ type: 'market', data: market })}
                    onOpenElevatorManagerDetails={() => setDetailModalManager({ type: 'elevator', data: elevator })}
                    onOpenCartManagerDetails={() => setDetailModalManager({ type: 'cart', data: cart })}
                    marketUpgradeCost={gameManager.getMarketUpgradeCost(market.level)}
                    elevatorUpgradeCost={gameManager.getElevatorUpgradeCost(elevator.level)}
                    cartUpgradeCost={gameManager.getCartUpgradeCost(cart.level)}
                    formatNumber={formatNumber}
                    cash={cash}
                    resources={resources}
                />

                <main className="flex-grow flex relative overflow-y-auto">
                    <div className="w-[80px] flex-shrink-0 bg-[#8c5a44] border-r-4 border-black/20 relative">
                        <ElevatorShaft elevator={elevator} resources={resources} />
                    </div>

                    <div className="flex-grow bg-[#8c5a44] relative">
                         <div className="px-4 pb-4 space-y-4 pt-4">
                            {mineShafts.map((shaft) => {
                                const singleUpgradeCost = gameManager.getShaftUpgradeCost(shaft.level);
                                return (
                                    <div key={shaft.id} className="relative">
                                        <div
                                            className="absolute w-7 h-7 flex items-center justify-center bg-black/40 text-white font-bold text-xs rounded-full border-2 border-gray-900/50 shadow-md top-1/2 -translate-y-1/2"
                                            style={{ 
                                                left: '-32px'
                                            }}
                                            aria-hidden="true"
                                        >
                                            {shaft.id + 1}
                                        </div>
                                        <MineShaftComponent 
                                            shaft={shaft} 
                                            resource={resourceMap.get(shaft.resourceId)}
                                            onUpgrade={() => handleOpenUpgradeModal('mineshaft', shaft.id)}
                                            onOpenManagerDetails={() => setDetailModalManager({ type: 'mineshaft', data: shaft })}
                                            upgradeCost={singleUpgradeCost}
                                            managerBonusMultiplier={gameManager.getManagerBonusMultiplier()}
                                            production={gameManager.getShaftProduction(shaft)} 
                                            maxResources={gameManager.getShaftCapacity(shaft)}
                                            formatNumber={formatNumber}
                                            upgradeDisabled={cash < singleUpgradeCost}
                                        />
                                    </div>
                                );
                            })}
                            <button
                                onClick={handleAddShaft} disabled={!canAddShaft}
                                className={`w-full py-4 text-center bg-yellow-500 rounded-lg border-b-4 border-yellow-700 font-bold text-lg text-white shadow-lg hover:bg-yellow-400 disabled:bg-gray-600 disabled:border-gray-800 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all ${addShaftClickedClass}`}
                            >
                                {addShaftButtonText}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;