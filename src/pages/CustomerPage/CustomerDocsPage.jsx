import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Pancard from "../../assets/pancardImg.jpeg";

export const CustomerDocsPage = () => {
  const navigate = useNavigate();
  const [pancardNumber, setPanNumber] = useState("");
  const [uploadType, setUploadType] = useState("");
  const [pancardImage, setImage] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraOpen(true); // Ensure camera is flagged as active
    } catch (error) {
      console.error("Error accessing the camera:", error);
      alert(
        "Unable to access the camera. Please check permissions and ensure your device has a working camera."
      );
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setCameraStream(null);
    setIsCameraOpen(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");
      setImage(dataURL);
      stopCamera();
    }
  };

  const handleUploadTypeChange = (e) => {
    const selectedOption = e.target.value;
    setUploadType(selectedOption);

    if (selectedOption === "capture") {
      startCamera();
    } else {
      stopCamera();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pancardNumber || !pancardImage) {
      alert("Please fill in all the details");
      return;
    }

    if (pancardNumber.length !== 10) {
      alert("Please enter a valid PAN card number");
      return;
    }
    const documentData = {
      pancardNumber,
      pancardImage,
    };
    localStorage.setItem(
      "CustomerPancardDetails",
      JSON.stringify(documentData)
    );
    //console.log("Submitted Document Data:", documentData);
    navigate("/customerAadharPage");
  };

  // Effect to assign the stream to video element
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((error) => {
        console.error("Error starting video playback:", error);
      });
    }
  }, [cameraStream]);

  useEffect(() => {
    // Cleanup camera when the component unmounts or upload type changes
    return () => {
      stopCamera();
    };
  }, []);

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
              <span className="text-md text-white ml-4">PAN Card</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={pancardNumber}
              onChange={(e) => {
                if (/^[A-Z0-9]{0,10}$/.test(e.target.value)) {
                  setPanNumber(e.target.value); // Allow only alphanumeric and restrict to 10 characters
                }
              }}
              placeholder="Enter PAN card No"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />

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
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              )}

              {uploadType === "capture" && isCameraOpen && (
                <div className="flex flex-col items-center justify-center">
                  <video
                    ref={videoRef}
                    className="w-80 h-60 bg-black rounded-md"
                    autoPlay
                    playsInline
                  ></video>
                  <canvas ref={canvasRef} className="hidden"></canvas>
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

            <div className="mt-4 flex items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-md h-48">
              {pancardImage ? (
                <img
                  src={pancardImage}
                  alt="Captured or Uploaded"
                  className="w-full h-full object-contain rounded-md"
                />
              ) : (
                <span className="text-gray-500">No image selected</span> // Changed text color for better visibility
              )}
            </div>

            <button
              type="submit"
              className="bg-text-color text-white text-lg py-2 w-full rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
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
