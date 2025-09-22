import React, { useState, useEffect } from 'react';
import { UpgradeAmount } from '../types';
import { InfoIcon } from './icons';

interface UpgradeInfo {
    levels: number;
    cost: number;
}

interface DetailStat {
    label: string;
    value: string;
}

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: (amount: UpgradeAmount) => void;
    title: string;
    currentLevel: number;
    formatNumber: (num: number) => string;
    upgrades: {
        '1': UpgradeInfo;
        '10': UpgradeInfo;
        'MAX': UpgradeInfo;
    };
    cash: number;
    details: {
        current: DetailStat[];
        next: DetailStat[];
    } | null;
}

const UpgradeOptionButton: React.FC<{
    amount: UpgradeAmount;
    info: UpgradeInfo;
    currentLevel: number;
    cash: number;
    onUpgrade: (amount: UpgradeAmount) => void;
    onClose: () => void;
    formatNumber: (num: number) => string;
}> = ({ amount, info, currentLevel, cash, onUpgrade, onClose, formatNumber }) => {
    const disabled = cash < info.cost || info.levels === 0;
    return (
        <button
            onClick={() => {
                if (!disabled) {
                    onUpgrade(amount);
                    onClose();
                }
            }}
            disabled={disabled}
            className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
            <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-white">Upgrade x{amount}</span>
                <span className="text-yellow-400 font-mono">(${formatNumber(info.cost)})</span>
            </div>
            <div className="text-sm text-gray-300">
                Level {currentLevel} &rarr; Level {currentLevel + info.levels}
            </div>
        </button>
    );
};

const InfoPanel: React.FC<{
    details: { current: DetailStat[]; next: DetailStat[] };
    onBack: () => void;
}> = ({ details, onBack }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <h4 className="font-bold text-lg text-gray-300 border-b border-gray-600 pb-1 mb-2">Current</h4>
                    {details.current.map(stat => (
                        <div key={stat.label} className="mb-2">
                            <p className="text-sm text-gray-400">{stat.label}</p>
                            <p className="font-semibold text-white text-lg">{stat.value}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <h4 className="font-bold text-lg text-green-400 border-b border-green-700 pb-1 mb-2">Next Level</h4>
                    {details.next.map(stat => (
                        <div key={stat.label} className="mb-2">
                            <p className="text-sm text-gray-400">{stat.label}</p>
                            <p className="font-semibold text-white text-lg">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={onBack}
                className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors"
            >
                Back
            </button>
        </div>
    );
};

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade, title, currentLevel, formatNumber, upgrades, cash, details }) => {
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowInfo(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-900 rounded-lg shadow-2xl p-6 max-w-sm w-full border-2 border-green-500" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-green-300">{title}</h2>
                    <div className="flex items-center space-x-2">
                        {details && (
                            <button onClick={() => setShowInfo(!showInfo)} className="text-gray-400 hover:text-white" aria-label="Toggle info panel">
                                <InfoIcon className="w-6 h-6" />
                            </button>
                        )}
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                    </div>
                </div>
                
                <p className="text-center mb-4 text-gray-400">Current Level: <span className="font-bold text-white">{currentLevel}</span></p>

                {showInfo && details ? (
                    <InfoPanel details={details} onBack={() => setShowInfo(false)} />
                ) : (
                    <div className="space-y-3">
                        <UpgradeOptionButton 
                            amount={1} 
                            info={upgrades['1']}
                            currentLevel={currentLevel}
                            cash={cash}
                            onUpgrade={onUpgrade}
                            onClose={onClose}
                            formatNumber={formatNumber} 
                        />
                        <UpgradeOptionButton 
                            amount={10} 
                            info={upgrades['10']}
                            currentLevel={currentLevel}
                            cash={cash}
                            onUpgrade={onUpgrade}
                            onClose={onClose}
                            formatNumber={formatNumber}
                        />
                        <UpgradeOptionButton 
                            amount={'MAX'} 
                            info={upgrades['MAX']}
                            currentLevel={currentLevel}
                            cash={cash}
                            onUpgrade={onUpgrade}
                            onClose={onClose}
                            formatNumber={formatNumber}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpgradeModal;