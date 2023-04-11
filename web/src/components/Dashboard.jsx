import React, { useState, useEffect } from 'react';
import useCookie, { setCookie } from "react-use-cookie";

function Dashboard() {
  useEffect(() => {
    document.title = 'PoseDee | Overviews';

  }, []);

  return (

    <div class="p-10">
      <div class="bg-white p-10 rounded-lg shadow-xl mt-1" >
        {/* data-aos="fade-up" data-aos-delay="200" data-aos-duration="300" */}
        <h4 class="text-4xl font-bold text-gray-800 uppercase text-center"> Posture Overviews </h4>
        <p class="text-center text-gray-600 text-sm mt-2">
        Get a glimpse into your posture with these illuminating overviews. Keep your data current by activating the tracking system above. <span class="wave">👆</span>
        </p>
      </div>
    </div>
  )
}

export default Dashboard
