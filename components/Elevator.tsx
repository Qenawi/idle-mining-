import React from 'react';
import { ElevatorState } from '../types';
import { MinerIcon, ResourceIcon } from './icons';
import { Resource } from '../services/resourceService';

interface ElevatorProps {
    elevator: ElevatorState;
    resources: Resource[];
}

const getElevatorStyle = (level: number): string => {
    if (level >= 50) return 'bg-yellow-500/80 border-yellow-700';
    if (level >= 25) return 'bg-slate-400/80 border-slate-600';
    if (level >= 10) return 'bg-orange-400/80 border-orange-600';
    return 'bg-gray-700/50 border-black';
};

const getTotalLoad = (load: { [key: string]: number }) => {
    return Object.values(load).reduce((acc, val) => acc + val, 0);
}

const Elevator: React.FC<ElevatorProps> = ({ elevator, resources }) => {
    const totalLoad = getTotalLoad(elevator.load);
    const wobbleClass = totalLoad > 0 ? 'wobble-container' : '';
    
    const resourceMap = new Map(resources.map(r => [r.id, r]));
    const carriedResources = Object.keys(elevator.load).map(id => resourceMap.get(id)).filter(Boolean) as Resource[];

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
                className={`absolute left-1/2 -translate-x-1/2 w-14 h-14 transition-all duration-100 ease-linear ${wobbleClass}`}
                style={{ top: `${elevator.y}px` }}
                aria-label={`Elevator at position ${Math.round(elevator.y)}`}
            >
                {totalLoad > 0 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black/50 rounded-full px-2 py-0.5 flex items-center text-xs z-10">
                        <div className="flex items-center -space-x-1">
                            {carriedResources.slice(0, 3).map(resource => (
                                <ResourceIcon key={resource.id} color={resource.color} className="w-4 h-4" />
                            ))}
                        </div>
                        <span className="ml-1.5 font-mono">{Math.floor(totalLoad)}</span>
                    </div>
                )}
                <div
                    // This is the element that will actually wobble
                    className={`w-full h-full border-4 rounded-lg shadow-xl flex flex-col items-center justify-center relative wobble-target transition-colors duration-300 ${getElevatorStyle(elevator.level)}`}
                >
                    <MinerIcon isElevator={true} className="w-10 h-10" />
                </div>
            </div>
        </>
    );
};

export default Elevator;
