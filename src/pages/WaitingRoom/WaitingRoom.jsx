import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


export const WaitingRoom = ({ customerName, queuePosition, estimatedWaitTime }) => {
  const [position, setPosition] = useState(queuePosition);
  const [waitTime, setWaitTime] = useState(estimatedWaitTime);
  const [isAgentJoined, setIsAgentJoined] = useState(true);
  const navigate = useNavigate();
  const eKYCId = localStorage.getItem('eKYCId');

  useEffect(() => {
    // Polling to update queue position and wait time from backend every 30 seconds
    const interval = setInterval(() => {
      fetchQueueStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchQueueStatus = async () => {
    // Fetch the latest queue position and estimated wait time from your backend
    const response = await fetch(`/api/queue-status?customerName=${customerName}`);
    const data = await response.json();

    setPosition(data.position);
    setWaitTime(data.estimatedWaitTime);

    // Check if agent is ready to join
    if (data.agentReady) {
      setIsAgentJoined(true);
    }
  };

  const handleJoinMeeting = () => {
    // Logic to redirect to the actual meeting room
    // window.location.href = "/videoCall";
    navigate(`/videoCallPage/${eKYCId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-color">
      <div className="max-w-md w-full rounded-lg shadow-md p-6 bg-white text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Waiting Room</h2>
        <p className="text-gray-600 mb-2">
          Hello, Please wait until your agent is ready.
        </p>
      </div>
    </div>
  );
};

// export default WaitingRoom;
