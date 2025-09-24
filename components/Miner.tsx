import React, { useEffect, useMemo, useState } from 'react';
import southFacingMiner from '../assets/miner/rotations/south.png';
import northFacingMiner from '../assets/miner/rotations/north.png';
import eastFacingMiner from '../assets/miner/rotations/east.png';
import westFacingMiner from '../assets/miner/rotations/west.png';
import minerMetadata from '../assets/miner/metadata.json';

type MinerMetadata = {
    frames?: {
        rotations?: Record<string, string>;
    };
};

const Miner: React.FC = () => {
    const rotations = useMemo(() => {
        const typedMetadata = minerMetadata as MinerMetadata;
        const rotationEntries = Object.entries(typedMetadata.frames?.rotations ?? {});

        const rotationImageMap: Record<string, string> = {
            south: southFacingMiner,
            north: northFacingMiner,
            east: eastFacingMiner,
            west: westFacingMiner,
        };

        return rotationEntries.map(([direction]) => ({
            direction,
            src: rotationImageMap[direction] ?? southFacingMiner,
        }));
    }, []);

    const [currentRotationIndex, setCurrentRotationIndex] = useState(0);

    useEffect(() => {
        if (rotations.length <= 1) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setCurrentRotationIndex((prevIndex) => (prevIndex + 1) % rotations.length);
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [rotations.length]);

    const currentRotation = rotations[currentRotationIndex];

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
            <img
                src={currentRotation?.src ?? southFacingMiner}
                alt={`Miner character facing ${currentRotation?.direction ?? 'south'}`}
                className="miner-sprite"
            />
        </div>
    );
};

export default Miner;