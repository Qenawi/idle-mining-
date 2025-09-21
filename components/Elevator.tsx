import React from 'react';
import { ElevatorState } from '../types';
import { MinerIcon, CoinIcon } from './icons';

interface ElevatorProps {
    elevator: ElevatorState;
}

const getElevatorStyle = (level: number): string => {
    if (level >= 50) return 'bg-yellow-500/80 border-yellow-700';
    if (level >= 25) return 'bg-slate-400/80 border-slate-600';
    if (level >= 10) return 'bg-orange-400/80 border-orange-600';
    return 'bg-gray-700/50 border-black';
};


const Elevator: React.FC<ElevatorProps> = ({ elevator }) => {
    // Determine if the wobble class should be applied
    const wobbleClass = elevator.load > 0 ? 'wobble-container' : '';

    return (
        <>
            <style>
                {`
                    @keyframes wobble-effect {
                        0%, 100% { transform: rotate(0deg); }
                        25% { transform: rotate(-2deg); }
                        75% { transform: rotate(2deg); }
                    }
                    /* Apply animation only when the container has the class */
                    .wobble-container .wobble-target {
                        animation: wobble-effect 0.5s ease-in-out infinite;
                    }
                `}
            </style>
            <div
                className={`absolute left-1/2 -translate-x-1/2 w-16 h-16 transition-all duration-100 ease-linear ${wobbleClass}`}
                style={{ top: `${elevator.y}px` }}
                aria-label={`Elevator at position ${Math.round(elevator.y)}`}
            >
                {elevator.load > 0 &&
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black/50 rounded-full px-2 py-0.5 flex items-center text-xs z-10">
                        <CoinIcon className="w-3 h-3 mr-1 text-yellow-300"/>
                        <span>{Math.floor(elevator.load)}</span>
                    </div>
                }
                <div
                    // This is the element that will actually wobble
                    className={`w-full h-full border-4 rounded-lg shadow-xl flex flex-col items-center justify-center relative wobble-target transition-colors duration-300 ${getElevatorStyle(elevator.level)}`}
                >
                    <MinerIcon isElevator={true} className="w-12 h-12" />
                </div>
            </div>
        </>
    );
};

export default Elevator;