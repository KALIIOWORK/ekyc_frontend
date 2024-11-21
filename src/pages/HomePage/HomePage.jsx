import React from 'react';
import Topbar from '../../components/GlobalComponents/Topbar/Topbar';
import MainContent from './MainContent';
import { CustomerQueuePage } from '../CustomerQueuePage/CustomerQueuePage';
import { HomeContent } from './HomeContent';

export const HomePage = () => {

    return (
        <div className='flex flex-col min-h-screen items-center justify-center font-sans-serif '>
            <Topbar />
            <main className='flex flex-1 flex-col items-center justify-center bg-primary-color w-full'>
                <HomeContent />
            </main>
            {/* <footer className='bg-[#021b41] text-white text-center py-4 w-full '>
                eKYC Connect
            </footer> */}
        </div>
    );
};