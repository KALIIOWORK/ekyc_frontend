import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

const VerifierHeader = ({ verifier }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('selectedOption');
        localStorage.removeItem('authToken');
        navigate('/home');
    };

    const handleProfile = () => {
        navigate('/profile'); // Navigate to the profile page
    };

    return (
        <header className="flex justify-between items-center px-2 md:px-8 py-6 bg-primary-color shadow-sm shadow-gray-200 relative">
            <h1 className="text-lg sm:text-2xl font-semibold text-white">Video eKYC</h1>
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
