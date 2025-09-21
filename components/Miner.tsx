import React from 'react';
import { MinerIcon } from './icons';

const Miner: React.FC = () => {
    return (
        <div className="relative w-20 h-20 miner-body">
            <style>
                {`
                    @keyframes mine-animation {
                        0% { transform: rotate(10deg); }
                        50% { transform: rotate(-35deg); }
                        100% { transform: rotate(10deg); }
                    }
                    .miner-pickaxe {
                        animation: mine-animation 1.5s ease-in-out infinite;
                        transform-origin: bottom right;
                    }

                    @keyframes miner-bob-animation {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-4px); }
                    }
                    .miner-body {
                        animation: miner-bob-animation 2.5s ease-in-out infinite;
                    }
                `}
            </style>
            <div className="absolute bottom-0 right-0 miner-pickaxe">
                <MinerIcon className="w-16 h-16" />
            </div>
        </div>
    );
};

export default Miner;