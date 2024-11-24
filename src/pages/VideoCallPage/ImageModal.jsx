import React from 'react';

const ImageModal = ({ isOpen, onClose, imageSrc }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                <button onClick={onClose} className="text-red-500 float-right">
                    <span className="text-2xl">Close</span>
                </button>
                <img
                    src={imageSrc}
                    alt="Modal Content"
                    className="w-full h-auto sm:w-[80vw] sm:h-[calc(80vw*9/16)] md:w-[60vw] md:h-[calc(60vw*9/16)] lg:w-[50vw] lg:h-[calc(50vw*9/16)] xl:w-[40vw] xl:h-[calc(40vw*9/16)] object-cover"
                />
            </div>
        </div>
    );
};

export default ImageModal;