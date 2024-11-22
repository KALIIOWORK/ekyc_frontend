import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

export const CustomerPhoto = () => {
    const [photo, setPhoto] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    const handlePhotoClick = async () => {
        try {
            // Access the user's camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = videoRef.current;
            video.srcObject = stream;
            video.play();
        } catch (err) {
            console.error('Error accessing the camera: ', err);
            alert('Unable to access the camera. Please ensure permissions are granted.');
        }
    };

    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
            const context = canvas.getContext('2d');
            // Draw the current frame from the video to the canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/png'); // Convert to base64 image
            setPhoto(imageData);
            localStorage.setItem('customerPhoto', imageData); // Save photo to local storage
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageData = reader.result;
                setPhoto(imageData);
                localStorage.setItem('customerPhoto', imageData); // Save uploaded photo to local storage
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProceed = () => {
        // Navigate to the next page
        navigate(`/customerOTPPage`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-primary-color">
            <Header />
            <div className="flex flex-col items-center justify-center py-6 px-8 pt-24">
                <div className="w-full md:w-1/2 p-2 flex justify-center items-center flex-col">
                    <span className="text-md text-white block text-center mb-6">
                        Click a photo or upload one to proceed
                    </span>
                    <div className="photo-container relative">
                        {photo ? (
                            <img src={photo} alt="Captured" className="photo w-full h-auto mb-4" />
                        ) : (
                            <video ref={videoRef} className="video w-full h-auto mb-4" />
                        )}
                        <canvas ref={canvasRef} className="hidden" width="640" height="480"></canvas>
                    </div>
                    <div className="flex flex-row flex-wrap justify-center">
                        <button
                            onClick={handlePhotoClick}
                            className="bg-text-color text-black py-2 px-4 mr-2 mt-4 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                        >
                            Open Camera
                        </button>
                        <button
                            onClick={capturePhoto}
                            className="bg-text-color text-black py-2 px-4 mr-2 mt-4 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                        >
                            Capture Photo
                        </button>
                        <label className="bg-text-color text-black py-2 px-4 mr-2 mt-4 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5 cursor-pointer">
                            Upload Photo
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </label>
                        <button
                            onClick={handleProceed}
                            className="bg-text-color text-black py-2 px-4 mt-4 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
