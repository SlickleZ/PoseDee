import React, { useState, useEffect } from 'react';

export const DateTime = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedTime = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isAM = date.getHours() < 12; // Check if it's AM or PM

  return (
    <div>
      <p className= "text-center subpixel-antialiased mt-2 mb-10 text-2xl font-bold">
      {formattedDate}  {isAM ? '☀️' : '🌙'} {formattedTime} 
      </p>
    </div>
  );
};

export default DateTime;
