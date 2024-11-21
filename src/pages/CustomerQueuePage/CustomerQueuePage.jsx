import React from 'react';
import Header from './Header';
import CustomerCard from './CustomerCard';
import Footer from './Footer';
import { useState } from 'react';
import { useGetListOfeKYC } from '../../utils/api-services/eKYC';
import { useGetUserByUsername } from '../../utils/api-services/User';
import user from '../../assets/user.png';
import Swal from 'sweetalert2';

export const CustomerQueuePage = () => {
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
                <CustomerCard
                  customer={customer}
                />
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
