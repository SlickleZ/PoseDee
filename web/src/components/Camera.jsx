import React from 'react'
import "../styles/App.css";
import HeroImage from '../styles/posedee-feature-image1.gif';

function Camera() {
    return (
        <div className = "App">
            <div className="py-10" data-aos="fade-up" data-aos-delay="200" data-aos-duration="300">
                <img className="mx-auto" src={HeroImage} width="1024" height="504" alt="Hero" />
            </div>

        </div>
        
    )
}

export default Camera
