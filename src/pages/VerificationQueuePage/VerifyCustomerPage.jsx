import React, { useState } from 'react';
import Header from './Header';
import { useGetUserByUsername } from '../../utils/api-services/User';
import { useGeteKYCById } from '../../utils/api-services/eKYC';
import { useParams } from 'react-router-dom';

export const VerifyCustomerPage = () => {
    const username = localStorage.getItem('username');
    const [verifier, setVerifier] = useState('');
    const [customerDetails, setCustomerDetails] = useState({});
    const [noCustomersMessage, setNoCustomersMessage] = useState('');
    const { customerId } = useParams();
    const id = customerId;

    const { isLoading } = useGetUserByUsername(username, {
        onSuccess: (res) => {
            setVerifier(res.data.user);
        }
    });



    const { isLoadingCustomer, isError, data } = useGeteKYCById(id, {
        onSuccess: (res) => {
            if (res.data.status) {
                setCustomerDetails(res.data.eKYC);
                setNoCustomersMessage('');
            }
            else {
                setCustomerDetails({});
                setNoCustomersMessage(res.data.message);
            }
        }
    });

    const specificFields = ["title", "fullName", "DOB", "mobileNumber", "email", "aadharNumber", "pancardNumber"];

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
                            <span>{customerDetails[key] || "N/A"}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Section */}
            <div className="p-8">
                <h3 className="text-xl font-bold text-center mb-2">Video KYC</h3>
                <div className="flex justify-center items-center">
                    {customerDetails.ekycRecording ? (
                        <video controls width="200" height="200">
                            <source src={customerDetails.ekycRecording} type="video/mp4" />
                        </video>
                        // <video
                        //     src={customerDetails.ekycRecording}
                        //     controls
                        //     className="w-full max-w-md border-2 border-white rounded-lg shadow-lg"
                        // ></video>
                    ) : (
                        <p className="text-center text-red-500">No eKYC recording available</p>
                    )}
                </div>
            </div>

        </div>
    );
};
