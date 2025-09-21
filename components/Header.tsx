import React from 'react';
import { CoinIcon, SettingsIcon } from './icons';

interface HeaderProps {
    cash: number;
    idleIncome: number;
    formatNumber: (num: number) => string;
    onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cash, idleIncome, formatNumber, onSettingsClick }) => {
    return (
        <header className="bg-[#1A5F9E] text-white p-2 flex justify-around items-center shadow-lg border-b-4 border-black/20 z-20 rounded-t-2xl">
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
            <button 
                onClick={onSettingsClick}
                className="p-2 bg-yellow-500 rounded-md border-b-2 border-yellow-700 shadow-md transform transition-transform hover:scale-105"
                aria-label="Open Settings"
            >
                <SettingsIcon className="w-6 h-6 text-white" />
            </button>
        </header>
    );
};

export default Header;