import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export const StartVideoCallPage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col min-h-screen bg-primary-color">
            <Header />
            <div className="flex flex-col items-center justify-center py-6 px-8 pt-24">
                <div className="w-full md:w-1/2 p-2 flex justify-center items-center flex-col">
                    <span className="text-md text-white block text-center mb-6">
                        Click on the Start Video Call button to initiate the video KYC journey to connect with agent whenever you are ready
                    </span>

                    <form className="space-y-5">
                        <button
                            type="submit"
                            onClick={() => navigate('/consentPage')}
                            className="bg-text-color text-white text-lg py-2 px-10 w-full rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                        >
                            Start Video Call
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}