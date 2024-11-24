import React, { useState } from 'react';
import Header from './Header';
import { useGetUserByUsername } from '../../utils/api-services/User';
import { useGeteKYCById } from '../../utils/api-services/eKYC';
import { useParams } from 'react-router-dom';
import { useVerifyCustomer } from '../../utils/api-services/User';
import { useQueryClient } from "react-query";
import ImageModal from '../VideoCallPage/ImageModal';


export const VerifyCustomerPage = () => {
    const username = localStorage.getItem('username');
    const [verifier, setVerifier] = useState('');
    const [customerDetails, setCustomerDetails] = useState({});
    const [noCustomersMessage, setNoCustomersMessage] = useState('');
    const { customerId } = useParams();
    const id = customerId;
    const [verificationComments, setVerificationComments] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');
    const [body, setBody] = useState({});
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

    const { isLoading } = useGetUserByUsername(username, {
        onSuccess: (res) => {
            setVerifier(res.data.user);
        }
    });

    const { isLoadingCustomer, isError, data } = useGeteKYCById(id, {
        refetchOnWindowFocus: true,
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

    const { mutate } = useVerifyCustomer(body, {
        onSuccess: (res) => {
            queryClient.invalidateQueries(["geteKYCById", id]); // Ensure data is refetched
        },
    });

    const handleAction = (status) => {
        const updatedBody = {
            username: verifier.username,
            eKYCId: customerDetails._id,
            verificationStatus: status,
            verificationComments: verificationComments
        };
        //console.log("Submitting:", updatedBody);
        setBody(updatedBody); // Update body state
        mutate(updatedBody); // Pass updated body to mutate
        window.location.reload(); // Reload page to show updated data
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const specificFields = ["fullName", "DOB", "mobileNumber", "email", "aadharNumber", "pancardNumber"];
    const imageFields = [
        { label: 'Aadhar Front Image', key: 'aadharFrontImage' },
        { label: 'Aadhar Back Image', key: 'aadharBackImage' },
        { label: 'Pancard Image', key: 'pancardImage' },
        { label: 'Customer Photo', key: 'customerPhoto' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-primary-color text-white">
            {/* Header Section */}
            <Header verifier={verifier} />

            {/* Customer Details Section */}
            <div className="p-8 space-y-4">
                <h2 className="text-2xl font-bold text-center mb-4">Customer Verification Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specificFields.map((key) => (
                        <div
                            key={key}
                            className="flex justify-between items-center bg-white p-2 rounded-md shadow-md text-black"
                        >
                            <span className="font-semibold capitalize">
                                {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                            </span>
                            <span>{key === "DOB" ? formatDate(customerDetails[key]) : customerDetails[key] || "N/A"}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Images Section */}
            <div className="p-8 space-y-4">
                <h3 className="text-xl font-bold text-center mb-2">Customer Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {imageFields.map(({ label, key }) => (
                        <div key={key} className="flex flex-col items-center bg-white p-2 rounded-md shadow-md text-black">
                            <span className="font-semibold mb-2">{label}</span>
                            {customerDetails[key] ? (
                                <div className="w-60 h-40 relative">
                                    <img
                                        src={customerDetails[key]}
                                        alt={label}
                                        className="w-full h-full object-contain border rounded-md cursor-pointer"
                                        onClick={() => handleImageClick(customerDetails[key])} // Open modal on image click
                                    />
                                </div>
                            ) : (
                                <p className="text-red-500">No {label} available</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>


            {/* Image Modal */}
            {isModalOpen && (
                <ImageModal
                    isOpen={isModalOpen}
                    imageSrc={selectedImage}
                    onClose={handleCloseModal}
                />
            )}

            {/* Video Section */}
            <div className="p-8">
                <h3 className="text-xl font-bold text-center mb-2">Video KYC</h3>
                <div className="flex justify-center items-center">
                    {customerDetails.ekycRecording ? (
                        <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-[16/9] border rounded-lg overflow-hidden">
                            <video
                                controls
                                className="absolute top-0 left-0 w-full h-full object-cover"
                            >
                                <source src={customerDetails.ekycRecording} type="video/mp4" />
                            </video>
                        </div>
                    ) : (
                        <p className="text-center text-red-500">No eKYC recording available</p>
                    )}
                </div>
            </div>

            {/* Verification Section */}
            {/* Verification Section */}
            {customerDetails.verificationStatus === "Pending" ? (
                <div className="p-8 flex flex-col items-center justify-center w-full max-w-md mx-auto">
                    <h3 className="text-lg font-bold text-center mb-4">Approve/Reject Customer</h3>

                    {/* Comments Textarea */}
                    <textarea
                        className="w-full h-24 p-2 border rounded-md text-black text-sm mb-4"
                        placeholder="Add comments"
                        value={verificationComments}
                        onChange={(e) => setVerificationComments(e.target.value)}
                    />

                    {/* Button Container */}
                    <div className="flex justify-center space-x-4 w-full">
                        {/* Approve Button */}
                        <button
                            onClick={() => handleAction("Verified")}
                            className={`py-2 px-4 rounded-md mb-2 sm:mr-4 transition-colors ${verificationComments
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                }`}
                        >
                            Approve
                        </button>

                        {/* Reject Button */}
                        <button
                            onClick={() => handleAction("Rejected")}
                            className={`py-2 px-4 rounded-md mb-2 sm:mr-4 transition-colors ${verificationComments
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                }`}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ) : (
                isLoading || isLoadingCustomer ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    customerDetails.verificationStatus && (
                        <div className="p-8">
                            <h3 className="text-lg font-bold text-center mb-2">Verification Status</h3>
                            <div className="flex justify-center items-center">
                                <p className={`text-center text-lg ${customerDetails.verificationStatus === 'Verified'
                                    ? 'text-green-500'
                                    : customerDetails.verificationStatus === 'Rejected'
                                        ? 'text-red-500'
                                        : 'text-gray-500'
                                    }`}>
                                    {customerDetails.verificationStatus}
                                </p>
                            </div>
                        </div>
                    )
                )
            )}


        </div>
    );
};
