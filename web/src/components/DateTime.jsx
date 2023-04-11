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

  return (
    <div>
      <p className= "mt-3 mb-5 font-bold">
        Clock: {formattedTime} | {formattedDate}
      </p>
    </div>
  );
};

export default DateTime;
