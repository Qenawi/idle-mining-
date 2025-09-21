import React, { useState, useEffect, useRef } from 'react';
import { GameState } from './types';
import { GAME_TICK_MS } from './constants';
import Header from './components/Header';
import MineShaftComponent from './components/MineShaft';
import ElevatorShaft from './components/ElevatorShaft';
import Ground from './components/Ground';
import WelcomeBackModal from './components/WelcomeBackModal';
import SettingsModal from './components/SettingsModal';
import { GameManager } from './managers/GameManager';

const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}k`;
    return num.toFixed(0);
};

const App: React.FC = () => {
    // Use a ref to hold the game manager instance to prevent re-creation on re-renders
    const gameManagerRef = useRef<GameManager | null>(null);
    if (gameManagerRef.current === null) {
        gameManagerRef.current = new GameManager();
    }
    const gameManager = gameManagerRef.current;

    const [gameState, setGameState] = useState<GameState>(gameManager.getState());
    const [isAddingShaft, setIsAddingShaft] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    
    // Welcome back modal logic
    const [offlineEarnings] = useState(gameManager.offlineEarnings);
    const [timeOffline] = useState(gameManager.timeOffline);
    const [showWelcomeBackModal, setShowWelcomeBackModal] = useState(offlineEarnings > 0);

    const lastTickRef = useRef<number>(Date.now());
    const { cash, mineShafts, elevator, warehouse } = gameState;

    // Game Loop and Save Logic
    useEffect(() => {
        lastTickRef.current = Date.now();
        
        const gameLoop = () => {
            const now = Date.now();
            const deltaTime = (now - lastTickRef.current) / 1000;
            lastTickRef.current = now;
            
            gameManager.update(deltaTime);
            // Create a new object to ensure React detects the state change
            setGameState({ ...gameManager.getState() });
        };

        const timer = setInterval(gameLoop, GAME_TICK_MS);
        return () => clearInterval(timer);
    }, [gameManager]); // Depend on gameManager instance

    useEffect(() => {
        const handler = setTimeout(() => gameManager.saveGame(), 1000);
        return () => clearTimeout(handler);
    }, [gameState, gameManager]);

    // --- Action Handlers ---
    
    const handleUpgradeShaft = (id: number) => {
        gameManager.upgradeShaft(id);
        setGameState({ ...gameManager.getState() });
    };

    const handleUpgradeManager = (id: number) => {
        gameManager.upgradeManager(id);
        setGameState({ ...gameManager.getState() });
    }
    
    const handleAddShaft = () => {
        const cost = gameManager.getNewShaftCost(mineShafts.length);
        if (cash >= cost) {
            setIsAddingShaft(true);
            setTimeout(() => setIsAddingShaft(false), 150);
            gameManager.addShaft();
            setGameState({ ...gameManager.getState() });
        }
    };
    
    const handleUpgradeElevator = () => {
        gameManager.upgradeElevator();
        setGameState({ ...gameManager.getState() });
    };

    const handleUpgradeWarehouse = () => {
        gameManager.upgradeWarehouse();
        setGameState({ ...gameManager.getState() });
    };

    const handleResetGame = () => {
        gameManager.resetGame();
        setGameState({ ...gameManager.getState() });
        setIsSettingsModalOpen(false);
    };

    const newShaftCost = gameManager.getNewShaftCost(mineShafts.length);
    const addShaftClickedClass = isAddingShaft ? 'scale-95' : '';

    return (
        <div className="bg-[#3a2d27] min-h-screen flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-sm mx-auto h-[95vh] max-h-[800px] bg-[#6d4c41] rounded-3xl shadow-2xl flex flex-col overflow-hidden border-4 border-black/20">
                {showWelcomeBackModal && <WelcomeBackModal earnings={offlineEarnings} timeOffline={timeOffline} onClose={() => setShowWelcomeBackModal(false)} />}
                <SettingsModal 
                    isOpen={isSettingsModalOpen}
                    onClose={() => setIsSettingsModalOpen(false)}
                    onResetGame={handleResetGame}
                />
                
                <Header 
                    cash={cash} 
                    idleIncome={gameManager.getIdleIncome()} 
                    formatNumber={formatNumber}
                    onSettingsClick={() => setIsSettingsModalOpen(true)}
                />
                
                <main className="flex-grow flex relative overflow-hidden">
                    <div className="w-[100px] flex-shrink-0 bg-[#8c5a44] border-r-4 border-black/20 relative">
                        <ElevatorShaft elevator={elevator} />
                    </div>

                    <div className="flex-grow overflow-y-auto" style={{
                         background: 'linear-gradient(to bottom, #b97a57 160px, #8c5a44 160px)'
                    }}>
                        <div className="p-4 space-y-4">
                            <Ground 
                                warehouse={warehouse}
                                elevator={elevator}
                                onUpgradeWarehouse={handleUpgradeWarehouse}
                                onUpgradeElevator={handleUpgradeElevator}
                                warehouseUpgradeCost={gameManager.getWarehouseUpgradeCost(warehouse.level)}
                                elevatorUpgradeCost={gameManager.getElevatorUpgradeCost(elevator.level)}
                                formatNumber={formatNumber}
                                cash={cash}
                            />
                            {mineShafts.map((shaft) => (
                                <MineShaftComponent 
                                    key={shaft.id} 
                                    shaft={shaft} 
                                    onUpgrade={() => handleUpgradeShaft(shaft.id)}
                                    onUpgradeManager={() => handleUpgradeManager(shaft.id)}
                                    upgradeCost={gameManager.getShaftUpgradeCost(shaft.level)}
                                    managerUpgradeCost={gameManager.getManagerUpgradeCost(shaft.managerLevel)}
                                    managerBonusMultiplier={gameManager.getManagerBonusMultiplier()}
                                    production={gameManager.getShaftProduction(shaft)} 
                                    formatNumber={formatNumber}
                                    upgradeDisabled={cash < gameManager.getShaftUpgradeCost(shaft.level)}
                                    managerUpgradeDisabled={cash < gameManager.getManagerUpgradeCost(shaft.managerLevel)}
                                />
                            ))}
                             <button
                                onClick={handleAddShaft} disabled={cash < newShaftCost}
                                className={`w-full py-4 text-center bg-yellow-500 rounded-lg border-b-4 border-yellow-700 font-bold text-lg text-white shadow-lg hover:bg-yellow-400 disabled:bg-gray-600 disabled:border-gray-800 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all ${addShaftClickedClass}`}
                            >
                                ADD NEW SHAFT (${formatNumber(newShaftCost)})
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;