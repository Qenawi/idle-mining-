import React from 'react';
import { MineShaftState, ElevatorState, MarketState, MineShaftSkill, ElevatorSkill, MarketSkill, CartState, CartSkill } from '../types';
import { MAX_SKILL_LEVEL } from '../constants';
import { 
    ManagerIcon, SkillGeologistIcon, SkillDeeperVeinsIcon, SkillAdvancedMachineryIcon,
    SkillExpressLoadIcon, SkillLightweightMaterialsIcon, SkillReinforcedFrameIcon,
    SkillMasterNegotiatorIcon, SkillExpandedStorageIcon, SkillEfficientLogisticsIcon,
    SkillOverclockedPumpsIcon, SkillReinforcedPipesIcon, SkillMatterDuplicatorIcon
} from './icons';

type ModalManagerInfo = 
    | { type: 'mineshaft'; data: MineShaftState }
    | { type: 'elevator'; data: ElevatorState }
    | { type: 'market'; data: MarketState }
    | { type: 'cart'; data: CartState };

type SkillDefinition = {
    id: MineShaftSkill | ElevatorSkill | MarketSkill | CartSkill;
    name: string;
    description: string;
}

interface ManagerSkillModalProps {
    isOpen: boolean;
    onClose: () => void;
    managerInfo: ModalManagerInfo;
    onUnlockSkill: (skillId: MineShaftSkill | ElevatorSkill | MarketSkill | CartSkill) => void;
    skills: SkillDefinition[];
}

const SKILL_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    [MineShaftSkill.GEOLOGISTS_EYE]: SkillGeologistIcon,
    [MineShaftSkill.DEEPER_VEINS]: SkillDeeperVeinsIcon,
    [MineShaftSkill.ADVANCED_MACHINERY]: SkillAdvancedMachineryIcon,
    [ElevatorSkill.EXPRESS_LOAD]: SkillExpressLoadIcon,
    [ElevatorSkill.LIGHTWEIGHT_MATERIALS]: SkillLightweightMaterialsIcon,
    [ElevatorSkill.REINFORCED_FRAME]: SkillReinforcedFrameIcon,
    [CartSkill.OVERCLOCKED_PUMPS]: SkillOverclockedPumpsIcon,
    [CartSkill.REINFORCED_PIPES]: SkillReinforcedPipesIcon,
    [CartSkill.MATTER_DUPLICATOR]: SkillMatterDuplicatorIcon,
    [MarketSkill.MASTER_NEGOTIATOR]: SkillMasterNegotiatorIcon,
    [MarketSkill.EXPANDED_STORAGE]: SkillExpandedStorageIcon,
    [MarketSkill.EFFICIENT_LOGISTICS]: SkillEfficientLogisticsIcon,
};

const getManagerTitle = (info: ModalManagerInfo) => {
    switch (info.type) {
        case 'mineshaft': return `Mineshaft ${info.data.id + 1} Manager`;
        case 'elevator': return 'Elevator Manager';
        case 'market': return 'Market Manager';
        case 'cart': return 'Pipeline Manager';
    }
}

const ManagerSkillModal: React.FC<ManagerSkillModalProps> = ({ isOpen, onClose, managerInfo, onUnlockSkill, skills }) => {
    if (!isOpen) return null;

    const { data } = managerInfo;
    const skillLevels = data.skillLevels || {};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl p-6 max-w-sm w-full border-2 border-yellow-500" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-yellow-300">{getManagerTitle(managerInfo)}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                </div>

                <div className="flex items-center bg-gray-900/50 p-3 rounded-lg mb-4">
                    <ManagerIcon className="w-16 h-16 mr-4"/>
                    <div>
                        <p className="text-lg text-white">Level: <span className="font-bold">{data.managerLevel}</span></p>
                        <p className="text-lg text-yellow-400">Skill Points: <span className="font-bold">{data.skillPoints}</span></p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-1">Skills</h3>
                    {skills.map(skill => {
                        const level = (skillLevels as Record<string, number>)[skill.id] ?? 0;
                        const isUnlocked = level > 0;
                        const canUpgrade = data.skillPoints > 0 && level < MAX_SKILL_LEVEL;
                        const Icon = SKILL_ICONS[skill.id];
                        const buttonLabel = level >= MAX_SKILL_LEVEL
                            ? 'Maxed'
                            : isUnlocked
                                ? 'Upgrade'
                                : 'Unlock';

                        return (
                            <div key={skill.id} className={`flex items-center p-2 rounded-md ${isUnlocked ? 'bg-green-500/10' : 'bg-gray-700/50'}`}>
                                <div className={`flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center mr-3 ${isUnlocked ? 'bg-green-500/20' : 'bg-gray-800/60'}`}>
                                   {Icon && <Icon className={`w-8 h-8 ${isUnlocked ? 'text-green-400' : 'text-gray-400'}`} />}
                                </div>
                                <div className="flex-grow">
                                    <p className={`font-bold ${isUnlocked ? 'text-green-300' : 'text-white'}`}>{skill.name}</p>
                                    <p className="text-xs text-gray-400">{skill.description}</p>
                                    <p className="text-xs text-gray-300 mt-1">Level {level}/{MAX_SKILL_LEVEL}</p>
                                </div>
                                <button
                                    onClick={() => onUnlockSkill(skill.id)}
                                    disabled={!canUpgrade}
                                    className="ml-4 px-3 py-1 text-sm font-bold rounded-md transition-colors duration-200 disabled:cursor-not-allowed
                                        bg-yellow-500 text-black hover:bg-yellow-400
                                        disabled:bg-gray-600 disabled:text-gray-400 disabled:hover:bg-gray-600
                                    "
                                >
                                    {buttonLabel}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ManagerSkillModal;