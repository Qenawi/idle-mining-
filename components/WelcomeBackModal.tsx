import React from 'react';
import { CoinIcon } from './icons';

interface WelcomeBackModalProps {
    earnings: number;
    timeOffline: number;
    onClose: () => void;
}

const formatDuration = (totalSeconds: number): string => {
    const seconds = Math.floor(totalSeconds);

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
};

const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({ earnings, timeOffline, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-sm w-full border-2 border-yellow-400 transform scale-100 transition-transform duration-300">
                <h2 className="text-3xl font-bold text-yellow-300 text-center mb-2">Welcome Back!</h2>
                <p className="text-gray-400 text-center text-sm mb-4">
                    You were away for <span className="font-bold text-white">{formatDuration(timeOffline)}</span>.
                </p>
                <p className="text-gray-300 text-center mb-6">Your miners earned an estimated:</p>
                <div className="flex items-center justify-center bg-gray-900 px-4 py-3 rounded-lg mb-8">
                    <CoinIcon className="w-10 h-10 text-yellow-400 mr-4" />
                    <span className="text-4xl font-mono font-bold text-green-400">
                        ${earnings.toLocaleString()}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                    Collect
                </button>
            </div>
        </div>
    );
};

export default WelcomeBackModal;