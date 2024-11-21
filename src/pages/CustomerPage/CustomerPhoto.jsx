import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export const CustomerPhoto = () => {

    const [photo, setPhoto] = useState('');
    const navigate = useNavigate();

    const handlePhotoClick = () => {
        // Code to click a photo
        // Code to store the photo in local storage
    };

    const handleProceed = () => {
        // Proceed to the next page (replace with your actual route)
        //set to local storage
        navigate(`/customerOTPPage`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-primary-color">
            <Header />
            <div className="flex flex-col items-center justify-center py-6 px-8 pt-24">
                <div className="w-full md:w-1/2 p-2 flex justify-center items-center flex-col">
                    <span className="text-md text-white block text-center mb-6">
                        Click a photo to proceed
                    </span>
                    <div className="photo-container">
                        <img
                            src={photo}
                            alt="photo"
                            className="photo"
                        />
                    </div>
                    <div className='flex flex-row '>
                        <button
                            onClick={handlePhotoClick}
                            className="bg-text-color text-black py-2 px-4 mr-10  mt-4 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                        >
                            Click Photo
                        </button>
                        <button
                            onClick={handleProceed}
                            className="bg-text-color text-black py-2 px-4  mt-4 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};