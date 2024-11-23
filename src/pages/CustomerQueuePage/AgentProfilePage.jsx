import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserByUsername } from '../../utils/api-services/User';
import Header from './Header';
import Footer from './Footer';

export const AgentProfilePage = () => {
    const [agent, setAgent] = useState({});
    const username = localStorage.getItem('username');

    const { isLoading } = useGetUserByUsername(username, {
        onSuccess: (res) => {
            setAgent(res.data.user);
        },
        onError: () => {
            setAgent(null);
        },
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-primary-color text-white">
                <p>Loading...</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="flex flex-col min-h-screen bg-primary-color text-white">
            {/* Header */}
            <Header agent={agent} />

            {/* Profile Section */}
            <div className="flex-grow flex flex-col items-center py-8 px-4">
                {agent ? (
                    <div className="w-full p-8 space-y-4">
                        <h2 className="text-2xl font-bold text-center mb-4">Agent Profile Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "username",
                                "fullName",
                                "role",
                                "DOB",
                                "email",
                                "gender",
                                "mobileNumber",
                            ].map((key) => (
                                <div
                                    key={key}
                                    className="flex justify-between items-center bg-white p-2 rounded-md shadow-md text-black"
                                >
                                    <span className="font-semibold capitalize">
                                        {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                                    </span>
                                    <span>
                                        {key === "DOB" ? formatDate(agent[key]) : agent[key] || "N/A"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-red-500 font-semibold">Unable to load agent details.</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};
