import React from 'react'
import { Link } from 'react-router-dom';

function getCurrentURL () {
  return window.location.href
}
function Error404() {
  const url = getCurrentURL()

  return (
  <div class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row" 
    data-aos="zoom-in" data-aos-delay="150">
            <div class="xl:pt-24 xl:w-1/2 relative lg:pb-0">
                <div>
                    <div class="absolute">
                        <div class=" text-center">
                            <h1 class="my-2 text-gray-800 font-bold text-3xl">
                            Page not found.</h1>
                            <p class="my-8 text-gray-800">The Requested <a class="text-emerald-600">{url}</a> was not found. <br></br>Sorry about that! Please visit our hompage to get where you need to go.</p>
                            <Link to="/" className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 border-transparent px-4 py-2 my-2 rounded-sm text-white bg-emerald-600 hover:bg-emerald-400 transition duration-150 ease-in-out">Take me to homepage!</Link>
                        </div>
                    </div>
                    <img src="https://i.ibb.co/G9DC8S0/404-2.png"/>
                </div>
            </div>
            <img src="https://media2.giphy.com/media/ykaNntbZ3hfsWotKmA/giphy.gif" width="400px"/>
        </div>
  )
}

export default Error404


