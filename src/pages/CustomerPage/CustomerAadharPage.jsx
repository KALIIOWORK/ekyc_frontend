import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import AadharCardImage from "../../assets/aadhar.png";
import { useCreateCustomer } from "../../utils/api-services/Customer";

export const CustomerAadharPage = () => {
    const navigate = useNavigate();
    const [aadharNumber, setAadharNumber] = useState("");
    const [uploadType, setUploadType] = useState("");
    const [aadharFrontImage, setAadharFrontImage] = useState("");
    const [aadharBackImage, setAadharBackImage] = useState("");
    const videoRef = useRef(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [captureMode, setCaptureMode] = useState("front"); // Track which side to capture

    const { mutate } = useCreateCustomer({
        onSuccess: (res) => {
            console.log("Customer created successfully");
            localStorage.setItem("role", "Customer");
            localStorage.setItem("eKYCId", res.data.eKYCId);
            navigate("/startVideoCallPage");
        },
    });

    // Handle file input change
    const handleFileChange = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === "front") setAadharFrontImage(reader.result);
                else setAadharBackImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Capture image from the video feed
    const handleCapture = () => {
        if (videoRef.current && cameraStream) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext("2d");
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL("image/png");

            if (captureMode === "front") setAadharFrontImage(dataURL);
            else setAadharBackImage(dataURL);

            cameraStream.getTracks().forEach((track) => track.stop());
            setIsCameraOpen(false);
        } else {
            alert("Camera is not available or feed is not initialized.");
        }
    };

    // Start the camera feed
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setIsCameraOpen(true);
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Error accessing the camera. Please check your permissions.");
        }
    };

    const handleUploadTypeChange = (e) => {
        setUploadType(e.target.value);
        if (e.target.value === "capture") {
            startCamera();
        } else {
            if (cameraStream) {
                cameraStream.getTracks().forEach((track) => track.stop());
            }
            setIsCameraOpen(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const documentData = {
            aadharNumber,
            aadharFrontImage,
            aadharBackImage,
        };
        console.log("Submitted Document Data:", {
            aadharNumber,
            aadharFrontImage,
            aadharBackImage,
        });
        localStorage.setItem('CustomerAadharDetails', JSON.stringify(documentData));

        // Retrieve all data from local storage
        const customerDetails = JSON.parse(localStorage.getItem('CustomerDetails'));
        const customerPancardDetails = JSON.parse(localStorage.getItem('CustomerPancardDetails'));
        const customerAadharDetails = JSON.parse(localStorage.getItem('CustomerAadharDetails'));

        // Combine all data
        const customerData = {
            ...customerDetails,
            ...customerPancardDetails,
            ...customerAadharDetails,
        };
        console.log(customerData);

        // Create FormData object
        const formData = new FormData();
        Object.entries(customerData).forEach(([key, value]) => {
            formData.append(key, value);
        });
        const appendBase64ImageToFormData = (base64Image, fieldName, fileName) => {
            const base64String = base64Image.split(',')[1];
            const mimeType = base64Image.split(',')[0].match(/:(.*?);/)[1];
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const file = new Blob([byteArray], { type: mimeType });
            formData.append(fieldName, file, fileName);
        };

        appendBase64ImageToFormData(customerPancardDetails.pancardImage, 'pancardImage', 'pancard.jpg');
        appendBase64ImageToFormData(customerAadharDetails.aadharFrontImage, 'aadharFrontImage', 'aadhar_front.jpg');
        appendBase64ImageToFormData(customerAadharDetails.aadharBackImage, 'aadharBackImage', 'aadhar_back.jpg');

        // Call the mutate function with the FormData
        mutate(formData);
        localStorage.removeItem('CustomerDetails')
        localStorage.removeItem('CustomerPancardDetails')
        localStorage.removeItem('CustomerAadharDetails')

        // Navigate to the next page
        //navigate("/startVideoCallPage");
    };

    useEffect(() => {
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
                    <h2 className="text-xl font-semibold mb-3 text-center text-white">
                        Upload Aadhaar Card Details
                    </h2>
                    <div className="flex items-center justify-center bg-gray-300 rounded-full p-2 mb-2">
                        <img
                            src={AadharCardImage}
                            alt="Aadhaar Card"
                            className="w-8 h-8 object-cover rounded-md mr-4"
                        />
                        <span className="text-md text-gray-500">Aadhaar Card</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="number"
                            value={aadharNumber}
                            onChange={(e) => setAadharNumber(e.target.value)}
                            placeholder="Enter Aadhaar Number"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                        />

                        <div className="space-y-4">
                            <label className="block text-white">Upload Front Image</label>
                            <select
                                onChange={handleUploadTypeChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Select Upload Option</option>
                                <option value="upload">Upload from Device</option>
                                <option value="capture">Capture from Camera</option>
                            </select>

                            {uploadType === "upload" && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, "front")}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, "back")}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    />
                                </>
                            )}

                            {uploadType === "capture" && isCameraOpen && (
                                <div className="flex flex-col items-center">
                                    <video
                                        ref={videoRef}
                                        width="100%"
                                        height="100%"
                                        className="object-cover rounded-md"
                                        autoPlay
                                    ></video>
                                    <div className="space-x-4 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCaptureMode("front");
                                                handleCapture();
                                            }}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Capture Front
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCaptureMode("back");
                                                handleCapture();
                                            }}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Capture Back
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 space-y-4">
                            <div>
                                <h4 className="text-white">Front Image Preview</h4>
                                {aadharFrontImage ? (
                                    <img
                                        src={aadharFrontImage}
                                        alt="Front"
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                ) : (
                                    <span className="text-gray-500">No front image selected</span>
                                )}
                            </div>
                            <div>
                                <h4 className="text-white">Back Image Preview</h4>
                                {aadharBackImage ? (
                                    <img
                                        src={aadharBackImage}
                                        alt="Back"
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                ) : (
                                    <span className="text-gray-500">No back image selected</span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-text-color text-white text-lg py-2 w-full rounded-full transition duration-200 hover:bg-hover-color"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};




