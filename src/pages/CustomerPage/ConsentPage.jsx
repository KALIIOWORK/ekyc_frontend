import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export const ConsentPage = () => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();
    const eKYCId = localStorage.getItem('eKYCId');

    // Handle checkbox change
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    // Handle consent submission
    const handleSubmit = () => {
        // Proceed to the next page (replace with your actual route)
        navigate(`/videoCallPage/${eKYCId}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-primary-color">
            <Header />
            <div className="flex flex-col items-center justify-center py-6 px-8 pt-24">
                <div className="w-full md:w-1/2 p-2 flex justify-center items-center flex-col">
                    <span className="text-md text-white block text-center mb-6">
                        You will now begin your video KYC process with your agent
                    </span>
                    <span className="text-md font-bold text-white block text-center mb-6">
                        Tap the below button to give your consent
                    </span>

                    <span className="text-md text-white block text-center mb-6">
                        I give my consent for call recording during the completion of the VKYC process along with validation of PAN card and other OVDs from government authorized sites.
                    </span>

                    {/* Checkbox for consent */}
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="consentCheckbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            className="mr-2 w-4 h-4"
                        />
                        <label htmlFor="consentCheckbox" className="text-sm text-white">
                            I agree to the terms and conditions
                        </label>
                    </div>

                    {/* Proceed Button */}
                    <form className="space-y-5">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={!isChecked}
                            className={`text-lg text-white py-2 px-10 w-full rounded-full transition duration-200 ease-in-out transform 
                                ${isChecked ? 'bg-text-color hover:bg-hover-color' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            Start Video Call
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConsentPage;
