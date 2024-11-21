import {
    LocalUser,
    RemoteUser,
    useIsConnected,
    useJoin,
    useLocalMicrophoneTrack,
    useLocalCameraTrack,
    usePublish,
    useRemoteUsers,
} from "agora-rtc-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../utils/url";
import { useRef } from "react";

export const Basics = ({ eKYCId }) => {
    const navigate = useNavigate();
    const [calling, setCalling] = useState(true);
    const isConnected = useIsConnected();
    const [appId, setAppId] = useState("88ab819f90fb40bcb76fbabc0023fa5d");
    const [channel, setChannel] = useState("ekyc");
    const [token, setToken] = useState("007eJxTYNi1syI4bGrTTMnvWhNzli5/p3DQ75T8844wtd7Ut3efaq5VYLCwSEyyMLRMszRISzIxSEpOMjdLS0pMSjYwMDJOSzRNORVsn94QyMhg/HIJCyMDBIL4LAyp2ZXJDAwA52Ahxg==");
    const selectedOption = localStorage.getItem('role');
    const [apiCalled, setApiCalled] = useState(false);
    const [sid, setSid] = useState("");
    const [resourceId, setResourceId] = useState("");
    const [CustomerUID, setCustomerUID] = useState("");

    useJoin({ appid: appId, channel: channel, token: token ? token : null }, calling);

    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(true, {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
    });

    const { localCameraTrack, error: cameraError } = useLocalCameraTrack(cameraOn);
    usePublish([localMicrophoneTrack, localCameraTrack]);

    const remoteUsers = useRemoteUsers();


    useEffect(() => {
        console.log("Debugging useEffect:");
        console.log("Selected Option:", selectedOption);
        console.log("Remote Users:", remoteUsers);
        console.log("API already called:", apiCalled);

        if (selectedOption === "Agent" && remoteUsers.length > 0 && !apiCalled) {
            console.log("Making API call to start recording...");
            setApiCalled(true); // Prevent duplicate calls
            setCustomerUID(remoteUsers[0].uid);
            axios
                .post(`${BASE_URL}/user/startRecording`, {
                    cname: channel,
                    uid: remoteUsers[0].uid,
                    token: token,
                    ekycId: eKYCId,
                })
                .then((response) => {
                    setSid(response.data.sid);
                    setResourceId(response.data.resourceId);
                    console.log("Recording started successfully:", response.data);
                })
                .catch((error) => {
                    console.error("Error starting recording:", error);
                    setApiCalled(false); // Allow retries if the call fails
                });
        }
    }, [remoteUsers, selectedOption, channel, token, eKYCId]);




    useEffect(() => {
        console.log("Remote Users:", remoteUsers);
    }, [remoteUsers]);

    useEffect(() => {
        const selectedOption = localStorage.getItem('role');
        if (selectedOption === 'Agent') {
            setCamera(false);
        }
    }, []);

    useEffect(() => {
        if (cameraError) {
            console.error('Camera error:', cameraError);
            alert('Could not start video source. Please check your camera permissions and availability.');
        }
    }, [cameraError]);

    useEffect(() => {
        if (localCameraTrack) {
            localCameraTrack.play('local_stream');
        }
    }, [localCameraTrack]);

    const handleMute = () => {
        setMic((prev) => !prev)
    };

    // Handle End Call button click
    const handleEndCall = () => {
        console.log("End Call button clicked");
        axios
            .post(`${BASE_URL}/user/stopRecording`, {
                resourceId: resourceId,
                cname: channel,
                sid: sid,
                uid: CustomerUID,
                ekycId: eKYCId,
            })
            .then((response) => {
                console.log("Recording stopped successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error stopping recording:", error);
            });

        if (selectedOption === 'Agent') {
            navigate('/customerQueuePage');
        } else {
            navigate('/');
        }
        // Logic to end the call can go here
    };

    return (
        <>
            <div className="flex flex-wrap justify-center items-center space-y-4 max-w-1xl lg:max-w-3xl md:max-w-4xl" >
                <div className={`flex flex-col items-center bg-gray-100 rounded-lg shadow-lg overflow-y-hidden
                ${selectedOption === 'Agent' ? 'w-0 h-0' : 'w-[400px] md:w-[770px] lg:w-[960px] h-[270px] md:h-[500px] lg:h-[576px]'}`}>
                    <LocalUser
                        cameraOn={cameraOn}
                        micOn={micOn}
                        videoTrack={localCameraTrack}
                        cover="https://cdn-icons-png.flaticon.com/512/4715/4715330.png"
                    >
                        <span className="font-bold">You</span>
                    </LocalUser>
                </div>
                {remoteUsers.length > 0 && remoteUsers.map((user) => {
                    console.log('UID of the user:', user.uid); // Log the UID of the user
                    return (
                        <div className={`flex flex-col items-center bg-gray-100 rounded-lg shadow-lg overflow-y-hidden 
                            ${selectedOption === 'Customer' ? 'w-0 h-0' : 'w-[400px] md:w-[770px] lg:w-[960px] h-[270px] md:h-[500px] lg:h-[576px]'}`} key={user.uid}>
                            <RemoteUser
                                cover="https://cdn-icons-png.flaticon.com/512/4715/4715330.png"
                                user={user}
                            >
                                <span className="font-bold">{user.uid}</span>
                            </RemoteUser>
                        </div>
                    );
                })}
                <div className="flex flex-row items-center justify-evenly w-full">
                    {remoteUsers.length > 0 && selectedOption === 'Customer' && (
                        <div className="flex justify-center items-center space-x-2">
                            <button className="w-4 h-4 bg-green-500 rounded-full"></button>
                            <span>Agent is Online</span>
                        </div>
                    )}
                    {remoteUsers.length === 0 && selectedOption === 'Customer' && (
                        <div className="flex justify-center items-center space-x-2">
                            <button className="w-4 h-4 bg-red-500 rounded-full"></button>
                            <span>Agent is Offline</span>
                        </div>
                    )}
                    <button
                        onClick={handleEndCall}
                        className="text-gray-700 bg-gray-200 rounded-lg shadow-md font-semibold py-2 px-4 lg:px-6 hover:bg-red-600 hover:text-white transition duration-200"
                    >
                        End Call
                    </button>
                </div>
            </div>


            {/* <div className="flex justify-center space-x-4 mt-2">
                {selectedOption !== 'Customer' && (
                    <button
                        onClick={() => setMic((prev) => !prev)}
                        className="text-gray-700 bg-gray-200 rounded-lg shadow-md font-semibold py-2 px-4 lg:px-6 hover:bg-gray-300 transition duration-200"
                    >
                        {micOn ? 'Mute' : 'Unmute'}
                    </button>
                )}

            </div> */}
            {/* {isConnected && (
                <div className="flex justify-between items-center w-full p-4 mt-4 bg-white shadow-lg rounded-lg">
                    <div className="flex gap-4">
                        <button
                            className="btn bg-blue-500 text-white rounded-full p-2"
                            onClick={() => setMic((prev) => !prev)}
                        >
                            <i className={`i-microphone ${!micOn ? "text-red-500" : ""}`} />
                        </button>
                        <button
                            className="btn bg-blue-500 text-white rounded-full p-2"
                            onClick={() => setCamera((prev) => !prev)}
                            disabled={localStorage.getItem('role') === 'Agent'}
                        >
                            <i className={`i-camera ${!cameraOn ? "text-red-500" : ""}`} />
                        </button>
                    </div>
                    <button
                        className={`btn ${calling ? "bg-red-500" : "bg-green-500"} text-white rounded-full p-4`}
                        onClick={() => setCalling((prev) => !prev)}
                    >
                        {calling ? <i className="i-phone-hangup" /> : <i className="i-mdi-phone" />}
                    </button>
                </div>
            )} */}
        </>
    );
};

export default Basics;
