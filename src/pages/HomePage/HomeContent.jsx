import React from 'react';
import { useNavigate } from 'react-router-dom';
import aadhar from '../../assets/aadhar_homepage.jpeg'
import banner from '../../assets/banner.png';
import verification from '../../assets/verification.png';

export const HomeContent = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col md:flex-row items-center justify-center w-full h-full bg-primary-color md:px-20">
            {/* Left Section */}
            <div className="flex flex-col text-center md:text-left md:w-1/2 p-10  items-center">
                <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        {/* <div className=" rounded-full w-8 h-8 flex items-center justify-center">
                            <img
                                src={verification}
                                alt="eKYC Icon"
                                className="w-8 h-8"
                            />
                        </div>
                        <h2 className="text-lg font-medium text-gray-700">eKYC Connect</h2> */}
                    </div>
                    <h1 className="text-4xl md:text-5xl text-white mb-8 leading-relaxed" style={{ lineHeight: '1.2' }}>
                        eKYC - Online <span className="text-blue-400">Customer <br /> Onboarding and</span> Identity <br />Verification
                    </h1>
                    {/* <p className="text-white mb-6">
                        Upload Aadhaar card & PAN card, prepare for agent <br /> assistance.
                    </p> */}
                    <button
                        onClick={() => navigate('/customerPage')}
                        className="bg-text-color text-white text-lg  py-3 px-24 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5">
                        Start your ekyc
                    </button>
                </div>
            </div>

            {/* Right Section */}
            <div className="lg:w-1/2 flex justify-center">
                <div className=" flex justify-center items-center">
                    <img
                        src={banner}
                        alt="Aadhaar"
                        className="w-64 h-48 lg:w-112 lg:h-84 object-cover mx-auto float"
                    />
                </div>
            </div>
        </div>
    );
};
