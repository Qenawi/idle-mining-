import React from 'react';

export const CoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
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
    <path d="M19.4 12.5c0 .3-.1.6-.2.8l1.7 1.3c.3.2.4.6.2.9l-1.7 3c-.2.3-.6.4-.9.2l-2-1c-.5.3-1 .6-1.5.8L14.2 20c-.1.4-.4.6-.8.6h-3c-.4 0-.7-.2-.8-.6l-.3-2.3c-.5-.2-1-.5-1.5-.8l-2 1c-.3.2-.7.1-.9-.2l-1.7-3c-.2-.3-.1-.7.2-.9l1.7-1.3c-.1-.3-.2-.5-.2-.8s.1-.6.2-.8l-1.7-1.3c-.3-.2-.4-.6-.2-.9l1.7-3c.2-.3.6-.4.9-.2l2 1c.5-.3 1-.6 1.5-.8L9.8 4c.1-.4.4-.6.8-.6h3c.4 0 .7.2.8.6l.3 2.3c.5.2 1 .5 1.5.8l2-1c.3-.2.7-.1.9.2l1.7 3c.2.3.1.7-.2.9l-1.7 1.3c.1.2.2.5.2.8zm-7.4-4.5c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
  </svg>
);

export const ManagerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
        <g fill="none" stroke="#000" strokeWidth="2">
            <path fill="#4CAF50" d="M22 60V42c0-5.523 4.477-10 10-10s10 4.477 10 10v18z" />
            <path fill="#FFC107" d="M32 32a10 10 0 100-20 10 10 0 000 20z" />
            <path fill="#F44336" d="M32 22a8 8 0 100-16 8 8 0 000 16z" />
            <path fill="#4527A0" d="M26 60h12v-8H26z" />
        </g>
    </svg>
);

interface MinerIconProps extends React.SVGProps<SVGSVGElement> {
    isElevator?: boolean;
}

export const MinerIcon: React.FC<MinerIconProps> = ({ isElevator, ...props }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g stroke="#000" strokeWidth="2">
            {!isElevator && (
                <path d="M60 4L20 44M54 -2l10 10M16 40l-4 4" stroke="#6D4C41" strokeWidth="6" />
            )}
            <circle cx="32" cy="46" r="12" fill="#d32f2f"/>
            <circle cx="32" cy="32" r="14" fill="#ffc107"/>
        </g>
    </svg>
);

export const WarehouseBuildingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <g stroke="black" strokeWidth="1">
            <path d="M20 11h-2V8l-6-4-6 4v3H4l-2 2v8h20v-8l-2-2zM12 5.33L16 8v3h-8V8l4-2.67zM4 19v-6h16v6H4z"/>
            <path d="M11 14h2v4h-2z"/>
        </g>
    </svg>
);

export const TransportWorkerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 80 64" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g fill="none" stroke="#000" strokeWidth="2">
            {/* Minecart */}
            <path d="M2,40 L10,60 H40 L48,40 Z" fill="#9e9e9e"/>
            <circle cx="15" cy="60" r="4" fill="#424242"/>
            <circle cx="35" cy="60" r="4" fill="#424242"/>
            <path d="M10,40 H40" strokeWidth="4" stroke="#616161"/>

            {/* Worker */}
            <g transform="translate(20, 0)">
                 <path d="M42,54 C42,48 46,44 52,44 C58,44 62,48 62,54Z" fill="#4caf50"/>
                 <circle cx="52" cy="30" r="10" fill="#ffc107"/>
                 <circle cx="52" cy="22" r="8" fill="#f44336"/>
            </g>
        </g>
    </svg>
);