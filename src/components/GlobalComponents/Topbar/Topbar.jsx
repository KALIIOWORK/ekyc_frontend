import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'react-feather'; // For hamburger and close icons
import verification from '../../../assets/verification.png';

const Topbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleAgentClick = () => {
        localStorage.setItem('selectedOption', 'Agent');
        navigate('/agentLogin');
    };

    const handleVerifierClick = () => {
        localStorage.setItem('selectedOption', 'Verifier');
        navigate('/verifierLogin');
    };

    const handleStarteKYC = () => {
        navigate('/customerPage');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="fixed top-0 left-0 right-0 w-full z-50 bg-primary-color text-white p-4 py-8 flex justify-between items-center px-6 md:px-40 shadow-sm shadow-gray-200">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
                <div className="rounded-full w-8 h-8 flex items-center justify-center">
                    <img
                        src={verification}
                        alt="eKYC Icon"
                        className="w-8 h-8"
                    />
                </div>
                <div className="font-bold text-md md:text-2xl pb-1 cursor-pointer"
                    onClick={() => navigate('/home')}
                >
                    eKYC Connect
                </div>
            </div>

            {/* Menu Section */}
            <div className="md:hidden">
                {/* Hamburger Icon */}
                <button onClick={toggleMenu} className="text-white focus:outline-none">
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className={`flex-col md:flex-row space-y-4 md:space-y-0 bg-[#021b41] absolute top-16 right-0 w-48 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${menuOpen ? 'block' : 'hidden'} md:flex md:space-x-4 md:static md:bg-transparent md:p-0 md:w-auto md:rounded-none md:shadow-none`}>
                <button onClick={handleAgentClick} className="hover:underline text-md hover:text-hover-color w-full text-left md:w-auto md:text-center">
                    Agent
                </button>
                <button onClick={handleVerifierClick} className="hover:underline hover:text-hover-color w-full text-left md:w-auto md:text-center">
                    Verifier
                </button>
                <button onClick={handleStarteKYC} className="bg-text-color text-white font-medium py-2 px-6 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5 w-full md:w-auto">
                    Start eKYC
                </button>
            </div>
        </div>
    );
};

export default Topbar;
