import React from 'react';

const ImageModal = ({ isOpen, onClose, imageSrc }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                <button onClick={onClose} className="text-red-500 float-right">
                    <span className="text-2xl">&times;</span>
                </button>
                <img src={imageSrc} alt="Aadhaar Card" className="max-w-full max-h-full" />
            </div>
        </div>
    );
};

export default ImageModal;