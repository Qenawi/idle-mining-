import React, { useState } from 'react';
import { MineShaftState } from '../types';
import Miner from './Miner';
import { ManagerIcon, CoinIcon, ArrowUpIcon } from './icons';

interface MineShaftProps {
    shaft: MineShaftState;
    onUpgrade: (id: number) => void;
    onUpgradeManager: (id: number) => void;
    upgradeCost: number;
    managerUpgradeCost: number;
    production: number;
    formatNumber: (num: number) => string;
    upgradeDisabled: boolean;
    managerUpgradeDisabled: boolean;
    managerBonusMultiplier: number;
}

const MineShaftComponent: React.FC<MineShaftProps> = ({ shaft, onUpgrade, onUpgradeManager, upgradeCost, managerUpgradeCost, formatNumber, upgradeDisabled, managerUpgradeDisabled, managerBonusMultiplier }) => {
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isUpgradingManager, setIsUpgradingManager] = useState(false);
    
    const handleUpgradeClick = () => {
        if (upgradeDisabled) return;
        onUpgrade(shaft.id);
        setIsUpgrading(true);
        setTimeout(() => setIsUpgrading(false), 150);
    };

    const handleManagerUpgradeClick = () => {
        if (managerUpgradeDisabled) return;
        onUpgradeManager(shaft.id);
        setIsUpgradingManager(true);
        setTimeout(() => setIsUpgradingManager(false), 150);
    };

    const upgradeClickedClass = isUpgrading ? 'scale-95' : '';
    const managerClickedClass = isUpgradingManager ? 'scale-95' : '';
    const maxResources = 1000 * shaft.level;
    const resourcePercentage = maxResources > 0 ? (shaft.resources / maxResources) * 100 : 0;

    const getManagerIconStyle = (level: number) => {
        if (level === 0) return 'grayscale opacity-70';
        if (level >= 25) return 'drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]';
        if (level >= 10) return 'drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]';
        return '';
    }

    return (
        <div className="h-32 bg-[#c58a64] rounded-lg shadow-lg flex p-2 border-2 border-black/20 relative">
            {/* Visual Level Indicators - Beams */}
            {shaft.level >= 30 && (
                 <div
                    className="absolute top-2 left-0 right-0 h-4 bg-[#6d4c41] border-y-2 border-black/20 z-0"
                ></div>
            )}
            {shaft.level >= 5 && (
                <div
                    className={`absolute top-0 left-4 h-full ${shaft.level >= 15 ? 'w-3 bg-[#795548]' : 'w-2 bg-[#8d6e63]'} border-x-2 border-black/20 z-0 transition-all duration-300`}
                    style={{ transform: 'rotate(10deg)' }}
                ></div>
            )}
            {shaft.level >= 15 && (
                 <div
                    className="absolute top-0 right-4 h-full w-3 bg-[#795548] border-x-2 border-black/20 z-0"
                    style={{ transform: 'rotate(-10deg)' }}
                ></div>
            )}
            
            {/* Manager and Resources */}
            <div className="w-16 flex-shrink-0 flex flex-col items-center justify-between z-10 mr-2">
                 <button 
                    onClick={handleManagerUpgradeClick}
                    disabled={managerUpgradeDisabled}
                    className={`relative group disabled:cursor-not-allowed transform transition-transform duration-150 ${managerClickedClass}`}
                    aria-label={shaft.managerLevel > 0 ? `Upgrade Manager Level ${shaft.managerLevel}` : 'Hire Manager'}
                >
                    <div className="w-12 h-12 bg-gray-800/20 rounded-full flex items-center justify-center p-1 group-hover:opacity-100 transition-opacity">
                         <ManagerIcon className={`w-10 h-10 transition-all ${getManagerIconStyle(shaft.managerLevel)}`} />
                    </div>
                    {shaft.managerLevel > 0 && 
                        <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                            {shaft.managerLevel}
                        </span>
                    }
                    {/* --- IMPROVED TOOLTIP --- */}
                    <div className="absolute bottom-full mb-2 w-48 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-lg">
                        <p className="font-bold text-center">{shaft.managerLevel > 0 ? `Upgrade Manager` : `Hire Manager`}</p>
                        <p className="text-center text-gray-300 text-[10px] mb-1">Managers provide a passive production bonus to their shaft.</p>
                        <p className="text-center text-green-400 font-semibold">Current Bonus: +{shaft.managerLevel * managerBonusMultiplier * 100}%</p>
                        <hr className="border-gray-600 my-1"/>
                        <p className="text-center text-yellow-300 font-semibold">Cost: ${formatNumber(managerUpgradeCost)}</p>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black/80"></div>
                    </div>
                </button>
                <div className="bg-black/50 rounded-full px-2 py-0.5 flex items-center text-xs w-full justify-center">
                    <CoinIcon className="w-3 h-3 mr-1 text-yellow-300"/>
                    <span className="font-bold">{formatNumber(shaft.resources)}</span>
                </div>
            </div>
            
            {/* Miner and Rock Face */}
            <div className="flex-grow flex items-center justify-center relative px-2">
                 <div className="absolute right-0 top-0 bottom-0 w-24 h-full bg-no-repeat bg-center bg-contain" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0 V100 H0 C0 100 30 90 40 70 S60 20 70 10 C80 0 100 0 100 0' fill='%23a46a49'/%3E%3C/svg%3E\")"}}></div>
                 
                 {/* Resource Bar */}
                 <div className="absolute bottom-2 left-0 right-0 h-4 bg-black/30 rounded-full overflow-hidden mx-auto w-11/12 shadow-inner z-10">
                    <div 
                        className="h-full bg-yellow-400 rounded-full transition-all duration-150 ease-linear"
                        style={{ width: `${resourcePercentage}%` }}
                        aria-label={`Resources: ${Math.round(resourcePercentage)}% full`}
                    ></div>
                 </div>

                 <Miner />
            </div>

            {/* Upgrade Button */}
            <div className="w-20 flex-shrink-0 flex items-center justify-center ml-2 z-10">
                <button 
                    onClick={handleUpgradeClick}
                    disabled={upgradeDisabled}
                    className={`w-20 h-20 bg-blue-500 rounded-lg border-b-4 border-blue-800 flex flex-col items-center justify-center text-white font-bold disabled:bg-gray-500 disabled:border-gray-700 hover:bg-blue-400 transform hover:-translate-y-0.5 transition-all shadow-lg ${upgradeClickedClass}`}
                >
                    <ArrowUpIcon className="w-6 h-6" />
                    <span className="text-sm leading-tight">LEVEL</span>
                    <span className="text-2xl leading-tight">{shaft.level}</span>
                </button>
            </div>
        </div>
    );
};

export default MineShaftComponent;