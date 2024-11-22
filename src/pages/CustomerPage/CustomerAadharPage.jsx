import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import AadharCardImage from "../../assets/aadhar.png";
import { useCreateCustomer } from "../../utils/api-services/Customer";

export const CustomerAadharPage = () => {
  const navigate = useNavigate();
  const [aadharNumber, setAadharNumber] = useState("");
  const [uploadTypeFront, setUploadTypeFront] = useState(""); // Front image upload type
  const [uploadTypeBack, setUploadTypeBack] = useState(""); // Back image upload type
  const [aadharFrontImage, setAadharFrontImage] = useState("");
  const [aadharBackImage, setAadharBackImage] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [captureMode, setCaptureMode] = useState("front"); // Track which side to capture
  const videoRefFront = useRef(null); // Video ref for front
  const videoRefBack = useRef(null); // Video ref for back

  const [buttonText, setButtonText] = useState("Submit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate } = useCreateCustomer({
    onSuccess: (res) => {
      console.log("Customer created successfully");
      localStorage.setItem("role", "Customer");
      localStorage.setItem("eKYCId", res.data.eKYCId);
      localStorage.setItem("channelName", res.data.channelName);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("uid", res.data.uid);
      navigate("/startVideoCallPage");
    },
  });

  // Handle file input change for front and back
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
  const handleCapture = (side) => {
    const videoRef = side === "front" ? videoRefFront : videoRefBack;
    if (videoRef.current && cameraStream) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/png");

      if (side === "front") setAadharFrontImage(dataURL);
      else setAadharBackImage(dataURL);

      cameraStream.getTracks().forEach((track) => track.stop());
      setIsCameraOpen(false);
    } else {
      alert("Camera is not available or feed is not initialized.");
    }
  };

  useEffect(() => {
    if (isCameraOpen && cameraStream) {
      const videoRef = captureMode === "front" ? videoRefFront : videoRefBack;
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
        videoRef.current
          .play()
          .catch((err) => console.error("Error playing video stream:", err));
      }
    }
  }, [cameraStream, captureMode, isCameraOpen]);

  // Start the camera feed for front and back
  const startCamera = async (side) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCaptureMode(side); // Track capture mode (front or back)
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Error accessing the camera. Please check your permissions.");
    }
  };

  const handleUploadTypeChange = (e, side) => {
    const value = e.target.value;
    if (side === "front") {
      setUploadTypeFront(value);
    } else {
      setUploadTypeBack(value);
    }

    if (value === "capture") {
      startCamera(side);
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
    setIsSubmitting(true);
    setButtonText("Creating New Customer...");
    console.log("Submitted Document Data:", {
      aadharNumber,
      aadharFrontImage,
      aadharBackImage,
    });
    localStorage.setItem("CustomerAadharDetails", JSON.stringify(documentData));

    // Retrieve all data from local storage
    const customerDetails = JSON.parse(localStorage.getItem("CustomerDetails"));
    const customerPancardDetails = JSON.parse(
      localStorage.getItem("CustomerPancardDetails")
    );
    const customerAadharDetails = JSON.parse(
      localStorage.getItem("CustomerAadharDetails")
    );
    const customerPhoto = localStorage.getItem("customerPhoto");

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
      const base64String = base64Image.split(",")[1];
      const mimeType = base64Image.split(",")[0].match(/:(.*?);/)[1];
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const file = new Blob([byteArray], { type: mimeType });
      formData.append(fieldName, file, fileName);
    };

    appendBase64ImageToFormData(
      customerPancardDetails.pancardImage,
      "pancardImage",
      "pancard.jpg"
    );
    appendBase64ImageToFormData(
      customerAadharDetails.aadharFrontImage,
      "aadharFrontImage",
      "aadhar_front.jpg"
    );
    appendBase64ImageToFormData(
      customerAadharDetails.aadharBackImage,
      "aadharBackImage",
      "aadhar_back.jpg"
    );
    appendBase64ImageToFormData(
      customerPhoto,
      "customerPhoto",
      "customerPhoto.jpg"
    );
    // Call the mutate function with the FormData
    mutate(formData);
    localStorage.removeItem("CustomerDetails");
    localStorage.removeItem("CustomerPancardDetails");
    localStorage.removeItem("CustomerAadharDetails");
    localStorage.removeItem("customerPhoto");

    // Navigate to the next page
    navigate("/startVideoCallPage");
  };

  useEffect(() => {
    // Cleanup when the component unmounts or when switching cameras
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // useEffect to initialize video streams once the video ref is available
  useEffect(() => {
    if (videoRefFront.current && videoRefBack.current) {
      if (cameraStream) {
        const videoRef = captureMode === "front" ? videoRefFront : videoRefBack;
        videoRef.current.srcObject = cameraStream;
        videoRef.current.play();
      }
    }
  }, [videoRefFront.current, videoRefBack.current, cameraStream, captureMode]);

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
              {/* Front Image Upload */}
              <label className="block text-white">Upload Front Image</label>
              <select
                onChange={(e) => handleUploadTypeChange(e, "front")}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Upload Option</option>
                <option value="upload">Upload from Device</option>
                <option value="capture">Capture from Camera</option>
              </select>

              {uploadTypeFront === "upload" && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "front")}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              )}

              {uploadTypeFront === "capture" &&
                isCameraOpen &&
                captureMode === "front" && (
                  <div className="flex flex-col items-center">
                    <video
                      ref={videoRefFront}
                      width="100%"
                      height="100%"
                      className="object-cover rounded-md"
                    ></video>
                    <button
                      type="button"
                      onClick={() => handleCapture("front")}
                      className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-md"
                    >
                      Capture Front Image
                    </button>
                  </div>
                )}

              {/* Back Image Upload */}
              <label className="block text-white">Upload Back Image</label>
              <select
                onChange={(e) => handleUploadTypeChange(e, "back")}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Upload Option</option>
                <option value="upload">Upload from Device</option>
                <option value="capture">Capture from Camera</option>
              </select>

              {uploadTypeBack === "upload" && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "back")}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              )}

              {uploadTypeBack === "capture" &&
                isCameraOpen &&
                captureMode === "back" && (
                  <div className="flex flex-col items-center">
                    <video
                      ref={videoRefBack}
                      width="100%"
                      height="100%"
                      className="object-cover rounded-md"
                    ></video>
                    <button
                      type="button"
                      onClick={() => handleCapture("back")}
                      className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-md"
                    >
                      Capture Back Image
                    </button>
                  </div>
                )}

              <div className="flex flex-col md:flex-row md:space-x-4">
                {aadharFrontImage && (
                  <div className="mt-3 md:mt-0">
                    <img
                      src={aadharFrontImage}
                      alt="Aadhar Front"
                      className="w-full h-48 object-contain rounded-md" // Adjusted height for a rectangular shape
                    />
                  </div>
                )}
                {aadharBackImage && (
                  <div className="mt-3 md:mt-0">
                    <img
                      src={aadharBackImage}
                      alt="Aadhar Back"
                      className="w-full h-48 object-contain rounded-md" // Adjusted height for a rectangular shape
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md"
              disabled={isSubmitting}
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
