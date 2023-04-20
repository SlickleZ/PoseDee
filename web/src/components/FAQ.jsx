import React from 'react'
import DotImage from '../styles/pose-neckline-inclination.jpeg';
import SideViewImage from '../styles/pose-side-view.jpg';

function FAQ() {

  return (
    <div>
      <div class="p-10">
        <div class="bg-white p-10 rounded-lg shadow-xl mt-1" >
          {/* data-aos="fade-up" data-aos-delay="200" data-aos-duration="300" */}
          <h4 class="text-4xl font-bold text-gray-800 tracking-widest uppercase text-center">
            FAQ
          </h4>
          <p class="text-center text-gray-600 text-sm mt-2">
            Here are some of the frequently asked questions that devs think you should have :)
          </p>
          <div class="space-y-12 px-2 xl:px-16 mt-12">
            <div class="mt-4 flex">
              <div>
                <div class="flex items-center h-16 border-l-4 border-blue-900">
                  <span class="text-4xl text-blue-900 px-4">Q.</span>
                </div>
                <div class="flex items-center h-16 border-l-4 border-gray-400">
                  <span class="text-4xl text-gray-400 px-4">A.</span>
                </div>
              </div>
              <div>
                <div class="flex items-center h-16">
                  <span class="text-lg text-blue-900 font-bold">
                  What exactly is Posdee, and how can it help me improve my posture?
                  </span>
                </div>
                <div class="flex items-center py-2">
                  <span class="text-gray-500">
                  Posedee comes from the combination of the words "Pose," which is short for "posture," and "Dee," which means "good" in Thai. As a result, PoseDee is a web application that helps you maintain good posture. Which not only notifies you when you need to correct your posture but also monitors and records your data to assist you in determining areas that want development.
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex">
              <div>
                <div class="flex items-center h-16 border-l-4 border-blue-900">
                  <span class="text-4xl text-blue-900 px-4">Q.</span>
                </div>
                <div class="flex items-center h-16 border-l-4 border-gray-400">
                  <span class="text-4xl text-gray-400 px-4">A.</span>
                </div>
              </div>
              <div>
                <div class="flex items-center h-16">
                  <span class="text-lg text-blue-900 font-bold">
                  How can I effortlessly track my posture data?
                  </span>
                </div>
                <div class="flex items-center py-2">
                  <span class="text-gray-500">
                  By simply opening your camera and not navigating through numerous menu items on the navbar, our posture tracking website captures your data seamlessly. You would observe many factors on the camera's screen, such as:
                  <ul className="mt-3 ml-12 list-disc">
                                        <li className="mb-2"><span className="font-semibold"> Neck & Torso</span> on the top left of the camera screen is the subtended angle between the neckline and the torso line to the y-axis. The neckline connects the shoulder and the eye. Similarly, the torso line connects the hip and the shoulder, where the hip is considered a pivotal point. </li>
                                        <img className="mx-auto mb-2" src={DotImage} width="500" alt="Hero" />
                                        <li className="mb-2"><span className="font-semibold">Aligned & Not Aligned</span> on the top right of the camera screen is the state of users' postures' alignment. In order to preserve perfect alignment, adjust your posture until a pink dot is situated between the two yellow ones, as shown in the image below or until P1 is situated between P2 and P3, as shown in the image above.</li>
                                        <img className="mx-auto mb-2" src={SideViewImage} width="850" alt="Hero" />
                                        <li><span className="font-semibold">Good Posture Time & Bad Posture Time</span> on the bottom left of the camera screen the amount of time, in seconds, that the user was seated in various postures, either good or bad. (Remark: For effective monitoring and data gathering, the user should sit till Green Aligned on the top right of the screen appears.)</li>
                                    </ul>
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex">
              <div>
                <div class="flex items-center h-16 border-l-4 border-blue-900">
                  <span class="text-4xl text-blue-900 px-4">Q.</span>
                </div>
                <div class="flex items-center h-16 border-l-4 border-gray-400">
                  <span class="text-4xl text-gray-400 px-4">A.</span>
                </div>
              </div>
              <div>
                <div class="flex items-center h-16">
                  <span class="text-lg text-blue-900 font-bold">
                  What happens if my camera fails to detect me while using Posdee?
                  </span>
                </div>
                <div class="flex items-center py-2">
                  <span class="text-gray-500">
                  Your posture data will not be updated if your camera is unable to recognize you, as all camera variables would not be shown on the camera screen. For the camera to properly record your data, we suggest users to stay active and keep excellent posture.
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex">
              <div>
                <div class="flex items-center h-16 border-l-4 border-blue-900">
                  <span class="text-4xl text-blue-900 px-4">Q.</span>
                </div>
                <div class="flex items-center h-16 border-l-4 border-gray-400">
                  <span class="text-4xl text-gray-400 px-4">A.</span>
                </div>
              </div>
              <div>
                <div class="flex items-center h-16">
                  <span class="text-lg text-blue-900 font-bold">
                  How can I sign out of the website?
                  </span>
                </div>
                <div class="flex items-center py-6">
                  <span class="text-gray-500">
                  To sign out, click on the signout button located under your profile picture button to end your website session. Which will draw close to your webcam!
                  </span>
                </div>
              </div>
            </div>

            {/* <div class="mt-4 flex">
              <div>
                <div class="flex items-center h-16 border-l-4 border-blue-900">
                  <span class="text-4xl text-blue-900 px-4">Q.</span>
                </div>
                <div class="flex items-center h-16 border-l-4 border-gray-400">
                  <span class="text-4xl text-gray-400 px-4">A.</span>
                </div>
              </div>
              <div>
                <div class="flex items-center h-16">
                  <span class="text-lg text-blue-900 font-bold">
                    Similique fugiat cumque?
                  </span>
                </div>
                <div class="flex items-center py-2">
                  <span class="text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quae, dignissimos. Neque eos, dignissimos provident
                    reiciendis debitis repudiandae commodi perferendis et
                    itaque, similique fugiat cumque impedit iusto vitae
                    dolorum. Nostrum, fugit!
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex">
              <div>
                <div class="flex items-center h-16 border-l-4 border-blue-900">
                  <span class="text-4xl text-blue-900 px-4">Q.</span>
                </div>
                <div class="flex items-center h-16 border-l-4 border-gray-400">
                  <span class="text-4xl text-gray-400 px-4">A.</span>
                </div>
              </div>
              <div>
                <div class="flex items-center h-16">
                  <span class="text-lg text-blue-900 font-bold">
                    Impedit iusto vitae dolorum, nostrum fugit?
                  </span>
                </div>
                <div class="flex items-center py-2">
                  <span class="text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quae, dignissimos. Neque eos, dignissimos provident
                    reiciendis debitis repudiandae commodi perferendis et
                    itaque, similique fugiat cumque impedit iusto vitae
                    dolorum. Nostrum, fugit!
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
