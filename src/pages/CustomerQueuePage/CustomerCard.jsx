import React from 'react';
import { useNavigate } from 'react-router-dom';
import person1 from '../../assets/person1.jpg';


const CustomerCard = ({ customer }) => {
  const navigate = useNavigate();

  const handleJoinCallClick = () => {
    localStorage.setItem('channelName', customer.channelName)
    localStorage.setItem('token', customer.token)
    localStorage.setItem('uid', customer.uid)
    // Navigate to the customer queue page and pass the customer ID as a query parameter
    navigate(`/VideoCallPage/${customer._id}`);

  };
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center border-2 border-[#021b41] ">
      <img
        src={person1}
        alt={customer.fullName}
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h2 className="text-lg font-semibold text-gray-800">Customer: {customer.fullName}</h2>
      <button onClick={handleJoinCallClick} className="mt-4 px-2 py-2 bg-text-color text-white rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5 w-full">
        Start eKYC Meeting
      </button>
    </div>
  );
};

export default CustomerCard;