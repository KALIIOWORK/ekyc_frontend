import { useState, useEffect } from 'react';
import AgentBasics from '../../components/VideoCall/AgentBasics';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useGeteKYCById } from '../../utils/api-services/eKYC';
import ImageModal from './ImageModal';

export const AgentVideoCallPage = () => {
    const [joined, setJoined] = useState(true);
    const [selectedOption, setSelectedOption] = useState('');
    const [customerDetails, setCustomerDetails] = useState({});
    const navigate = useNavigate();
    const { customerId } = useParams();
    const id = customerId;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedImage('');
    };

    // Retrieve selectedOption from localStorage
    useEffect(() => {
        const role = localStorage.getItem('role');
        setSelectedOption(role);
    }, []);

    const { isLoadingCustomer, isError, data } = useGeteKYCById(id, {
        onSuccess: (res) => {
            if (res.data.status) {
                setCustomerDetails(res.data.eKYC);
                setNoCustomersMessage('');
            } else {
                setCustomerDetails({});
                setNoCustomersMessage(res.data.message);
            }
        }
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };


    return (
        <div className="bg-primary-color flex flex-col lg:flex-row justify-around space-evenly  min-h-screen p-2 md:p-6 lg:p-5 overflow-y-auto">
            {/* Video Section */}
            <div className="flex flex-col justify-center items-center p-4 rounded-lg shadow-lg w-full lg:w-2/3 max-w-4xl bg-white">
                <AgentBasics eKYCId={customerId} />
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
            <div className="p-4 lg:p-6 rounded-lg shadow-lg w-full lg:w-1/3 space-y-6 mt-8 lg:mt-0 bg-white ">
                {/* Customer Documents */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Customer Documents</h2>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-2 bg-gray-200 rounded-lg shadow-md">
                            <img
                                src={customerDetails.aadharFrontImage}
                                alt="Aadhaar Front"
                                className="w-16 lg:w-20 rounded-lg cursor-pointer"
                                onClick={() => handleImageClick(customerDetails.aadharFrontImage)}
                            />
                            <span className="text-gray-900">Aadhaar Front Image</span>
                        </div>
                        <div className="flex items-center space-x-4 p-2 bg-gray-200 rounded-lg shadow-md">
                            <img
                                src={customerDetails.aadharBackImage}
                                alt="Aadhaar Back"
                                className="w-16 lg:w-20 rounded-lg cursor-pointer"
                                onClick={() => handleImageClick(customerDetails.aadharBackImage)}
                            />
                            <span className="text-gray-900">Aadhaar Back Image</span>
                        </div>
                        <div className="flex items-center space-x-4 p-2 bg-gray-200 rounded-lg shadow-md">
                            <img
                                src={customerDetails.pancardImage}
                                alt="Pancard"
                                className="w-16 lg:w-20 rounded-lg cursor-pointer"
                                onClick={() => handleImageClick(customerDetails.pancardImage)}
                            />
                            <span className="text-gray-900">PAN Card</span>
                        </div>
                        <div className="flex items-center space-x-4 p-2 bg-gray-200 rounded-lg shadow-md">
                            <img
                                src={customerDetails.customerPhoto}
                                alt="Photo"
                                className="w-16 lg:w-20 rounded-lg cursor-pointer"
                                onClick={() => handleImageClick(customerDetails.customerPhoto)}
                            />
                            <span className="text-gray-900">Customer Photo</span>
                        </div>
                    </div>
                </div>

                {/* Customer Details */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
                    <p><strong>Name: </strong>{customerDetails.fullName}</p>
                    <p><strong>Email: </strong>{customerDetails.email}</p>
                    <p><strong>Phone: </strong>+91(IN) {customerDetails.mobileNumber} </p>
                    <p><strong>DOB: </strong>{formatDate(customerDetails.DOB)}</p>
                </div>
            </div>
            <ImageModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                imageSrc={selectedImage}
            />
        </div>
    );
};
