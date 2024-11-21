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
                <div className="w-full bg-white shadow-lg rounded-lg p-6">
                    <table className="w-full border-collapse border border-[#021b41]">
                        <thead>
                            <tr>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">SL No. </th>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Name</th>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Verification Status</th>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Documents</th>
                                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {noCustomersMessage ? (
                                <tr>
                                    <td colSpan="4" className="border border-primary-color px-4 py-2 text-gray-800 text-center">
                                        {noCustomersMessage}
                                    </td>
                                </tr>

                            ) : (
                                customers.map((customer, index) => (
                                    <tr key={customer} className="hover:bg-gray-100">
                                        <td className="border border-primary-color px-4 py-2 text-gray-800">{index + 1}</td>
                                        <td className="border border-primary-color px-4 py-2 text-gray-800">{customer.fullName}</td>
                                        <td className={`border border-primary-color px-4 py-2 ${getStatusColor(customer.verificationStatus)}`}>
                                            {customer.verificationStatus}
                                        </td>
                                        <td
                                            onClick={() => navigate(`/VerifyCustomerPage/${customer._id}`)}
                                            className="border border-primary-color px-4 py-2 text-primary-color  underline"
                                        >
                                            view kyc
                                        </td>
                                        <td className="border border-primary-color px-4 py-2 text-gray-800">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="bg-green-500 text-white px-2 py-0.5 rounded"
                                                        onClick={() => handleAccept(customer._id)}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-2 py-0.5 rounded"
                                                        onClick={() => handleReject(customer._id)}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Add a comment"
                                                    className="border border-gray-300 rounded px-2 py-1"
                                                    value={comments[customer._id] || ''}
                                                    onChange={(e) => handleCommentChange(customer._id, e.target.value)}
                                                />
                                            </div>
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