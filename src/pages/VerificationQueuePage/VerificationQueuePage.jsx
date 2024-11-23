import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useGetListOfeKYC } from '../../utils/api-services/eKYC';
import { useGetUserByUsername } from '../../utils/api-services/User';

export const VerificationQueuePage = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [verifier, setVerifier] = useState('');
    const [customers, setCustomers] = useState([]);
    const [noCustomersMessage, setNoCustomersMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [filters, setFilters] = useState({
        isVerified: isVerified,
    });
    const [comments, setComments] = useState({});

    const handleCommentChange = (id, value) => {
        setComments(prevComments => ({
            ...prevComments,
            [id]: value
        }));
    };

    const handleAccept = (id) => {
        console.log(`Accepted: ${id}, Comment: ${comments[id]}`);
        // Add your accept logic here
    };

    const handleReject = (id) => {
        console.log(`Rejected: ${id}, Comment: ${comments[id]}`);
        // Add your reject logic here
    };

    const { isLoading } = useGetUserByUsername(username, {
        onSuccess: (res) => {
            setVerifier(res.data.user);
        }
    });

    const { isLoadingCustomers, isError, data } = useGetListOfeKYC(filters, {
        onSuccess: (res) => {
            if (res.data.status) {
                setCustomers(res.data.eKYCs);
                setNoCustomersMessage('');
            }
            else {
                setCustomers([]);
                setNoCustomersMessage(res.data.message);
            }
        }
    });

    // Function to determine the status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Verified':
                return 'text-green-600 font-semibold'; // Green for verified
            case 'Pending':
                return 'text-yellow-500 font-semibold'; // Yellow for pending
            case 'Rejected':
                return 'text-red-600 font-semibold'; // Red for rejected
            default:
                return 'text-gray-600'; // Default color
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-primary-color">
            {/* Header */}
            <Header verifier={verifier} />

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center py-8 px-10 shadow-sm shadow-gray-950">
                <h2 className="text-2xl font-bold text-white mb-6">Customer Verification Queue</h2>
                <div className="w-full bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
                    <table className="w-full border-collapse border border-[#021b41]">
                        <thead>
                            <tr>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Customer</th>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Email</th>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Mobile Number</th>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Verification Status</th>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Documents</th>
                            </tr>
                        </thead>
                        <tbody>
                            {noCustomersMessage ? (
                                <tr>
                                    <td colSpan="5" className="border border-primary-color px-4 py-2 text-gray-800 text-center">
                                        {noCustomersMessage}
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-gray-100">
                                        <td className="border border-primary-color px-4 py-2 text-gray-800 text-sm">
                                            <div className="flex items-center">
                                                <img
                                                    src={customer.customerPhoto}
                                                    alt="Profile"
                                                    className="w-6 h-6 rounded-full"
                                                />
                                                <span className="ml-2 ">{customer.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="border border-primary-color px-4 py-2 text-gray-800">{customer.email}</td>
                                        <td className="border border-primary-color px-4 py-2 text-gray-800">
                                            +91(IN) {customer.mobileNumber}
                                        </td>
                                        <td
                                            className={`border border-primary-color px-4 py-2 ${getStatusColor(
                                                customer.verificationStatus
                                            )}`}
                                        >
                                            {customer.verificationStatus}
                                        </td>
                                        <td className="border border-primary-color px-4 py-2">
                                            <button
                                                onClick={() => navigate(`/VerifyCustomerPage/${customer._id}`)}
                                                className="bg-text-color text-white px-2 py-1 rounded transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                                            >
                                                View KYC
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>

    );
};