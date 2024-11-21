// MainContent.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';



const MainContent = () => {
    const navigate = useNavigate();

    const handleGoToCustomerPage = () => {
        navigate('/waitingRoom');
    };

    return (

        <div className="flex flex-col">
            <div className='flex flex-row items-center justify-between mb-6'>
                <h1 className="text-lg sm:text-2xl font-bold">Upload Aadhar and PAN Card Images</h1>
                <button className="bg-green-500 text-white px-2 sm:px-4 py-2 rounded-md">Ready for video KYC</button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Left Section */}
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Aadhar Card Image"
                        className="w-full p-2 rounded-md border-gray-300"
                    />
                    <input
                        type="text"
                        placeholder="Proceed"
                        className="w-full p-2 rounded-md border-gray-300"
                    />
                    <input
                        type="text"
                        placeholder="Video KYC"
                        className="w-full p-2 rounded-md border-gray-300"
                    />
                    <select className="w-full p-2 rounded-md border-gray-300">
                        <option>Waiting Room</option>
                        <option>Room 1</option>
                    </select>

                </div>

                {/* Right Section */}
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="PAN Card Image"
                        className="w-full p-2 rounded-md border-gray-300"
                    />
                    <input
                        type="text"
                        placeholder="Wait in Lobby"
                        className="w-full p-2 rounded-md border-gray-300"
                    />
                    <input
                        type="text"
                        placeholder="Status"
                        className="w-full p-2 rounded-md border-gray-300"
                    />
                </div>

            </div>
            <div className='flex flex-row items-center w-full space-x-4 mb-3'>
                <h1 className="text-sm sm:text-lg font-bold whitespace-nowrap">Agent Assistance</h1>
                <input
                    type="text"
                    placeholder="Agent Assistance"
                    className="p-2 flex-grow rounded-md border-gray-300"
                />
            </div>

            <table className="w-full border mb-8">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">End Call</th>
                        <th className="border p-2">Customer</th>
                        <th className="border p-2">Rating</th>
                        <th className="border p-2">Comment</th>
                        <th className="border p-2">Submit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border p-2 text-center">👍</td>
                        <td className="border p-2">
                            <input
                                type="text"
                                placeholder="Feedback Form"
                                className="w-full p-2 rounded-md border-gray-300"
                            />
                        </td>
                        <td className="border p-2">
                            <input
                                type="text"
                                placeholder="5 stars"
                                className="w-full p-2 rounded-md border-gray-300"
                            />
                        </td>
                        <td className="border p-2">
                            <input
                                type="text"
                                placeholder="Great Service"
                                className="w-full p-2 rounded-md border-gray-300"
                            />
                        </td>
                        <td className="border p-2 text-center">Excellent</td>
                    </tr>
                    {/* Additional rows can be added here */}
                </tbody>
            </table>

            <div className="flex justify-end space-x-4">
                <button onClick={handleGoToCustomerPage} className="bg-green-500 text-white px-4 py-2 rounded-md">Ready for eKyc</button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded-md">Close</button>
            </div>
        </div>
    );
};

export default MainContent;
