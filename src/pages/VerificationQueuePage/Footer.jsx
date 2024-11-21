import React from 'react';

const Footer = () => {
  return (
    <footer className="flex justify-between items-center p-4 bg-primary-color shadow mt-2 text-xs sm:text-sm text-white">
      <p>© 2023 Video eKYC App All Rights Reserved</p>
      <div className="flex gap-4">
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Contact Support</a>
      </div>
    </footer>
  );
};

export default Footer;
