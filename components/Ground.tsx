import React, { useState, useEffect, useMemo } from 'react';
import { MarketState, ElevatorState, CartState, ResourceMap, CartStatus } from '../types';
import UpgradeButton from './UpgradeButton';
import { MarketIcon, ManagerIcon, ResourceIcon } from './icons';
import { Resource } from '../services/resourceService';
import Manager from './Manager';

const getBuildingIconStyle = (level: number) => {
    if (level >= 50) return 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]';
    if (level >= 25) return 'text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.6)]';
    if (level >= 10) return 'text-orange-300 drop-shadow-[0_0_4px_rgba(251,146,60,0.5)]';
    return 'text-gray-900';
};


const getTotalResourceCount = (resourceMap: ResourceMap): number => {
    return Object.values(resourceMap).reduce((sum, count) => sum + count, 0);
};

const CartWorkerIcon = () => (
    <div className="flex items-end -space-x-2">
        <div className="w-5 h-5 bg-red-500 border-2 border-black rounded-sm relative -bottom-1"></div>
        <ManagerIcon className="w-8 h-8 text-gray-300"/>
    </div>
);

// FIX: Added GroundProps interface definition.
interface GroundProps {
    market: MarketState;
    elevator: ElevatorState;
    cart: CartState;
    onUpgradeMarket: () => void;
    onUpgradeElevator: () => void;
    onUpgradeCart: () => void;
    onOpenMarketManagerDetails: () => void;
    onOpenElevatorManagerDetails: () => void;
    onOpenCartManagerDetails: () => void;
    onToggleMarketAutoUpgrade: () => void;
    onToggleElevatorAutoUpgrade: () => void;
    onToggleCartAutoUpgrade: () => void;
    marketUpgradeCost: number;
    elevatorUpgradeCost: number;
    cartUpgradeCost: number;
    formatNumber: (num: number) => string;
    cash: number;
    resources: Resource[];
    isMarketAutoUpgrading: boolean;
    isElevatorAutoUpgrading: boolean;
    isCartAutoUpgrading: boolean;
}

