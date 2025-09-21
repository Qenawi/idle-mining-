import React, { useState } from 'react';

interface UpgradeButtonProps {
    onClick: () => void;
    cost: number;
    disabled?: boolean;
    formatNumber: (num: number) => string;
}

const UpgradeButton: React.FC<UpgradeButtonProps> = ({ onClick, cost, disabled, formatNumber }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        if (disabled) return;
        setIsClicked(true);
        onClick();
        setTimeout(() => setIsClicked(false), 150);
    };

    const clickedClass = isClicked ? 'scale-95' : '';

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`w-full flex items-center justify-center px-1 py-1 bg-green-600 text-white font-bold rounded-md border-b-2 border-green-800 hover:bg-green-500 disabled:bg-gray-600 disabled:border-gray-800 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-150 text-xs shadow-md ${clickedClass}`}
        >
            UPGRADE (${formatNumber(cost)})
        </button>
    );
};

export default UpgradeButton;