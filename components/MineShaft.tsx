import React from 'react';
import { MineShaftState } from '../types';
import Miner from './Miner';
import { ResourceIcon, ArrowUpIcon } from './icons';
import UpgradeButton from './UpgradeButton';
import { Resource } from '../services/resourceService';
import Manager from './Manager';

interface MineShaftProps {
    shaft: MineShaftState;
    onUpgrade: (id: number) => void;
    onOpenManagerDetails: (id: number) => void;
    upgradeCost: number;
    production: number;
    maxResources: number;
    formatNumber: (num: number) => string;
    upgradeDisabled: boolean;
    managerBonusMultiplier: number;
    resource: Resource | undefined;
}

const MineShaftComponent: React.FC<MineShaftProps> = ({ 
    shaft, onUpgrade, onOpenManagerDetails,
    upgradeCost, formatNumber, upgradeDisabled, 
    managerBonusMultiplier, production, maxResources,
    resource
}) => {
    
    const resourcePercentage = maxResources > 0 ? (shaft.resources / maxResources) * 100 : 0;
    const resourceColor = resource?.color || '#FFFFFF';

    return (
        <div className="min-h-[8rem] bg-[#c58a64] rounded-lg shadow-lg flex p-2 border-2 border-black/20 relative items-center">
            {shaft.level >= 30 && <div className="absolute top-2 left-0 right-0 h-4 bg-[#6d4c41] border-y-2 border-black/20 z-0"></div>}
            {shaft.level >= 5 && <div className={`absolute top-0 left-4 h-full ${shaft.level >= 15 ? 'w-3 bg-[#795548]' : 'w-2 bg-[#8d6e63]'} border-x-2 border-black/20 z-0 transition-all duration-300`} style={{ transform: 'rotate(10deg)' }}></div>}
            {shaft.level >= 15 && <div className="absolute top-0 right-4 h-full w-3 bg-[#795548] border-x-2 border-black/20 z-0" style={{ transform: 'rotate(-10deg)' }}></div>}
            
            <div className="w-20 flex-shrink-0 flex flex-col items-center justify-between z-10 mr-2 h-full">
                <button 
                    onClick={() => onOpenManagerDetails(shaft.id)}
                    className="relative group"
                    aria-label={shaft.managerLevel > 0 ? `View Manager Level ${shaft.managerLevel} Details` : 'Hire Manager'}
                >
                    <div className="w-12 h-12 bg-gray-800/20 rounded-full flex items-center justify-center p-1 group-hover:opacity-100 transition-opacity">
                            <Manager level={shaft.managerLevel} />
                    </div>
                    {shaft.managerLevel > 0 && 
                        <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                            {shaft.managerLevel}
                        </span>
                    }
                    {shaft.skillPoints > 0 &&
                        <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-black animate-pulse">
                            !
                        </span>
                    }
                </button>
                <div className="bg-black/50 rounded-full px-2 py-0.5 flex items-center text-xs w-full justify-center">
                    <ResourceIcon color={resourceColor} className="w-4 h-4 mr-1"/>
                    <span className="font-bold">{formatNumber(shaft.resources)}</span>
                </div>
            </div>
            
            <div className="flex-grow flex items-center justify-center relative px-2">
                 <div className="absolute right-0 top-0 bottom-0 w-24 h-full bg-no-repeat bg-center bg-contain" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100 0 V100 H0 C0 100 30 90 40 70 S60 20 70 10 C80 0 100 0 100 0' fill='%23a46a49'/%3E%3C/svg%3E\")"}}></div>
                 
                 <div className="absolute bottom-2 left-0 right-0 h-4 bg-black/30 rounded-full overflow-hidden mx-auto w-11/12 shadow-inner z-10">
                    <div 
                        className="h-full rounded-full transition-all duration-150 ease-linear"
                        style={{ width: `${resourcePercentage}%`, backgroundColor: resourceColor, boxShadow: `0 0 8px ${resourceColor}` }}
                        aria-label={`Resources: ${Math.round(resourcePercentage)}% full`}
                    ></div>
                 </div>

                 <Miner />
            </div>

            <div className="w-24 flex-shrink-0 flex flex-col items-center justify-center ml-2 z-10 text-white font-bold space-y-1">
                 <div className="w-full flex items-center justify-center px-2 py-1 bg-blue-500 rounded-lg border-b-4 border-blue-800 shadow-lg">
                    <ArrowUpIcon className="w-5 h-5 mr-2" />
                    <div>
                        <span className="text-xs leading-tight">LEVEL</span>
                        <br/>
                        <span className="text-xl leading-tight">{shaft.level}</span>
                    </div>
                </div>
                <UpgradeButton
                    onClick={() => onUpgrade(shaft.id)}
                    cost={upgradeCost}
                    disabled={upgradeDisabled}
                    formatNumber={formatNumber}
                />
            </div>
        </div>
    );
};

export default MineShaftComponent;