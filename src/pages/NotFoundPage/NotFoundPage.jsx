import React from "react";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-color text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-lg text-white mb-8">Oops! The page you’re looking for doesn’t exist.</p>
            <button
                onClick={() => navigate("/")}
                className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            >
                Go to Homepage
            </button>
        </div>
    );
};
