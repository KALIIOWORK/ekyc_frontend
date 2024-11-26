import { useState, useEffect } from 'react';
import Basics from '../../components/VideoCall/Basics';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useToggleIsJoined } from '../../utils/api-services/eKYC';

export const VideoCallPage = () => {
    const [joined, setJoined] = useState(true);
    const [selectedOption, setSelectedOption] = useState('');
    const navigate = useNavigate();
    const { customerId } = useParams();
    console.log("eKYC ID:", customerId);

    const { mutate } = useToggleIsJoined({
        onSuccess: (res) => {
            console.log(res);
        }
    });

    // Retrieve selectedOption from localStorage
    useEffect(() => {
        const role = localStorage.getItem('role');
        setSelectedOption(role);
    }, []);

    useEffect(() => {
        const handleUnload = () => {
            // Call API to toggle isJoined to false
            mutate({ isJoined: false, eKYCId: customerId, isMissed: true });
        };

        // Add event listener for browser/tab close or refresh
        window.addEventListener('beforeunload', handleUnload);

        // Cleanup: Remove event listener when component unmounts
        return () => {
            handleUnload(); // Ensure API call happens on component unmount
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [mutate, customerId]);



    return (
        <div className="bg-primary-color flex flex-col lg:flex-row justify-around space-evenly  min-h-screen p-2 md:p-6 lg:p-5 overflow-y-auto">
            {/* Video Section */}
            <div className="flex flex-col justify-center items-center p-4 rounded-lg shadow-lg w-full lg:w-2/3 max-w-4xl bg-white">
                <Basics eKYCId={customerId} />
                {/* Only display the buttons if selectedOption is not 'Customer' */}
                {/* {selectedOption !== 'Customer' && (
                    <div className="mt-4 space-x-4 flex flex-wrap justify-center">
                        <button
                            onClick={handleMuteClick}
                            className="bg-red-500 text-white py-2 px-4 rounded-md mb-2 sm:mb-0 sm:mr-4 hover:bg-red-600 transition-colors"
                        >
                            Mute
                        </button>
                        <button
                            onClick={handleEndCall}
                            className="bg-blue-500 text-white py-2 px-4 rounded-md mb-2 sm:mb-0 sm:mr-4 hover:bg-blue-600 transition-colors"
                        >
                            End Call
                        </button>
                    </div>
                )} */}
            </div>

            {/* Sidebar Section */}
            {selectedOption !== 'Customer' && (
                <div className="p-4 lg:p-6 rounded-lg shadow-lg w-full lg:w-1/3 space-y-6 mt-8 lg:mt-0 bg-white ">
                    {/* Customer Documents */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Customer Documents</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 p-2 bg-gray-200 rounded-lg shadow-md">
                                <img
                                    src="https://via.placeholder.com/100x60"
                                    alt="Aadhaar Card"
                                    className="w-16 lg:w-20 rounded-lg"
                                />
                                <span className="text-gray-900">Aadhaar Card</span>
                            </div>
                            <div className="flex items-center space-x-4 p-2 bg-gray-200 rounded-lg shadow-md">
                                <img
                                    src="https://via.placeholder.com/100x60"
                                    alt="PAN Card"
                                    className="w-16 lg:w-20 rounded-lg"
                                />
                                <span className="text-gray-900">PAN Card</span>
                            </div>
                            <div className="flex items-center space-x-4 p-2 bg-gray-200 rounded-lg shadow-md">
                                <img
                                    src="https://via.placeholder.com/100x60"
                                    alt="Photo"
                                    className="w-16 lg:w-20 rounded-lg"
                                />
                                <span className="text-gray-900">Photo</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
                        <p><strong>Name:</strong> John Smith</p>
                        <p><strong>Email:</strong> <a href="mailto:john.smith@example.com" className="text-blue-500">john.smith@example.com</a></p>
                        <p><strong>Phone:</strong> +1 234 567 890</p>
                        <p><strong>DOB:</strong> 1985-10-15</p>
                    </div>
                </div>
            )}
        </div>
    );
};
