import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import verification from '../../assets/verification.png';

const VerifierHeader = ({ verifier }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('selectedOption');
        localStorage.removeItem('authToken');
        navigate('/home');
    };

    const handleProfile = () => {
        navigate('/verifierProfilePage'); // Navigate to the profile page
    };

    return (
        <header className="flex justify-between items-center px-2 md:px-8 py-6 bg-primary-color shadow-sm shadow-gray-200 relative">
            <div className="flex items-center space-x-4">
                <div className="rounded-full w-8 h-8 flex items-center justify-center">
                    <img
                        src={verification}
                        alt="eKYC Icon"
                        className="w-8 h-8"
                    />
                </div>
                <div className="font-bold text-md md:text-2xl pb-1 cursor-pointer text-white"
                >
                    VCIP
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <div
                    className="flex items-center space-x-2 cursor-pointer relative"
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    <span className="text-white">Verifier: {verifier.fullName}</span>
                    <FaUserCircle size={28} className="text-white" />
                </div>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute top-16 right-2 bg-white shadow-md rounded-md overflow-hidden w-40">
                        <button
                            onClick={handleProfile}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => navigate('/verificationQueuePage')}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default VerifierHeader;