const Ground: React.FC<GroundProps> = ({
    market, elevator, cart,
    onUpgradeMarket, onUpgradeElevator, onUpgradeCart,
    onOpenMarketManagerDetails, onOpenElevatorManagerDetails, onOpenCartManagerDetails,
    onToggleMarketAutoUpgrade, onToggleElevatorAutoUpgrade, onToggleCartAutoUpgrade,
    marketUpgradeCost, elevatorUpgradeCost, cartUpgradeCost,
    formatNumber, cash, resources,
    isMarketAutoUpgrading, isElevatorAutoUpgrading, isCartAutoUpgrading
}) => {
    const [floatingTexts, setFloatingTexts] = useState<{ id: number; amount: number }[]>([]);
    const resourceMap = useMemo(() => new Map(resources.map(r => [r.id, r])), [resources]);

    useEffect(() => {
        if (market.lastDepositAmount && market.lastDepositAmount > 0) {
            const newText = {
                id: Date.now() + Math.random(),
                amount: market.lastDepositAmount,
            };
            setFloatingTexts(prev => [...prev.slice(-5), newText]);

            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
            }, 1500);
        }
    }, [market.lastDepositAmount]);
    
    const totalElevatorStorage = getTotalResourceCount(elevator.storage);
    const cartProgress = (cart.x / 150) * 100;

    return (
        <div className="bg-sky-500 grid grid-cols-3 p-2 gap-2 border-b-4 border-black/20 relative">
            <style>
                {`
                @keyframes float-up-fade-out {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-30px); opacity: 0; }
                }
                .deposit-feedback {
                    animation: float-up-fade-out 1.5s ease-out forwards;
                }
                `}
            </style>
            
            {/* Elevator Panel */}
            <div className="bg-sky-600/50 rounded-lg p-2 flex flex-col items-center space-y-2 text-center">
                <p className="font-bold text-sm text-black/80 drop-shadow-sm">ELEVATOR</p>
                <div className="flex-grow flex items-center justify-center w-full space-x-2 h-16">
                     <div className="w-14 h-14 bg-orange-500 border-4 border-orange-700 rounded-lg shadow-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs opacity-80 transform -rotate-15">Preview</span>
                     </div>
                     <button 
                        onClick={onOpenElevatorManagerDetails}
                        className="relative group w-12 h-12 flex items-center justify-center"
                        aria-label={elevator.managerLevel > 0 ? `View Elevator Manager Details` : `Hire Elevator Manager`}
                    >
                        <Manager level={elevator.managerLevel} />
                         {elevator.managerLevel > 0 && 
                            <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                                {elevator.managerLevel}
                            </span>
                        }
                         {elevator.skillPoints > 0 &&
                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border border-black animate-pulse">
                                !
                            </span>
                        }
                    </button>
                </div>
                <div className="bg-slate-800/80 rounded-md px-3 py-1 text-sm text-white font-semibold w-full shadow-inner">
                    Storage: {formatNumber(totalElevatorStorage)}
                </div>
                <div className="w-full space-y-1">
                    <UpgradeButton
                        onClick={onUpgradeElevator}
                        cost={elevatorUpgradeCost}
                        disabled={cash < elevatorUpgradeCost}
                        formatNumber={formatNumber}
                    />
                    <button
                        onClick={onToggleElevatorAutoUpgrade}
                        aria-pressed={isElevatorAutoUpgrading}
                        className={`w-full py-1.5 text-xs font-bold rounded-md border transition-colors duration-150 ${
                            isElevatorAutoUpgrading
                                ? 'bg-purple-500 text-white border-purple-300 shadow-md'
                                : 'bg-black/30 text-gray-200 border-black/40 hover:bg-black/40'
                        }`}
                    >
                        AUTO {isElevatorAutoUpgrading ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* Pipeline Panel */}
            <div className="bg-sky-600/50 rounded-lg p-2 flex flex-col items-center space-y-2 text-center">
                 <p className="font-bold text-sm text-black/80 drop-shadow-sm">PIPELINE</p>
                 <div className="flex-grow w-full flex items-center justify-center h-16 space-x-2">
                    <div className="flex-grow h-12 bg-slate-700/80 rounded-full relative flex items-center shadow-inner">
                        <div className="absolute left-3 w-9 h-9 bg-black/80 rounded-md flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {cart.level}
                        </div>
                        {(cart.status === CartStatus.MovingToMarket || cart.status === CartStatus.Returning) && (
                             <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-100 ease-linear" style={{ left: `calc(${cartProgress}% * 0.7 + 20%)` }}>
                                <CartWorkerIcon/>
                            </div>
                        )}
                    </div>
                    {/* FIX: Added manager button for Pipeline to match other panels and use the provided prop */}
                    <button 
                        onClick={onOpenCartManagerDetails}
                        className="relative group w-12 h-12 flex items-center justify-center flex-shrink-0"
                        aria-label={cart.managerLevel > 0 ? `View Pipeline Manager Details` : `Hire Pipeline Manager`}
                    >
                        <Manager level={cart.managerLevel} />
                            {cart.managerLevel > 0 && 
                            <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                                {cart.managerLevel}
                            </span>
                        }
                            {cart.skillPoints > 0 &&
                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border border-black animate-pulse">
                                !
                            </span>
                        }
                    </button>
                 </div>
                 <div className="bg-slate-800/80 rounded-md px-3 py-1 text-sm text-white font-semibold w-full shadow-inner">
                    Load: {formatNumber(getTotalResourceCount(cart.load))}
                </div>
                <div className="w-full space-y-1">
                    <UpgradeButton
                        onClick={onUpgradeCart}
                        cost={cartUpgradeCost}
                        disabled={cash < cartUpgradeCost}
                        formatNumber={formatNumber}
                    />
                    <button
                        onClick={onToggleCartAutoUpgrade}
                        aria-pressed={isCartAutoUpgrading}
                        className={`w-full py-1.5 text-xs font-bold rounded-md border transition-colors duration-150 ${
                            isCartAutoUpgrading
                                ? 'bg-purple-500 text-white border-purple-300 shadow-md'
                                : 'bg-black/30 text-gray-200 border-black/40 hover:bg-black/40'
                        }`}
                    >
                        AUTO {isCartAutoUpgrading ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* Market Panel */}
            <div className="relative w-full h-full bg-sky-600/50 rounded-lg p-2 flex flex-col items-center space-y-2 text-center overflow-hidden">
                 <div className="absolute top-0 left-0 right-0 h-full pointer-events-none">
                    {floatingTexts.map(text => (
                        <div key={text.id} className="deposit-feedback absolute top-1/3 left-1/2 -translate-x-1/2 text-lg font-bold text-green-400 drop-shadow-lg">
                            +${formatNumber(text.amount)}
                        </div>
                    ))}
                </div>
                <p className="font-bold text-sm text-black/80 drop-shadow-sm">MARKET</p>
                <div className="flex-grow flex items-center justify-center w-full space-x-2 h-16">
                    <MarketIcon className={`w-14 h-14 transition-all ${getBuildingIconStyle(market.level)}`} />
                     <button 
                        onClick={onOpenMarketManagerDetails}
                        className="relative group w-12 h-12 flex items-center justify-center"
                        aria-label={market.managerLevel > 0 ? `View Market Manager Details` : `Hire Market Manager`}
                    >
                        <Manager level={market.managerLevel} />
                         {market.managerLevel > 0 && 
                            <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                                {market.managerLevel}
                            </span>
                        }
                         {market.skillPoints > 0 &&
                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border border-black animate-pulse">
                                !
                            </span>
                        }
                    </button>
                </div>
                 <div className="bg-blue-600 text-white text-sm font-bold rounded-md py-1 px-4 w-full shadow-sm">
                    LEVEL {market.level}
                </div>
                <div className="w-full space-y-1">
                    <UpgradeButton
                        onClick={onUpgradeMarket}
                        cost={marketUpgradeCost}
                        formatNumber={formatNumber}
                        disabled={cash < marketUpgradeCost}
                    />
                    <button
                        onClick={onToggleMarketAutoUpgrade}
                        aria-pressed={isMarketAutoUpgrading}
                        className={`w-full py-1.5 text-xs font-bold rounded-md border transition-colors duration-150 ${
                            isMarketAutoUpgrading
                                ? 'bg-purple-500 text-white border-purple-300 shadow-md'
                                : 'bg-black/30 text-gray-200 border-black/40 hover:bg-black/40'
                        }`}
                    >
                        AUTO {isMarketAutoUpgrading ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Ground;
