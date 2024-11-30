import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useState } from 'react';
import { useGetListOfeKYC } from '../../utils/api-services/eKYC';
import { useGetUserByUsername } from '../../utils/api-services/User';
import person1 from '../../assets/person1.jpg';
import { Loader } from '../../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';

export const CustomerQueuePage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [noCustomersMessage, setNoCustomersMessage] = useState('');
  const [filters, setFilters] = useState({ isJoined: true });
  const [agent, setAgent] = useState('');
  const username = localStorage.getItem('username');
  const [isCalling, setIsCalling] = useState(false);
  const [isMissed, setIsMissed] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('queue');


  // Fetch agent data by username
  const { isLoading: isLoadingAgent } = useGetUserByUsername(username, {
    onSuccess: (res) => {
      setAgent(res.data.user);
    },
  });

  const handleFilterChange = (filterKey) => {
    if (filterKey === 'queue') {
      setFilters({ isJoined: true });
    } else if (filterKey === 'missed') {
      setFilters({ isMissed: true });
    }
    setSelectedFilter(filterKey);
  };


  // Fetch eKYC customers
  const {
    isLoading: isLoadingCustomers,
    isError,
    refetch,
  } = useGetListOfeKYC(filters, {
    onSuccess: (res) => {
      if (res.data.status) {
        const sortedCustomers = res.data.eKYCs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCustomers(sortedCustomers);
        setNoCustomersMessage('');
      } else {
        setCustomers([]);
        setNoCustomersMessage(res.data.message);
      }
    },
  });

  // Polling every 5 seconds to fetch updated customer data
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch(); // Fetch the updated customer list
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [refetch]);

  // Handle call join logic
  const handleJoinCallClick = (customer) => {
    localStorage.setItem('channelName', customer.channelName);
    localStorage.setItem('agenttoken', customer.agenttoken);
    localStorage.setItem('startRecordinguid', customer.startRecordinguid);
    localStorage.setItem('startRecordingtoken', customer.startRecordingtoken);
    localStorage.setItem('agentuid', customer.agentuid);
    localStorage.setItem('customertoken', customer.customertoken);
    localStorage.setItem('customeruid', customer.customeruid);
    setIsCalling(true);
    navigate(`/agentVideoCallPage/${customer._id}`);
  };



  if (isLoadingAgent || isLoadingCustomers) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary-color">
      {/* Header */}
      <Header agent={agent} />

      {/* Customer Queue */}
      <div className="flex-grow flex flex-col items-center py-8 px-10 shadow-sm shadow-gray-950">
        {/* Filter Section */}
        <div className="w-full bg-white shadow-lg rounded-lg p-1 flex justify-between mb-4">
          <div
            onClick={() => handleFilterChange('queue')}
            className={`cursor-pointer w-full text-center  transition-all duration-300 ease-in-out
      ${selectedFilter === 'queue'
                ? 'bg-yellow-500  shadow-md text-white'
                : 'bg-gray-300 text-black '}`}
          >
            Customer Queue
          </div>
          <div
            onClick={() => handleFilterChange('missed')}
            className={`cursor-pointer w-full text-center transition-all duration-300 ease-in-out
      ${selectedFilter === 'missed'
                ? 'bg-red-600 shadow-md text-white '
                : 'bg-gray-300 text-black'}`}
          >
            Missed eKYCs
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          {noCustomersMessage ? (
            <div className="text-white text-center text-2xl font-semibold">
              {noCustomersMessage}
            </div>
          ) : (

            customers.map((customer, index) => (
              <div className="max-h-[300px] overflow-hidden" key={index}>
                <div className="bg-white rounded-lg shadow p-4 text-center border-2 border-[#021b41]">
                  <img
                    src={customer.customerPhoto || person1}
                    alt={customer.fullName}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Customer: {customer.fullName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Profile created on:{' '}
                    {new Date(customer.createdAt).toLocaleDateString()}{' '}
                    {new Date(customer.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {selectedFilter === 'missed' && customer.missedTime && (
                    <p className="text-sm text-red-500 font-semibold mt-2">
                      Missed Time: {new Date(customer.missedTime).toLocaleDateString()}{' '}
                      {new Date(customer.missedTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                  {selectedFilter === 'queue' && (
                    <button
                      onClick={() => handleJoinCallClick(customer)}
                      className="mt-4 px-2 py-2 bg-text-color text-white rounded-full transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5 w-full"
                    >
                      Start eKYC Meeting
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div> */}
        {/* Table Section */}
        <div className="w-full bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
          <table className="w-full border-collapse border border-[#021b41]">
            <thead>
              <tr>
                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Customer</th>
                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Mobile Number</th>
                <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Profile Created On</th>
                {selectedFilter === 'missed' ? (
                  <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Missed Time</th>
                ) : (
                  <th className="border-2 border-primary-color px-4 py-2 text-left text-gray-600 font-medium">Actions</th>
                )}

              </tr>
            </thead>
            <tbody>
              {noCustomersMessage ? (
                <tr>
                  <td colSpan="5" className="border border-primary-color px-4 py-2 text-gray-800 text-center">
                    {noCustomersMessage}
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-100">
                    <td className="border border-primary-color px-4 py-2 text-gray-800 text-sm">
                      <div className="flex items-center">
                        <img
                          src={customer.customerPhoto}
                          alt="Profile"
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="ml-2 ">{customer.fullName}</span>
                      </div>
                    </td>
                    <td className="border border-primary-color px-4 py-2 text-gray-800">
                      +91(IN) {customer.mobileNumber}
                    </td>
                    <td className="border border-primary-color px-4 py-2 text-gray-800">{new Date(customer.createdAt).toLocaleDateString()} {new Date(customer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    {selectedFilter === 'missed' && (
                      <td className="border border-primary-color px-4 py-2 text-red-600">
                        {new Date(customer.missedTime).toLocaleDateString()} {new Date(customer.missedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    )}
                    {selectedFilter === 'queue' && (
                      <td className="border border-primary-color px-4 py-2">
                        <button
                          onClick={() => handleJoinCallClick(customer)}
                          className="bg-text-color text-white px-2 py-1 rounded transition duration-200 ease-in-out transform hover:bg-hover-color hover:-translate-y-0.5"
                        >
                          Start eKYC Meeting
                        </button>
                      </td>
                    )}

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
