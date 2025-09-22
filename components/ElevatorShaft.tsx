import React from 'react';
import { ElevatorState } from '../types';
import Elevator from './Elevator';
import { Resource } from '../services/resourceService';

interface ElevatorShaftProps {
    elevator: ElevatorState;
    resources: Resource[];
}

const ElevatorShaft: React.FC<ElevatorShaftProps> = ({ elevator, resources }) => {
    return (
        <div className="h-full w-full flex flex-col items-center relative">
            {/* Shaft Lines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px border-l-2 border-dashed border-black/20 z-0"></div>
            <div className="absolute top-0 left-[calc(50%-14px)] -translate-x-1/2 h-full w-px border-l-2 border-dashed border-black/20 z-0"></div>
            <div className="absolute top-0 left-[calc(50%+14px)] -translate-x-1/2 h-full w-px border-l-2 border-dashed border-black/20 z-0"></div>
            
            {/* Level Markers have been moved to App.tsx to align with the scrolling mineshaft list */}

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
                <Elevator elevator={elevator} resources={resources} />
            </div>
        </div>
    );
};

export default ElevatorShaft;