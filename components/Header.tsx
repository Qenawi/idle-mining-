import React from 'react';
import { CoinIcon, SettingsIcon, LightbulbIcon } from './icons';

interface HeaderProps {
    cash: number;
    idleIncome: number;
    formatNumber: (num: number) => string;
    onSettingsClick: () => void;
    onGetAiTip: () => void;
    aiTip: string | null;
    isFetchingAiTip: boolean;
    aiTipError: string | null;
    clearAiTip: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    cash, idleIncome, formatNumber, onSettingsClick,
    onGetAiTip, aiTip, isFetchingAiTip, aiTipError, clearAiTip
}) => {
    const showTip = aiTip || aiTipError;

    return (
        <header className="bg-[#1A5F9E] text-white p-2 grid grid-cols-3 items-center shadow-lg border-b-4 border-black/20 z-20 rounded-t-2xl">
            <div className="text-center">
                <p className="text-xs font-bold opacity-80">IDLE INCOME</p>
                <div className="flex items-center justify-center">
                    <CoinIcon className="w-5 h-5 text-yellow-300 mr-1" />
                    <span className="text-lg font-bold">
                        ${formatNumber(idleIncome)}/s
                    </span>
                </div>
            </div>

            <div className="text-center">
                <p className="text-sm font-bold opacity-80">CASH</p>
                <div className="flex items-center justify-center">
                    <CoinIcon className="w-6 h-6 text-yellow-300 mr-1" />
                    <span className="text-xl font-bold">
                        ${formatNumber(cash)}
                    </span>
                </div>
            </div>
            
            <div className="flex items-center justify-end pr-2 space-x-2">
                <div className="relative">
                    <button
                        onClick={onGetAiTip}
                        disabled={isFetchingAiTip}
                        className="p-2 bg-purple-600 rounded-md border-b-2 border-purple-800 shadow-md transform transition-transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-wait"
                        aria-label="Get AI Tip"
                    >
                        <LightbulbIcon className={`w-6 h-6 text-yellow-300 ${isFetchingAiTip ? 'animate-pulse' : ''}`} />
                    </button>
                    {showTip && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-yellow-400 rounded-lg p-3 shadow-lg z-50 transform animate-fade-in-down">
                            <style>{`
                                @keyframes fade-in-down {
                                    0% { opacity: 0; transform: translateY(-10px); }
                                    100% { opacity: 1; transform: translateY(0); }
                                }
                                .animate-fade-in-down { animation: fade-in-down 0.3s ease-out; }
                            `}</style>
                            <p className={`text-sm ${aiTipError ? 'text-red-400' : 'text-white'}`}>
                                {aiTip || aiTipError}
                            </p>
                            <button onClick={clearAiTip} className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold transition-transform transform hover:scale-110">&times;</button>
                        </div>
                    )}
                </div>
                 <button 
                    onClick={onSettingsClick}
                    className="p-2 bg-yellow-500 rounded-md border-b-2 border-yellow-700 shadow-md transform transition-transform hover:scale-105"
                    aria-label="Open Settings"
                >
                    <SettingsIcon className="w-6 h-6 text-white" />
                </button>
            </div>
        </header>
    );
};

export default Header;