import React from 'react';
import Header from './Header';
import CustomerCard from './CustomerCard';
import Footer from './Footer';
import { useState } from 'react';
import { useGetListOfeKYC } from '../../utils/api-services/eKYC';
import { useGetUserByUsername } from '../../utils/api-services/User';
import user from '../../assets/user.png';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import person1 from '../../assets/person1.jpg';


export const CustomerQueuePage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [noCustomersMessage, setNoCustomersMessage] = useState('');
  const [isekycDone, seteKYCDone] = useState(false);
  const [filters, setFilters] = useState({
    isekycDone: isekycDone,
  });
  const [agent, setAgent] = useState('');
  const username = localStorage.getItem('username');

  const { isLoading } = useGetUserByUsername(username, {
    onSuccess: (res) => {
      setAgent(res.data.user);
    }
  });

  const { isLoadingCustomers, isError, data } = useGetListOfeKYC(filters, {
    onSuccess: (res) => {
      if (res.data.status) {
        setCustomers(res.data.eKYCs);
        setNoCustomersMessage('');
      }
      else {
        setCustomers([]);
        setNoCustomersMessage(res.data.message);
      }
    }
  });

  const handleJoinCallClick = ({ customer }) => {
    localStorage.setItem('channelName', customer.channelName)
    localStorage.setItem('agenttoken', customer.agenttoken)
    localStorage.setItem('startRecordinguid', customer.startRecordinguid)
    localStorage.setItem('startRecordingtoken', customer.startRecordingtoken)
    localStorage.setItem('agentuid', customer.agentuid)
    // Navigate to the customer queue page and pass the customer ID as a query parameter
    navigate(`/agentVideoCallPage/${customer._id}`);

  };

  return (
    <div className="flex flex-col min-h-screen bg-primary-color">
      {/* Header */}
      <Header agent={agent} />

      {/* Customer Queue */}
      <div className="flex-grow flex justify-center py-8 shadow-sm shadow-gray-950">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          {noCustomersMessage ? (
            <div className="text-white text-center text-2xl font-semibold">
              {noCustomersMessage}
            </div>
          ) : (
            customers.map((customer, index) => (
              <div className="max-h-[300px] overflow-hidden" key={index}> {/* Set max height here */}
                <div className="bg-white rounded-lg shadow p-4 text-center border-2 border-[#021b41] ">
                  <img
                    src={person1}
                    alt={customer.fullName}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h2 className="text-lg font-semibold text-gray-800">Customer: {customer.fullName}</h2>
                  <button onClick={() => handleJoinCallClick({ customer })}
                    className="mt-4 px-2 py-2 bg-text-color text-white rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5 w-full">
                    Start eKYC Meeting
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
