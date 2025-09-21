import React from 'react';
import { ElevatorState } from '../types';
import Elevator from './Elevator';

interface ElevatorShaftProps {
    elevator: ElevatorState;
}

const ElevatorShaft: React.FC<ElevatorShaftProps> = ({ elevator }) => {
    return (
        <div className="h-full w-full flex flex-col items-center relative">
            {/* Shaft Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px border-l-2 border-dashed border-black/20"></div>
             <div className="absolute top-0 left-[calc(50%-14px)] -translate-x-1/2 h-full w-px border-l-2 border-dashed border-black/20"></div>
             <div className="absolute top-0 left-[calc(50%+14px)] -translate-x-1/2 h-full w-px border-l-2 border-dashed border-black/20"></div>
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
                <Elevator elevator={elevator} />
            </div>
        </div>
    );
};

export default ElevatorShaft;