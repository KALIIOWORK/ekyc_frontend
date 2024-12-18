import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export const CustomerPage = () => {
    const navigate = useNavigate();
    const [add, setAdd] = useState('')

    const [formData, setFormData] = useState({
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        DOB: "",
        gender: "",
        mobileNumber: "",
        email: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);
    };

    useEffect(() => {
        const geoWatchId = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                console.log('Latitude:', latitude, 'Longitude:', longitude);
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
                fetch(url)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log('Geocoding response:', data);
                        if (data && data.address) {
                            setAdd(data.address);
                        } else {
                            console.error('No address found in response:', data);
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching address:', error);
                    });
            },
            (error) => {
                console.error('Error getting geolocation:', error);
            },
            {
                enableHighAccuracy: true,  // High accuracy
                timeout: 60000,            // Timeout in 15 seconds
                maximumAge: 0,
                distanceFilter: 1           // Use fresh data
            }
        );

        // Cleanup on unmount to stop watching position
        return () => {
            navigator.geolocation.clearWatch(geoWatchId);
        };
    }, []);


    console.log(add)

    useEffect(() => {
        const savedData = localStorage.getItem("CustomerDetails");
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.title ||
            !formData.firstName ||
            !formData.lastName ||
            !formData.DOB ||
            !formData.gender ||
            !formData.mobileNumber ||
            !formData.email
        ) {
            alert("Please fill all the required fields");
            return;
        }

        if (formData.mobileNumber.length !== 10) {
            alert("Please enter a valid mobile number");
            return;
        }

        localStorage.setItem("CustomerDetails", JSON.stringify(formData));
        navigate("/customerPhoto");
        //console.log('Form Data:', formData);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#2f3fb7]">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="w-full flex flex-col items-center justify-center py-6 px-4 md:px-10 lg:px-20">
                <div className="w-full max-w-[95%] md:max-w-3xl lg:max-w-5xl p-4">
                    <h2 className="text-xl md:text-2xl font-semibold mb-1 text-center text-white">
                        Please Enter Your Details
                    </h2>
                    <span className="text-sm text-text-color mb-6 block text-center">
                        (As in the ID Card you have to submit)
                    </span>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Title */}
                            <div>
                                <label className="block text-white mb-2">
                                    Title<span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border text-gray-500 rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                >
                                    <option value="">Title</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Ms">Ms</option>
                                </select>
                            </div>

                            {/* First Name */}
                            <div>
                                <label className="block text-white mb-2">
                                    First Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Middle Name */}
                            <div>
                                <label className="block text-white mb-2">Middle Name</label>
                                <input
                                    type="text"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    placeholder="Middle Name"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-white mb-2">
                                    Last Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* DOB */}
                            <div>
                                <label className="block text-white mb-2">
                                    DOB<span className="text-red-500">*</span>
                                </label>
                                <div className="relative w-full">
                                    <input
                                        type="date"
                                        name="DOB"
                                        value={formData.DOB}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-2 h-12 text-gray-500 border rounded-md focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-white mb-2">
                                    Gender<span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border text-gray-500 rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Mobile */}
                            <div className="col-span-1 sm:col-span-2">
                                <label className="block text-white mb-2">
                                    Mobile<span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-row">
                                    <input
                                        type="text"
                                        value="(+91) IN"
                                        placeholder="(+91) IN"
                                        readOnly
                                        className="w-1/4 md:w-1/6 px-2 py-2 text-gray-500 border text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    <input
                                        type="number"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,10}$/.test(value)) {
                                                setFormData({ ...formData, mobileNumber: value });
                                            }
                                        }}
                                        placeholder="Mobile Number"
                                        className="w-full px-3 py-2 border focus:outline-none focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="col-span-1 sm:col-span-2">
                                <label className="block text-white mb-2">
                                    Email<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email ID"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center md:justify-end space-x-4 mt-6">
                            <button
                                type="submit"
                                className="text-white px-16 py-2 bg-text-color font-medium rounded-lg transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
