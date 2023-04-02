import React from 'react'
import ScrollToTop from "react-scroll-to-top";
import AOS from 'aos';
import 'aos/dist/aos.css';
import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';

// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

AOS.init();

function ScrollToTopComp() {
    return (
        <div>
            {/* Scroll to top */}
            <ScrollToTop data-aos="fade-up"
                smooth viewBox="0" component={
                    <lord-icon
                        src="https://cdn.lordicon.com/xdakhdsq.json"
                        trigger="loop-on-hover"
                        colors="primary:#22c55e"
                        style={{ width: "25px", height: "25px" }}>
                    </lord-icon>} />
        </div>
    )
}

export default ScrollToTopComp
