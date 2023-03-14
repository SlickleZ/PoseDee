import React from 'react'
import Header from '../components/Header';
import { Link } from 'react-router-dom';

function getCurrentURL () {
  return window.location.href
}
function Error404() {
  const url = getCurrentURL()

  return (
  <div class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16" data-aos="zoom-in" data-aos-delay="150">
            <div class="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
                <div class="relative">
                    <div class="absolute">
                        <div class=" text-center">
                            <h1 class="my-5 text-gray-800 font-bold text-2xl">
                                Looks like you've found the doorway to the great nothing </h1>
                            <p class="my-10 text-gray-800">The Requested <a class="text-purple-600">{url}</a> was not found. <br></br>Sorry about that! Please visit our hompage to get where you need to go.</p>
                            <Link to="/" className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 border-transparent px-4 py-2 my-2 rounded-sm text-white bg-purple-600 hover:bg-purple-700 focus:ring-opacity-50">Take me to homepage!</Link>
                        </div>
                    </div>
                    <div>
                        <img src="https://i.ibb.co/G9DC8S0/404-2.png"  />
                    </div>
                </div>
            </div>
            <div>
                <img src="https://media2.giphy.com/media/ykaNntbZ3hfsWotKmA/giphy.gif"/>
            </div>
        </div>
  )
}

export default Error404


