import React from 'react';
import HeroImage from '../styles/posedee-feature-image1.gif';

function HomeFeaturesBlocks() {
  return (
    <section>
      {/* Hero image */}
      <div data-aos="fade-up" data-aos-delay="400" data-aos-duration="900">
            <img className="mx-auto" src={HeroImage} width="1024" height="504" alt="Hero" />
      </div> 

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 ">
            <h2 className="h2 mb-4">Features</h2>
            <p className="text-xl text-gray-600">We understand the importance of good posture and have made it our mission to provide our users with the best possible tools and resources to achieve it. Here are some possible features for your posture tracking web-app with some details:</p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 items-start md:max-w-2xl lg:max-w-none" data-aos-id-blocks>

            {/* 1st item */}
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <rect className="fill-current text-emerald-500" width="64" height="64" rx="32" />
                <path className="stroke-current text-emerald-50" d="M30 39.313l-4.18 2.197L27 34.628l-5-4.874 6.91-1.004L32 22.49l3.09 6.26L42 29.754l-3 2.924" strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd" />
                <path className="stroke-current text-emerald-100" d="M43 42h-9M43 37h-9" strokeLinecap="square" strokeWidth="2" />
              </svg>
              <h4 className="h4 mb-2">Clear and Simple Design</h4>
              <p className="text-lg text-gray-600 text-center">Simplify your app's design for easy navigation and create personalized dashboards to display user's posture tracking data and progress towards their goals.</p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="100" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <circle className="fill-current text-emerald-500" cx="32" cy="32" r="32" />
                <path className="stroke-current text-emerald-50" strokeWidth="2" strokeLinecap="square" d="M21 23h22v18H21z" fill="none" fillRule="evenodd" />
                <path className="stroke-current text-emerald-100" d="M26 28h12M26 32h12M26 36h5" strokeWidth="2" strokeLinecap="square" />
              </svg>
              <h4 className="h4 mb-2">Customizable Posture Alerts</h4>
              <p className="text-lg text-gray-600 text-center">Give users the ability to customize posture alerts based on their preferences and habits. </p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="200" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <rect className="fill-current text-emerald-500" width="64" height="64" rx="32" />
                <g transform="translate(21 21)" strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd">
                  <ellipse className="stroke-current text-emerald-100" cx="11" cy="11" rx="5.5" ry="11" />
                  <path className="stroke-current text-emerald-50" d="M11 0v22M0 11h22" />
                  <circle className="stroke-current text-emerald-100" cx="11" cy="11" r="11" />
                </g>
              </svg>
              <h4 className="h4 mb-2">Posture Tracking History</h4>
              <p className="text-lg text-gray-600 text-center">Users could also see how their posture has improved over time, and use this information to make adjustments to their posture habits.</p>
            </div>

            {/* 4th item */}
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="300" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <rect className="fill-current text-emerald-500" width="64" height="64" rx="32" />
                <g transform="translate(22 21)" strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd">
                  <path className="stroke-current text-emerald-50" d="M17 22v-6.3a8.97 8.97 0 003-6.569A9.1 9.1 0 0011.262 0 9 9 0 002 9v1l-2 5 2 1v4a2 2 0 002 2h4a5 5 0 005-5v-5" />
                  <circle className="stroke-current text-emerald-100" cx="13" cy="9" r="3" />
                </g>
              </svg>
              <h4 className="h4 mb-2 text-center">Real-Time Analysis</h4>
              <p className="text-lg text-gray-600 text-center">Using the device's camera, the app can analyze your posture in real-time and provide immediate feedback on your posture habits, including suggestions for improvements.</p>
            </div>

            {/* 5th item */}
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="400" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <rect className="fill-current text-emerald-500" width="64" height="64" rx="32" />
                <g strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd">
                  <path className="stroke-current text-emerald-50" d="M29 42h10.229a2 2 0 001.912-1.412l2.769-9A2 2 0 0042 29h-7v-4c0-2.373-1.251-3.494-2.764-3.86a1.006 1.006 0 00-1.236.979V26l-5 6" />
                  <path className="stroke-current text-emerald-100" d="M22 30h4v12h-4z" />
                </g>
              </svg>
              <h4 className="h4 mb-2">Customizable Settings</h4>
              <p className="text-lg text-gray-600 text-center">Allow users to customize the posture tracking settings to their personal preferences like the sensitivity of the posture tracking algorithm or customize the types of alerts they receive.</p>
            </div>

            {/* 6th item */}
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="500" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <rect className="fill-current text-emerald-500" width="64" height="64" rx="32" />
                <g transform="translate(21 22)" strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd">
                  <path className="stroke-current text-emerald-100" d="M17 2V0M19.121 2.879l1.415-1.415M20 5h2M19.121 7.121l1.415 1.415M17 8v2M14.879 7.121l-1.415 1.415M14 5h-2M14.879 2.879l-1.415-1.415" />
                  <circle className="stroke-current text-emerald-50" cx="17" cy="5" r="3" />
                  <path className="stroke-current text-emerald-50" d="M8.86 1.18C3.8 1.988 0 5.6 0 10c0 5 4.9 9 11 9a10.55 10.55 0 003.1-.4L20 21l-.6-5.2a9.125 9.125 0 001.991-2.948" />
                </g>
              </svg>
              <h4 className="h4 mb-2">Multi-Device Support</h4>
              <p className="text-lg text-gray-600 text-center">The app could be compatible with smartphones, tablets, and desktop computers, and allow users to seamlessly switch between devices while tracking their posture.</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
  
export default HomeFeaturesBlocks;
