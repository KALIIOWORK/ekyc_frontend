import React from 'react';
import verification from '../../assets/verification.png';

export const Loader = () => {
  return (
    <div className="fixed inset-0 z-30 bg-primary-color bg-opacity-20 flex justify-center items-center">
      <div className="relative flex justify-center items-center w-20 h-20">
        <div className="absolute border-4 border-yellow-400 rounded-full animate-ripple"></div>
        <div className="absolute border-4 border-yellow-400 rounded-full animate-ripple delay-500"></div>
        <div className="absolute border-4 border-yellow-400 rounded-full animate-ripple delay-1000"></div>
        <span className="relative text-red-500 text-4xl font-medium">
          <img src={verification} alt="Verification Icon" />
        </span>
      </div>
    </div>
  );
};
