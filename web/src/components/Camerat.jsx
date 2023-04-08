import React, { useState, useEffect } from 'react';
import useCookie, { setCookie } from "react-use-cookie";
import DateTime from "../components/DateTime";

function Camerat() {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [userinfo, setUserInfo] = useCookie("userinfo", "");

    useEffect(() => {
        if (isCameraOn) {
            //   const intervalId = setInterval(() => {
            //     setImageUrl(`/video_feed?t=${Date.now()}`);
            //   }, 900);
            setImageUrl('/video_feed');
            document.title = 'PoseDee | Tracking (On)';
            //   return () => clearInterval(intervalId);
        } else {
            setImageUrl('');
            document.title = 'PoseDee | Tracking (Off)';
        }
    }, [isCameraOn]);

    // Local s
    useEffect(() => {
        const storedIsCameraOn = JSON.parse(localStorage.getItem('isCameraOn'));
        if (storedIsCameraOn !== null) {
            setIsCameraOn(storedIsCameraOn);
        }

        const handleStorageChange = () => {
            const newIsCameraOn = JSON.parse(localStorage.getItem('isCameraOn'));
            setIsCameraOn(newIsCameraOn);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        }
    }, []);

    function handleStartClick() {
        fetch('/start_camera')
            .then(() => {
                setIsCameraOn(true);
                localStorage.setItem('isCameraOn', true);
            })
            .catch(console.error);
    }

    function handleStopClick() {
        fetch('/stop_camera')
            .then(() => {
                setIsCameraOn(false);
                localStorage.setItem('isCameraOn', false);
                window.location.reload(false);
            })
            .catch(console.error);
    }

    return (
        <div className="py-10">
            <div className="camera-container">
                {imageUrl ? (
                    <div>
                        <h2>Our application is presently monitoring the posture of {JSON.parse(userinfo).name}.</h2>
                        <img className="border-2" src={imageUrl} alt="Posture Feed" width={780} />
                        <DateTime />
                        <button class="bg-gray-300 hover:bg-gray-400 transition duration-150 ease-in-out text-gray-800 font-bold py-2 px-4 rounded"
                            disabled={!isCameraOn} onClick={handleStopClick}>
                            Stop
                        </button>
                    </div>

                ) : (
                    <div>
                        <h2>Click "Start" to turn on the camera to track posture</h2>
                        <div
                            style={{
                                width: '780px',
                                height: '442.25px',
                                backgroundColor: '#ECECEC',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <p>Camera is off</p>
                        </div>
                        <DateTime />
                        <button class="bg-gray-300 hover:bg-gray-400 transition duration-150 ease-in-out text-gray-800 font-bold py-2 px-4 rounded"
                            disabled={isCameraOn} onClick={handleStartClick}>
                            Start
                        </button>
                    </div>
                )}
            </div>
            {/* <div>
                <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l" disabled={isCameraOn} onClick={handleStartClick}>
                    Start
                </button>
                <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l cursor-not-allowed" disabled={!isCameraOn} onClick={handleStopClick}>
                    Stop
                </button>
            </div> */}
        </div>
    );
}


export default Camerat;
