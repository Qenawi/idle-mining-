import React from 'react';
import { UpgradeAmount } from '../types';

interface UpgradeAmountToggleProps {
    currentAmount: UpgradeAmount;
    onAmountChange: (amount: UpgradeAmount) => void;
}

const UpgradeAmountToggle: React.FC<UpgradeAmountToggleProps> = ({ currentAmount, onAmountChange }) => {
    const amounts: UpgradeAmount[] = [1, 10, 'MAX'];

    return (
        <div className="flex bg-black/20 rounded-lg p-0.5 space-x-0.5">
            {amounts.map(amount => (
                <button
                    key={amount}
                    onClick={() => onAmountChange(amount)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors w-14 ${
                        currentAmount === amount
                            ? 'bg-yellow-400 text-black shadow-inner'
                            : 'bg-transparent text-white hover:bg-black/20'
                    }`}
                >
                    x{amount}
                </button>
            ))}
        </div>
    );
};

export default UpgradeAmountToggle;
