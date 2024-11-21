import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { Menu, X } from 'react-feather'; // For hamburger and close icons
import verification from '../../assets/verification.png';

const Header = () => {
    const navigate = useNavigate();


    return (
        <header className="flex justify-between items-center px-2 md:px-8 py-6 bg-primary-color shadow-sm shadow-gray-200">
            <div className='flex flex-row items-center space-x-4'>
                <div className="rounded-full w-8 h-8 flex items-center justify-center">
                    <img
                        src={verification}
                        alt="eKYC Icon"
                        className="w-8 h-8"
                    />
                </div>
                <h1
                    className="text-lg sm:text-2xl font-semibold text-white cursor-pointer"
                    onClick={() => navigate('/home')}
                >Video eKYC</h1>
            </div>
        </header>
    );
};

export default Header;