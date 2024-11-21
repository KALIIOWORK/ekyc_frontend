import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export const CustomerOTPPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-primary-color">
            <Header />
            <div className="flex flex-col items-center justify-center py-6 px-8">
                <div className="w-full p-2 flex justify-center items-center flex-col">
                    <span className="text-sm text-white block text-center mb-6">
                        Enter the received OTP from your registered mobile number
                    </span>
                    <form className="space-y-5 w-3/4 md:w-1/4">
                        <div className="flex flex-col items-start">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                required
                            />
                            <span className="text-xs text-white mb-2 block text-center">
                                Resend in 00:30 seconds
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="bg-text-color text-white text-lg  py-2 w-full rounded-md transition duration-200 ease-in-out transform hover:bg-text-color hover:-translate-y-0.5"
                            onClick={() => navigate("/customerDocsPage")}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}