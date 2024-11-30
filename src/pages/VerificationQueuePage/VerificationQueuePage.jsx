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
        verificationStatus: 'Pending'
    });
    const [comments, setComments] = useState({});

    const handleStatusFilter = (status) => {
        setFilters({
            verificationStatus: status
        });
    };

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
                let sortedCustomers = res.data.eKYCs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setCustomers(sortedCustomers);
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
                {/* Filter Section */}
                <div className="mb-4 w-full bg-white shadow-lg rounded-lg p-2 flex justify-between">
                    {/* Filter for Pending */}
                    <div
                        onClick={() => handleStatusFilter('Pending')}
                        className={`cursor-pointer w-full text-center transition-all duration-300 ease-in-out ${filters.verificationStatus === 'Pending'
                            ? 'bg-yellow-500 text-white shadow-md'
                            : 'bg-gray-300 text-black'
                            }`}
                    >
                        Pending
                    </div>

                    {/* Filter for Verified */}
                    <div
                        onClick={() => handleStatusFilter('Verified')}
                        className={`cursor-pointer w-full text-center transition-all duration-300 ease-in-out ${filters.verificationStatus === 'Verified'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-gray-300 text-black'
                            }`}
                    >
                        Verified
                    </div>

                    {/* Filter for Rejected */}
                    <div
                        onClick={() => handleStatusFilter('Rejected')}
                        className={`cursor-pointer w-full text-center transition-all duration-300 ease-in-out ${filters.verificationStatus === 'Rejected'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-gray-300 text-black'
                            }`}
                    >
                        Rejected
                    </div>
                </div>

                <div className="w-full bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
                    <table className="w-full border-collapse border border-[#021b41]">
                        <thead>
                            <tr>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Customer</th>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Agent Name</th>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">ekycTime</th>
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
                                        <td className="border border-primary-color px-4 py-2 text-gray-800">
                                            {customer.agentName}
                                        </td>
                                        <td className="border border-primary-color px-4 py-2 text-gray-800">{new Date(customer.createdAt).toLocaleDateString()} {new Date(customer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>

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