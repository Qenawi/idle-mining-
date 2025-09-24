import React from 'react';
import southFacingMiner from '../assets/miner/rotations/south.png';

const Miner: React.FC = () => {
    return (
        <div className="relative w-20 h-20 miner-container flex items-center justify-center">
            <style>
                {`
                    @keyframes miner-bob-animation {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-4px); }
                    }

                    .miner-container .miner-sprite {
                        animation: miner-bob-animation 2.2s ease-in-out infinite;
                        image-rendering: pixelated;
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                `}
            </style>
            <img src={southFacingMiner} alt="Miner character" className="miner-sprite" />
        </div>
    );
};

export default Miner;