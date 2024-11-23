import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export const CustomerPhoto = () => {
  const [photo, setPhoto] = useState(null); // Stores the captured photo
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Tracks camera state
  const videoRef = useRef(null); // Reference for the video element
  const cameraStreamRef = useRef(null); // Reference for the camera stream
  const navigate = useNavigate();

  useEffect(() => {
    if (isCameraOpen && videoRef.current && cameraStreamRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
      videoRef.current.play().catch((err) => {
        console.error("Error playing the video stream:", err);
      });
    }
  }, [isCameraOpen]);

  useEffect(() => {
    const savedData = localStorage.getItem("customerPhoto");
    if (savedData) {
      setPhoto(savedData);
    }
  }, []);

  // Starts the camera and shows the feed
  const handlePhotoClick = async () => {
    if (isCameraOpen) return; // Prevent reopening if already open
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStreamRef.current = stream;
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access the camera. Please check permissions.");
    }
  };

  // Captures the photo and stores it in localStorage
  const capturePhoto = () => {
    if (videoRef.current && cameraStreamRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL("image/png");
      setPhoto(dataURL);
      localStorage.setItem("customerPhoto", dataURL);

      // Stop the camera feed
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
      setIsCameraOpen(false);
    } else {
      alert(
        "Camera feed is not initialized. Please click 'Click Photo' first."
      );
    }
  };

  const handleProceed = () => {
    if (photo) {
      navigate(`/customerOTPPage`);
    } else {
      alert("Please capture a photo before proceeding.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary-color">
      <Header />
      <div className="flex flex-col items-center justify-center py-6 px-8 pt-24">
        <div className="w-full md:w-1/2 p-2 flex justify-center items-center flex-col">
          <span className="text-md text-white block text-center mb-6">
            Click a photo or upload one to proceed
          </span>
          <div className="relative w-[15rem] h-[15rem] sm:w-[20rem] sm:h-[20rem] md:w-[25rem] md:h-[25rem] lg:w-[30rem] lg:h-[30rem] border-4 border-gray-300 overflow-hidden rounded-full">
    {isCameraOpen ? (
        <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-full"
            autoPlay
            playsInline
        ></video>
    ) : photo ? (
        <img
            src={photo}
            alt="Customer Photo"
            className="w-full h-full object-cover rounded-full"
        />
    ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 rounded-full">
            No Photo
        </div>
    )}
</div>
          <div className="flex flex-row mt-6">
            {!isCameraOpen && (
              <button
                onClick={handlePhotoClick}
                className="bg-text-color text-black py-2 px-4 mr-4 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
              >
                Open Camera
              </button>
            )}
            {isCameraOpen && (
              <button
                onClick={capturePhoto}
                className="bg-text-color text-black py-2 px-4 mr-4 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
              >
                Capture Photo
              </button>
            )}
            {/* <button
                            onClick={capturePhoto}
                            className="bg-text-color text-black py-2 px-4 mr-2 mt-4 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                        >
                            Capture Photo
                        </button> */}
            {/* <label className="bg-text-color text-black py-2 px-4 mr-2 mt-4 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5 cursor-pointer">
                            Upload Photo
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </label> */}
            <button
              onClick={handleProceed}
              className="bg-text-color text-black py-2 px-4 rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
