import React from 'react';
import { ManagerIcon } from './icons';

interface ManagerProps {
    level: number;
}

const getManagerIconStyle = (level: number) => {
    if (level === 0) return 'grayscale opacity-70';
    if (level >= 100) return 'drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] text-pink-400';
    if (level >= 50) return 'drop-shadow-[0_0_8px_rgba(250,204,21,0.7)] text-yellow-300';
    if (level >= 10) return 'drop-shadow-[0_0_6px_rgba(59,130,246,0.6)] text-blue-400';
    return 'text-gray-300';
}

const Manager: React.FC<ManagerProps> = ({ level }) => {
    return (
        <div className="relative w-full h-full manager-container">
            <style>{`
                @keyframes manager-bob-animation {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-2px); }
                }
                .manager-container .manager-body-group {
                    animation: manager-bob-animation 2.8s ease-in-out infinite;
                }
                
                @keyframes manager-clipboard-wave {
                     0%, 100% { transform: rotate(0deg); }
                     50% { transform: rotate(5deg); }
                }
                .manager-container .manager-clipboard-group {
                     animation: manager-clipboard-wave 2.2s ease-in-out infinite;
                     transform-origin: 20px 42px; /* Approx elbow */
                }
            `}</style>
            <ManagerIcon className={`w-full h-full transition-all ${getManagerIconStyle(level)}`} />
        </div>
    );
};

export default Manager;