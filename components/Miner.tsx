import React from 'react';
import { MinerIcon } from './icons';

const Miner: React.FC = () => {
    return (
        <div className="relative w-20 h-20 miner-container">
            <style>
                {`
                    @keyframes mine-swing-animation {
                        0% { transform: rotate(15deg); }
                        50% { transform: rotate(-30deg); }
                        100% { transform: rotate(15deg); }
                    }
                    .miner-container .miner-arm-pickaxe {
                        animation: mine-swing-animation 1.2s ease-in-out infinite;
                        transform-origin: 38px 36px; /* Approx shoulder point */
                    }

                    @keyframes miner-bob-animation {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-3px); }
                    }
                    .miner-container .miner-body-group {
                        animation: miner-bob-animation 2.2s ease-in-out infinite;
                    }
                `}
            </style>
            {/* The actual character icon */}
            <MinerIcon className="w-full h-full" />
        </div>
    );
};

export default Miner;