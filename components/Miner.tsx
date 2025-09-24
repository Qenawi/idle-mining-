import React, { useEffect, useMemo, useState } from 'react';
import southFacingMiner from '../assets/miner/rotations/south.png';
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

        return rotationEntries.map(([direction, relativePath]) => ({
            direction,
            src: new URL(`../assets/miner/${relativePath}`, import.meta.url).href,
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