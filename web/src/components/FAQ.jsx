import React from 'react'

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
                <div class="flex items-center h-16 border-l-4 border-blue-600">
                  <span class="text-4xl text-blue-600 px-4">Q.</span>
                </div>
                <div class="flex items-center h-16 border-l-4 border-gray-400">
                  <span class="text-4xl text-gray-400 px-4">A.</span>
                </div>
              </div>
              <div>
                <div class="flex items-center h-16">
                  <span class="text-lg text-blue-600 font-bold">
                  What exactly is Posdee, and how can it help me improve my posture?
                  </span>
                </div>
                <div class="flex items-center py-2">
                  <span class="text-gray-500">
                  Posdee is a comprehensive posture tracking app that not only alerts you 
                  when you need to adjust your posture but also tracks and stores your data 
                  to help you identify areas where you need improvement.
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex">
              <div>
                <div class="flex items-center h-16 border-l-4 border-blue-600">
                  <span class="text-4xl text-blue-600 px-4">Q.</span>
                </div>
                <div class="flex items-center h-16 border-l-4 border-gray-400">
                  <span class="text-4xl text-gray-400 px-4">A.</span>
                </div>
              </div>
              <div>
                <div class="flex items-center h-16">
                  <span class="text-lg text-blue-600 font-bold">
                  How can I effortlessly track my posture data?
                  </span>
                </div>
                <div class="flex items-center py-6">
                  <span class="text-gray-500">
                  By simply opening your camera and not navigating through multiple pages, 
                  our posture tracking website captures your data seamlessly.
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex">
              <div>
                <div class="flex items-center h-16 border-l-4 border-blue-600">
                  <span class="text-4xl text-blue-600 px-4">Q.</span>
                </div>
                <div class="flex items-center h-16 border-l-4 border-gray-400">
                  <span class="text-4xl text-gray-400 px-4">A.</span>
                </div>
              </div>
              <div>
                <div class="flex items-center h-16">
                  <span class="text-lg text-blue-600 font-bold">
                  What happens if my camera fails to detect me while using Posdee?
                  </span>
                </div>
                <div class="flex items-center py-2">
                  <span class="text-gray-500">
                  If your camera cannot detect you, your posture data will not be updated. 
                  We advise users to remain active and maintain good posture to ensure the camera captures your data accurately.
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex">
              <div>
                <div class="flex items-center h-16 border-l-4 border-blue-600">
                  <span class="text-4xl text-blue-600 px-4">Q.</span>
                </div>
                <div class="flex items-center h-16 border-l-4 border-gray-400">
                  <span class="text-4xl text-gray-400 px-4">A.</span>
                </div>
              </div>
              <div>
                <div class="flex items-center h-16">
                  <span class="text-lg text-blue-600 font-bold">
                  How can I sign out of the website?
                  </span>
                </div>
                <div class="flex items-center py-6">
                  <span class="text-gray-500">
                  To sign out, click on the signout button located under your profile picture button to end your website session.
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex">
              <div>
                <div class="flex items-center h-16 border-l-4 border-blue-600">
                  <span class="text-4xl text-blue-600 px-4">Q.</span>
                </div>
                <div class="flex items-center h-16 border-l-4 border-gray-400">
                  <span class="text-4xl text-gray-400 px-4">A.</span>
                </div>
              </div>
              <div>
                <div class="flex items-center h-16">
                  <span class="text-lg text-blue-600 font-bold">
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
                <div class="flex items-center h-16 border-l-4 border-blue-600">
                  <span class="text-4xl text-blue-600 px-4">Q.</span>
                </div>
                <div class="flex items-center h-16 border-l-4 border-gray-400">
                  <span class="text-4xl text-gray-400 px-4">A.</span>
                </div>
              </div>
              <div>
                <div class="flex items-center h-16">
                  <span class="text-lg text-blue-600 font-bold">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
