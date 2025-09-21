import React, { useState, useEffect } from 'react';
import { WarehouseState, ElevatorState } from '../types';
import UpgradeButton from './UpgradeButton';
import { WarehouseBuildingIcon, TransportWorkerIcon } from './icons';

interface GroundProps {
    warehouse: WarehouseState;
    elevator: ElevatorState;
    onUpgradeWarehouse: () => void;
    onUpgradeElevator: () => void;
    warehouseUpgradeCost: number;
    elevatorUpgradeCost: number;
    formatNumber: (num: number) => string;
    cash: number;
}

const getWarehouseIconStyle = (level: number) => {
    if (level >= 50) return 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]';
    if (level >= 25) return 'text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.6)]';
    if (level >= 10) return 'text-orange-300 drop-shadow-[0_0_4px_rgba(251,146,60,0.5)]';
    return 'text-gray-800';
};

const getElevatorLevelStyle = (level: number) => {
    if (level >= 50) return 'bg-yellow-500 border-yellow-700 text-black';
    if (level >= 25) return 'bg-slate-400 border-slate-600';
    if (level >= 10) return 'bg-orange-400 border-orange-600';
    return 'bg-gray-800 border-black';
};


const Ground: React.FC<GroundProps> = ({ 
    warehouse, elevator, onUpgradeWarehouse, onUpgradeElevator, 
    warehouseUpgradeCost, elevatorUpgradeCost, formatNumber, cash 
}) => {
    const [floatingTexts, setFloatingTexts] = useState<{ id: number; amount: number }[]>([]);
    const [isTransporting, setIsTransporting] = useState(false);

    useEffect(() => {
        if (warehouse.lastDepositAmount && warehouse.lastDepositAmount > 0) {
            const newText = {
                id: Date.now() + Math.random(), // Add random to avoid collision
                amount: warehouse.lastDepositAmount,
            };
            // Limit the number of floating texts on screen
            setFloatingTexts(prev => [...prev.slice(-5), newText]);

            setTimeout(() => {
                setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
            }, 1500); // Animation duration
        }
    }, [warehouse.lastDepositAmount]);

    // Effect to sync the transport animation with warehouse activity.
    // The animation will now only run when there are resources to be sold.
    useEffect(() => {
        const shouldBeTransporting = warehouse.resources > 0;
        if (shouldBeTransporting !== isTransporting) {
            setIsTransporting(shouldBeTransporting);
        }
    }, [warehouse.resources, isTransporting]);


    return (
        <div className="h-36 bg-[#c58a64] rounded-lg shadow-lg flex p-2 border-2 border-black/20 relative overflow-hidden">
             {/* Synced and Smoothed Transport Worker Animation */}
             {isTransporting && (
                <div 
                    className="absolute left-[-3rem] top-1/2 -translate-y-1/2 h-16 w-20 z-0 transport-worker-container"
                    aria-hidden="true"
                >
                    <TransportWorkerIcon className="w-full h-full" />
                </div>
             )}
            <style>
                {`
                @keyframes transport-animation {
                    0% { transform: translateX(0); opacity: 1; }
                    70% { transform: translateX(120px); opacity: 1; }
                    100% { transform: translateX(150px); opacity: 0; }
                }
                .transport-worker-container {
                    animation: transport-animation 3s ease-in-out infinite;
                    animation-delay: 1s;
                }
                @keyframes float-up-fade-out {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-30px); opacity: 0; }
                }
                .deposit-feedback {
                    animation: float-up-fade-out 1.5s ease-out forwards;
                }
                `}
            </style>
            
            {/* Warehouse Controls */}
            <div className="w-1/2 pr-1 flex flex-col justify-between items-center text-center z-10 relative">
                 {/* Floating Text Container */}
                 <div className="absolute top-0 left-0 right-0 h-full pointer-events-none">
                    {floatingTexts.map(text => (
                        <div 
                            key={text.id}
                            className="deposit-feedback absolute top-1/3 left-1/2 -translate-x-1/2 text-lg font-bold text-green-400 drop-shadow-lg"
                        >
                            +{formatNumber(text.amount)}
                        </div>
                    ))}
                </div>
                <div className="bg-blue-600 text-white text-xs font-bold rounded-sm py-0.5 px-2 w-full shadow-sm">
                    LEVEL {warehouse.level}
                </div>
                <WarehouseBuildingIcon className={`w-10 h-10 transition-all ${getWarehouseIconStyle(warehouse.level)}`} />
                <UpgradeButton 
                    onClick={onUpgradeWarehouse} 
                    cost={warehouseUpgradeCost} 
                    formatNumber={formatNumber} 
                    disabled={cash < warehouseUpgradeCost} 
                />
            </div>

            {/* Elevator Controls */}
            <div className="w-1/2 pl-1 flex flex-col justify-between items-center text-center z-10">
                <p className="font-bold text-xs text-black/70 drop-shadow-sm">ELEVATOR</p>
                <div className={`w-10 h-10 border-2 rounded flex items-center justify-center text-white font-bold text-lg shadow-inner transition-colors ${getElevatorLevelStyle(elevator.level)}`}>
                    {elevator.level}
                </div>
                <UpgradeButton 
                    onClick={onUpgradeElevator} 
                    cost={elevatorUpgradeCost}
                    disabled={cash < elevatorUpgradeCost}
                    formatNumber={formatNumber}
                />
            </div>
        </div>
    );
};

export default Ground;