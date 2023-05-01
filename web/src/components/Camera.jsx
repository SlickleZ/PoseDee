import React, { useRef, useState } from 'react';

const Camera = () => {
  const videoRef = useRef(null);
  const [isCameraRunning, setIsCameraRunning] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsCameraRunning(true);
    } catch (err) {
      console.error('Failed to access webcam', err);
    }
  };

  const stopCamera = () => {
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    setIsCameraRunning(false);
  };

  return (
    <div className="py-10 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="300">
      <div className="camera-container">
      <video className ="border-4" ref={videoRef} width="780"/>
      </div>
      {!isCameraRunning ? (
        <button onClick={startCamera}>Start Camera</button>
      ) : (
        <button onClick={stopCamera}>Stop Camera</button>
      )}
    </div>
    
  );
};

export default Camera;