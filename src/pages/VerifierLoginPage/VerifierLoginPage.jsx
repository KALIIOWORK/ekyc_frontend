import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/GlobalComponents/Topbar/Topbar';
import banner from '../../assets/banner.png';
import { BASE_URL } from '../../utils/url';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { login } from '../../context/state/auth/auth-slice';

export const VerifierLoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false);
    const [error, setError] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setWaiting(true);
            const response = await axios.post(`${BASE_URL}/user/userLogin`, { username, password });

            //console.log(response.data)
            if (response.data.isValidUser === false) {
                setMessage(response.data.message);
                setError(true);
                setWaiting(false);
                setUsername('');
                setPassword('');
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.data.message,
                });
            } else {
                dispatch(login({
                    token: response.data.token,
                    username: response.data.username,
                    user: response.data.user,
                    role: response.data.role
                }));
                navigate('/verificationQueuePage');
            }
        } catch (err) {
            setError(true);
            setWaiting(false);
            //console.error(err);
            setUsername('');
            setPassword('');
            setMessage(err.response?.data?.error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response?.data?.error || err.response?.data?.message || 'An error occurred during login. Please try again.',
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans-serif">
            <Topbar />
            <main className="flex flex-1 items-center justify-center bg-primary-color w-full px-10">
                {/* Container */}
                <div className="flex flex-col md:flex-row items-center justify-around w-full p-2 md:p-20">
                    {/* Title Section */}
                    <div className="flex-1 mb-8 md:mb-0 md:mr-8 text-center md:text-left">
                        <img src={banner} alt="Aadhaar" className="w-64 h-48 lg:w-112 lg:h-84 object-cover mx-auto float" />
                    </div>
                    {/* Form Section */}
                    <div className="flex-1 w-full flex-col items-center justify-center px-2 lg:px-36">
                        <h1 className="text-3xl md:text-4xl mb-6 font-bold text-white text-center">Verifier Login</h1>
                        <div className="space-y-3 flex flex-col items-center">
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-96 p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-color"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-96 p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-text-color"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                className="w-96 bg-text-color text-white text-sm font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
