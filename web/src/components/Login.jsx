import React from 'react'
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HeroImage from '../styles/posedee-feature-image1.gif';

AOS.init();


function Login() {
  return (
        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-15">

              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-10">
            <h1 className="h1 mb-6" data-aos="fade-up" data-aos-delay="250" data-aos-duration="4000">Welcome to PoseDee. <span class="wave">👋</span></h1>
            <p className="text-xl text-gray-400" data-aos="fade-up" data-aos-delay="400" data-aos-duration="4000">With the busy and often sedentary lifestyle that many of us lead, it's more important than ever to prioritize our posture for our physical health and overall well-being.</p>
          </div>
              {/* Login */}
            <div className="max-w-sm mx-auto" data-aos="fade-up" data-aos-delay="500" data-aos-duration="5000">
            <a class="log" href="http://127.0.0.1:5000/Oauth">
                      <button className="btn px-0 text-white bg-red-600 hover:bg-red-700 w-full relative flex items-center">
                        <svg className="w-4 h-4 fill-current text-white opacity-75 shrink-0 mx-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" />
                        </svg>
                        <span className="h-6 flex items-center border-r border-white border-opacity-25 mr-4" aria-hidden="true"></span>
                        <span className="flex-auto pl-16 pr-8 -ml-16">Sign in with Google</span>
                      </button>
            </a>
                <div className="text-gray-400 text-center mt-6">
                  Don’t you have an account? <Link to="https://accounts.google.com/v3/signin/identifier?dsh=S-938716802%3A1678190622213548&continue=https%3A%2F%2Fwww.google.com%3Fhl%3Den-US&ec=GAlA8wE&hl=en&flowName=GlifWebSignIn&flowEntry=AddSession" className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out">Sign up</Link>
                </div>
              </div>
            </div>
            
            {/* Hero image */}
            <div data-aos="fade-up" data-aos-delay="600" data-aos-duration="5000">
            <img className="mx-auto" src={HeroImage} width="1024" height="504" alt="Hero" />
            
            </div> 
          </div> 
        </section>
  )
}

export default Login
