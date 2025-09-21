import React, { useState } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onResetGame: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onResetGame }) => {
    const [isConfirmingReset, setIsConfirmingReset] = useState(false);

    if (!isOpen) {
        return null;
    }

    const handleResetClick = () => {
        if (isConfirmingReset) {
            onResetGame();
        } else {
            setIsConfirmingReset(true);
        }
    };

    const handleClose = () => {
        setIsConfirmingReset(false);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-6 max-w-sm w-full border-2 border-blue-400">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-300">Settings</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div className="space-y-4">
                    <p className="text-gray-300">
                        Resetting will erase all your progress, including cash, upgrades, and shafts. This action cannot be undone.
                    </p>
                    <button
                        onClick={handleResetClick}
                        className={`w-full py-3 font-bold rounded-lg transition-colors duration-200 ${
                            isConfirmingReset 
                                ? 'bg-red-700 hover:bg-red-800 text-white' 
                                : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                    >
                        {isConfirmingReset ? 'Are you sure?' : 'Reset Game'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
