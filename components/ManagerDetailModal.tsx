import React, { useState } from 'react';
import { ModalManagerInfo, UpgradeAmount } from '../types';
import { ManagerIcon } from './icons';
import UpgradeAmountToggle from './UpgradeAmountToggle';
import { GameManager } from '../managers/GameManager';

interface ManagerDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: (amount: UpgradeAmount) => void;
    onOpenSkills: () => void;
    managerInfo: ModalManagerInfo;
    gameManager: GameManager;
    bonusInfo: { description: string; value: string; };
    formatNumber: (num: number) => string;
    cash: number;
    isAutoUpgradingManager: boolean;
    onToggleAutoUpgrade: () => void;
}

const getManagerTitle = (info: ModalManagerInfo) => {
    switch (info.type) {
        case 'mineshaft': return `Mineshaft ${info.data.id + 1} Manager`;
        case 'elevator': return 'Elevator Manager';
        case 'market': return 'Market Manager';
        case 'cart': return 'Pipeline Manager';
    }
}

const ManagerDetailModal: React.FC<ManagerDetailModalProps> = ({
    isOpen, onClose, onUpgrade, onOpenSkills, managerInfo,
    gameManager, bonusInfo, formatNumber, cash,
    isAutoUpgradingManager, onToggleAutoUpgrade
}) => {
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [upgradeAmount, setUpgradeAmount] = useState<UpgradeAmount>(1);

    if (!isOpen) return null;

    const { data } = managerInfo;
    const isHire = data.managerLevel === 0;
    const amountForModal = isHire ? 1 : upgradeAmount;
    
    const getUpgradeInfo = () => {
        switch(managerInfo.type) {
            case 'mineshaft': return gameManager.getManagerUpgradeInfo(managerInfo.data, amountForModal, cash);
            case 'elevator': return gameManager.getElevatorManagerUpgradeInfo(managerInfo.data, amountForModal, cash);
            case 'market': return gameManager.getMarketManagerUpgradeInfo(managerInfo.data, amountForModal, cash);
            case 'cart': return gameManager.getCartManagerUpgradeInfo(managerInfo.data, amountForModal, cash);
            default: return { levels: 0, cost: 0 };
        }
    }
    const upgradeInfo = getUpgradeInfo();


    const handleUpgradeClick = () => {
        if (cash < upgradeInfo.cost || upgradeInfo.levels === 0) return;
        setIsUpgrading(true);
        onUpgrade(amountForModal);
        setTimeout(() => setIsUpgrading(false), 200);
    };

    const upgradeDisabled = cash < upgradeInfo.cost || upgradeInfo.levels === 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl p-6 max-w-sm w-full border-2 border-purple-500" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-purple-300">{getManagerTitle(managerInfo)}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                </div>

                <div className="flex items-center bg-gray-900/50 p-3 rounded-lg mb-4">
                    <ManagerIcon className="w-20 h-20 mr-4"/>
                    <div>
                        <p className="text-lg text-white">Level: <span className="font-bold">{data.managerLevel}</span></p>
                        <p className="text-lg text-yellow-400">Skill Points: <span className="font-bold">{data.skillPoints}</span></p>
                    </div>
                </div>
                
                <div className="bg-gray-700/50 p-3 rounded-lg mb-4 text-center">
                    <p className="text-sm text-gray-300 mb-1">{bonusInfo.description}</p>
                    <p className="text-lg font-semibold text-green-400">Current Bonus: {bonusInfo.value}</p>
                </div>
                
                <div className="space-y-3">
                    {!isHire && <UpgradeAmountToggle currentAmount={upgradeAmount} onAmountChange={setUpgradeAmount} />}
                    <button
                        onClick={handleUpgradeClick}
                        disabled={upgradeDisabled}
                        className={`w-full py-3 font-bold rounded-lg transition-all duration-150 transform flex items-center justify-center ${isUpgrading ? 'scale-95' : ''} ${
                            upgradeDisabled 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-purple-600 hover:bg-purple-500 text-white'
                        }`}
                    >
                        <span>{isHire ? 'HIRE' : 'UPGRADE'}</span>
                        {!isHire && upgradeInfo.levels > 0 && <span className="ml-1.5 text-xs font-bold bg-yellow-400 text-black rounded px-1.5 py-0.5">+{upgradeInfo.levels}</span>}
                        <span className="ml-2">(${formatNumber(upgradeInfo.cost)})</span>
                    </button>

                    <button
                        onClick={onToggleAutoUpgrade}
                        className={`w-full py-2 text-sm font-bold rounded-lg border transition-colors duration-150 ${
                            isAutoUpgradingManager
                                ? 'bg-purple-600 border-purple-400 text-white shadow-md'
                                : 'bg-black/30 border-black/40 text-gray-200 hover:bg-black/40'
                        }`}
                        aria-pressed={isAutoUpgradingManager}
                    >
                        {isAutoUpgradingManager ? 'Auto Upgrade Active' : 'Enable Auto Upgrade'}
                    </button>

                    <button
                        onClick={onOpenSkills}
                        disabled={data.managerLevel === 0}
                        className="w-full py-3 font-bold rounded-lg transition-colors duration-200 bg-yellow-500 text-black hover:bg-yellow-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        View Skills {data.skillPoints > 0 && `(${data.skillPoints} available!)`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagerDetailModal;