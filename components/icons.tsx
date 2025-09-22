import React from 'react';

export const CoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-0.5-12h1v-1c0-.55-.45-1-1-1s-1 .45-1 1v1h-1.5c-.28 0-.5.22-.5.5s.22.5.5.5h1.5v4h-2v1c0 .55.45 1 1 1s1-.45 1-1v-1h.5c1.1 0 2-.9 2-2v-2.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V12c0 .55-.45 1-1 1h-.5v-4z"/>
    </svg>
);

export const ArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);

export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.4 12.5c0 .3-.1.6-.2.8l1.7 1.3c.3.2.4.6.2.9l-1.7 3c-.2.3-.6.4-.9.2l-2-1c-.5.3-1 .6-1.5.8L14.2 20c-.1.4-.4.6-.8.6h-3c-.4 0-.7-.2-.8-.6l-.3-2.3c-.5-.2-1-.5-1.5-.8l-2 1c-.3.2-.7.1-.9-.2l-1.7-3c-.2-.3-.1-.7.2-.9l1.7-1.3c-.1-.3-.2-.5-.2-.8s.1-.6.2-.8l-1.7-1.3c-.3-.2-.4-.6-.2-.9l1.7-3c.2-.3.6-.4.9.2l2 1c.5-.3 1-.6 1.5-.8L9.8 4c.1-.4.4-.6.8-.6h3c.4 0 .7.2.8.6l.3 2.3c.5.2 1 .5 1.5.8l2-1c.3-.2.7-.1.9.2l1.7 3c.2.3.1.7-.2.9l-1.7 1.3c.1.2.2.5.2.8zm-7.4-4.5c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
  </svg>
);

export const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7zM9 21a1 1 0 001 1h4a1 1 0 001-1v-1H9v1z"/>
    </svg>
);

export const ResourceIcon: React.FC<React.SVGProps<SVGSVGElement> & { color: string }> = ({ color, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
        <path d="M12 .587l-10 6v10l10 6 10-6v-10l-10-6z" fill={color} stroke="black" strokeWidth="1"/>
    </svg>
);


export const ManagerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g className="manager-body-group">
            {/* Body */}
            <path d="M24 58 L 24 40 A 8 8 0 0 1 32 32 A 8 8 0 0 1 40 40 L 40 58 Z" fill="#616161" stroke="#000" strokeWidth="2" />
            {/* Tie */}
            <path d="M32 32 L 30 46 L 32 50 L 34 46 Z" fill="#E53935" stroke="#000" strokeWidth="1.5" />
            
            {/* Head */}
            <circle cx="32" cy="24" r="8" fill="#FFE082" stroke="#000" strokeWidth="2" />
            
            {/* Hard Hat */}
            <path d="M22 20 C 22 14, 42 14, 42 20 L 44 20 L 44 22 L 20 22 L 20 20 Z" fill="#FFFFFF" stroke="#000" strokeWidth="2" />

            {/* Clipboard Arm */}
            <g className="manager-clipboard-group">
                {/* Arm */}
                <path d="M26 38 C 22 36, 18 38, 16 42" stroke="#FFE082" strokeWidth="6" strokeLinecap="round" fill="none"/>
                {/* Clipboard */}
                <rect x="2" y="40" width="16" height="20" rx="2" fill="#8D6E63" stroke="#000" strokeWidth="2" />
                <rect x="5" y="43" width="10" height="14" fill="#FAFAFA" stroke="#000" strokeWidth="1" />
                <path d="M6 46 H 14 M6 49 H 14 M6 52 H 12" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" />
            </g>
        </g>
    </svg>
);


interface MinerIconProps extends React.SVGProps<SVGSVGElement> {
    isElevator?: boolean;
}

export const MinerIcon: React.FC<MinerIconProps> = ({ isElevator, ...props }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* The group that will bob up and down */}
        <g className="miner-body-group">
            {/* Body */}
            <path d="M24 58 L 24 40 A 8 8 0 0 1 32 32 A 8 8 0 0 1 40 40 L 40 58 Z" fill="#42A5F5" stroke="#000" strokeWidth="2" />
            
            {/* Head */}
            <circle cx="32" cy="24" r="8" fill="#FFE082" stroke="#000" strokeWidth="2" />
            
            {/* Hard Hat */}
            <path d="M22 20 C 22 14, 42 14, 42 20 L 44 20 L 44 22 L 20 22 L 20 20 Z" fill="#FFCA28" stroke="#000" strokeWidth="2" />
            <rect x="29" y="12" width="6" height="4" fill="#FFF59D" stroke="#000" strokeWidth="1.5" />
            
            {/* The group that will swing */}
            {!isElevator && (
                <g className="miner-arm-pickaxe">
                    {/* Arm */}
                    <path d="M38 36 C 42 32, 46 32, 50 34" stroke="#FFE082" strokeWidth="6" strokeLinecap="round" fill="none"/>
                    {/* Pickaxe */}
                    <path d="M62 2 L 40 24" stroke="#A1887F" strokeWidth="6" strokeLinecap="round" />
                    <path d="M40 24 L 36 20 M40 24 L 44 28" stroke="#A1887F" strokeWidth="6" strokeLinecap="round" />
                    <path d="M62 2 L 56 -2 M62 2 L 60 8" stroke="#BDBDBD" strokeWidth="5" strokeLinecap="round" />
                </g>
            )}
        </g>
    </svg>
);


export const MarketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
        <g stroke="#000" strokeWidth="2.5">
            <rect x="4" y="20" width="56" height="32" rx="4" fill="currentColor" />
            <path d="M48 34 A 16 12 0 0 0 16 34" fill="#60a5fa" />
        </g>
    </svg>
);

// --- Skill Icons ---

export const SkillGeologistIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SkillDeeperVeinsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 15V9a5 5 0 0110 0v6M12 21v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 9a2 2 0 100-4 2 2 0 000 4z" fill="currentColor"/>
    </svg>
);

export const SkillAdvancedMachineryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 20V12M12 12L8 8M12 12l4-4M4 12a8 8 0 1016 0 8 8 0 00-16 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SkillExpressLoadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M13 17l5-5-5-5M6 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SkillLightweightMaterialsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M22 12h-6l-4-9-4 9H2M22 12l-3 7-4-3-4 3-3-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SkillReinforcedFrameIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4"/>
    </svg>
);

export const SkillMasterNegotiatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M13 10l-4 4 6 6M13 10a3 3 0 114.24-4.24L10 13l-4 4 6 6 7.24-7.24a3 3 0 00-4.24-4.24z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 16l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SkillExpandedStorageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M9 21h6M12 17V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SkillEfficientLogisticsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 2l-2 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

// --- Cart/Pipeline Skill Icons ---
export const SkillOverclockedPumpsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const SkillReinforcedPipesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 6a6 6 0 100 12 6 6 0 000-12z" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
    </svg>
);

export const SkillMatterDuplicatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M16.5 9.5L12 15l-4.5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.5 14.5L12 20l-4.5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    </svg>
);