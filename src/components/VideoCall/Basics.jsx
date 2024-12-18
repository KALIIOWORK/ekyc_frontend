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
    const channel = localStorage.getItem('channelName');
    const token = localStorage.getItem('token');
    const appId = "88ab819f90fb40bcb76fbabc0023fa5d"
    const uid = localStorage.getItem('uid');
    const navigate = useNavigate();
    const [calling, setCalling] = useState(true);
    const isConnected = useIsConnected();
    const selectedOption = localStorage.getItem('role');
    const [apiCalled, setApiCalled] = useState(false);
    const [sid, setSid] = useState("");
    const [resourceId, setResourceId] = useState("");
    const [CustomerUID, setCustomerUID] = useState("");
    const [isCallEnded, setIsCallEnded] = useState(false);

    useJoin({ appid: appId, channel: channel, token: token ? token : null, uid: uid }, calling);

    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(true, {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
    });

    const { localCameraTrack, error: cameraError } = useLocalCameraTrack(cameraOn, {
        encoderConfig: {
            width: 1280,
            height: 720,
            frameRate: 30,
        },
    });

    //const { localCameraTrack, error: cameraError } = useLocalCameraTrack(cameraOn);
    usePublish([localMicrophoneTrack, localCameraTrack]);

    const remoteUsers = useRemoteUsers();


    useEffect(() => {
        console.log("Remote Users:", remoteUsers);
        if (remoteUsers.length > 0 && isCallEnded === false) {
            setIsCallEnded(true);
        }
        if (remoteUsers.length === 0 && isCallEnded === true) {
            navigate('/videoCallSuccessPage');
        }
    }, [remoteUsers]);

    // useEffect(() => {
    //     const selectedOption = localStorage.getItem('role');
    //     if (selectedOption === 'Agent') {
    //         setCamera(false);
    //     }
    // }, []);

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
        navigate('/videoCallSuccessPage');
    };

    return (
        <>
            {selectedOption === 'Customer' && remoteUsers.length === 0 && isCallEnded === false ? (
                <div className="max-w-md w-full bg-white p-6 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Waiting Room</h2>
                    <p className="text-gray-600 mb-2">
                        Hello, Please wait until your agent is ready.
                    </p>
                </div>
            ) :
                (
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
                        </div>
                    </div>
                )}
        </>
    );
};

export default Basics;
