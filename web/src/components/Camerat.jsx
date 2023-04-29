import React, { useState, useEffect } from 'react';
import useCookie, { setCookie } from "react-use-cookie";
import DateTime from "../components/DateTime";
import { Link } from 'react-router-dom';

function Camerat() {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [userinfo, setUserInfo] = useCookie("userinfo", "");

    useEffect(() => {
        if (isCameraOn) {
            setImageUrl('/video_feed?user_id=' + JSON.parse(userinfo).id);
            document.title = 'PoseDee | Tracking (On)';
        } else {
            setImageUrl('');
            document.title = 'PoseDee | Tracking';
        }
    }, [isCameraOn]);

    // Local Storage -> Set Camera On and Off
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
        <div class="p-10">
            <div class="bg-white p-10 rounded-lg shadow-xl mt-1" >
                <h4 class="text-4xl font-bold text-gray-800 uppercase text-center"> Tracking System </h4>
                <div>
                    {imageUrl ? (
                        <div>
                            <p className="text-center text-gray-600 text-sm mt-2 mb-6">Our application is presently monitoring the posture of <span className="font-bold text-sky-700">{JSON.parse(userinfo).name}</span>.</p>
                            <div className="grid grid-flow-row sm:grid-flow-col gap-6">
                                <div className="flex flex-col items-center sm:col-span-2">
                                    <img className="" src={imageUrl} alt="Posture Feed" width={780} />
                                    <button class="mt-4 bg-gray-300 hover:bg-gray-400 transition duration-150 ease-in-out text-gray-800 font-bold py-2 px-10 rounded"
                                        disabled={!isCameraOn} onClick={handleStopClick}>
                                        Stop
                                    </button>
                                </div>

                                <div className="sm:col-span-2 mt-8">
                                    <DateTime />
                                    <p className="text-center font-medium">Outstanding! 😊 Nestle a purple dot between the yellow ones as a reminder to sit up straight.</p>
                                    <div className="text-center mt-3">
                                        Still feeling confused? <Link to="/faq" target="_blank"
                                            className="text-emerald-600 hover:text-emerald-500 hover:underline transition duration-150 ease-in-out">FAQ about PoseDee</Link>
                                    </div>
                                </div></div></div>

                    ) : (
                        <div>
                            <p className="text-center text-gray-600 text-sm mt-2 mb-6">Greetings! Get ready to transform your posture and elevate your confidence!</p>
                            <div className="grid grid-flow-row sm:grid-flow-col gap-6">
                                <div className="flex flex-col items-center sm:col-span-2">
                                <img className="w-[700px]" src="https://cdn.dribbble.com/users/1013040/screenshots/4398776/comp-15.gif" alt="Posture Feed" />
                                    <button class="mt-4 bg-gray-300 hover:bg-gray-400 transition duration-150 ease-in-out text-gray-800 font-bold py-2 px-10 rounded"
                                        disabled={isCameraOn} onClick={handleStartClick}>
                                        Start
                                    </button>
                                </div>
                                <div className="sm:col-span-2 mt-8">
                                    <DateTime />
                                    <p className="text-center font-medium">Click "Start" to turn on the camera to track your posture 💪</p>
                                    <div className="text-center mt-3">
                                        Feeling confused? <Link to="/faq" target="_blank"
                                            className="text-emerald-600 hover:text-emerald-500 hover:underline transition duration-150 ease-in-out">FAQ about PoseDee</Link>
                                    </div>
                                </div></div></div>

                    )}
                </div>
            </div>
        </div>
    );
}


export default Camerat;