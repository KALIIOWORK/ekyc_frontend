import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export const VideoCallSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-primary-color">
            <Header />
            <div className="flex flex-col items-center justify-center py-6 px-8 pt-24">
                <div className="w-full md:w-1/2 p-2 flex justify-center items-center flex-col">
                    <span className="text-3xl font-semibold text-center text-green-600 mb-3">Success!</span>
                    <span className="text-md text-white block text-center mb-6">
                        Congratulations! Your details have been submitted for backend validation. Your wallet will be created shortly.
                    </span>

                    <form className="space-y-5">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="bg-text-color text-white text-lg py-2 px-10 w-full rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                        >
                            Back to Home
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
