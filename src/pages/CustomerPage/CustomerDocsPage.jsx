import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Pancard from "../../assets/pancardImg.jpeg";

export const CustomerDocsPage = () => {
    const navigate = useNavigate();
    const [pancardNumber, setPanNumber] = useState("");
    const [uploadType, setUploadType] = useState("");
    const [pancardImage, setImage] = useState(null);
    const videoRef = useRef(null); // Reference to video element
    const [isCameraOpen, setIsCameraOpen] = useState(false); // Track if camera is opened
    const [cameraStream, setCameraStream] = useState(null); // To store camera stream

    // Handle file input change for device upload
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Capture pancardImage from the video feed
    const handleCapture = () => {
        if (videoRef.current && cameraStream) {
            // Create canvas and draw the video frame
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext("2d");
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // Convert canvas to pancardImage and set it
            const dataURL = canvas.toDataURL("pancardImage/png");
            setImage(dataURL);

            // Stop the camera stream after capturing
            cameraStream.getTracks().forEach((track) => track.stop());
            setIsCameraOpen(false);
        } else {
            alert("Camera is not available or feed is not initialized.");
        }
    };

    // Start the camera feed when 'Capture from Camera' is selected
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraStream(stream); // Save the stream to stop later
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                // Debugging: Check if stream is successfully attached
                videoRef.current.onloadedmetadata = () => {
                    console.log("Camera feed started successfully");
                };
            }
            setIsCameraOpen(true); // Camera opened
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Error accessing the camera. Please check your permissions.");
        }
    };

    const handleUploadTypeChange = (e) => {
        setUploadType(e.target.value);
        if (e.target.value === "capture") {
            startCamera(); // Start camera when 'Capture from Camera' is selected
        } else {
            // Stop the camera if not capturing
            if (cameraStream) {
                cameraStream.getTracks().forEach((track) => track.stop());
            }
            setIsCameraOpen(false);
        }
    };

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();
        const documentData = {
            pancardNumber,
            pancardImage,
        };
        localStorage.setItem('CustomerPancardDetails', JSON.stringify(documentData));
        console.log("Submitted Document Data:", documentData);
        navigate("/customerAadharPage");
    };

    useEffect(() => {
        // Cleanup camera on component unmount
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [cameraStream]);

    return (
        <div className="flex flex-col min-h-screen bg-primary-color">
            <Header />

            <div className="flex flex-col items-center justify-center px-10 pt-6">
                <div className="w-full max-w-md md:max-w-xl space-y-2">
                    <div className="flex flex-col items-center justify-center px-10 pb-2">
                        <h2 className="text-xl font-semibold mb-3 text-center text-white">
                            You have selected PAN Card as Officially Valid Document
                        </h2>
                        <div className="w-1/2 flex items-center justify-start bg-gray-300 rounded-full p-2 mb-2">
                            <img
                                src={Pancard}
                                alt="PAN Card"
                                className="w-8 h-8 object-cover rounded-md mr-4 md:mr-8"
                            />
                            <span className="text-md text-white ml-4">
                                PAN Card
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* PAN Number Input */}
                        <input
                            type="number"
                            value={pancardNumber}
                            onChange={(e) => setPanNumber(e.target.value)}
                            placeholder="Enter PAN card No"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                        />

                        {/* Upload Options */}
                        <div className="space-y-2">
                            <label className="block text-white">Upload Front Image</label>
                            <select
                                onChange={handleUploadTypeChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Upload Options</option>
                                <option value="upload">Upload from Device</option>
                                <option value="capture">Capture from Camera</option>
                            </select>

                            {uploadType === "upload" && (
                                <input
                                    type="file"
                                    accept="pancardImage/*"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                />
                            )}

                            {uploadType === "capture" && isCameraOpen && (
                                <div className="flex flex-col items-center justify-center">
                                    {/* Video Element for Live Feed */}
                                    <div className="relative w-80 h-60 bg-gray-200">
                                        <video
                                            ref={videoRef}
                                            width="100%"
                                            height="100%"
                                            className="object-cover rounded-md"
                                            autoPlay
                                        ></video>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCapture}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3"
                                    >
                                        Capture Image
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Image Preview or Placeholder */}
                        <div className="mt-4 flex items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-md">
                            {!pancardImage && !isCameraOpen ? (
                                <span className="text-white">No pancardImage selected</span>
                            ) : pancardImage ? (
                                <img
                                    src={pancardImage}
                                    alt="Captured"
                                    className="w-full h-40 object-cover rounded-md"
                                />
                            ) : (
                                <span className="text-white">Capturing...</span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-text-color text-white text-lg  py-2 w-full rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerDocsPage;
