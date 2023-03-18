import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';

// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

// header component
function HomeNavBar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const trigger = useRef(null);
  const mobileNav = useRef(null);
  // get scroll position
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', updatePosition);

    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

    //scroll page
    const scrollTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!mobileNav.current || !trigger.current) return;
      if (!mobileNavOpen || mobileNav.current.contains(target) || trigger.current.contains(target)) return;
      setMobileNavOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!mobileNavOpen || keyCode !== 27) return;
      setMobileNavOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });
  function classNames(...classes) {
    return classes.filter(Boolean).join(' '); }

  return (
    <header className="absolute w-full z-30 py-4">
      <div className={classNames(scrollPosition > 0 ? 'shadow-lg' : 'shadow-none', 'transition-shadow mx-auto px-4 sm:px-6 rounded-lg backdrop-blur-lg fixed w-full top-0')}>
        <div className="flex items-center justify-between h-20 ">

          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <Link onClick={scrollTop} className="block" aria-label="Cruip">
              <lord-icon src="https://cdn.lordicon.com/tkuydciy.json"
              trigger="hover" colors="primary:#121331,secondary:#ffffff,tertiary:#ffc738"
              style={{width:'60px', height:'60px'}}>
              </lord-icon>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">

            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <Link to="/signin" className="font-medium text-emerald-600 hover:text-emerald-300 px-4 py-3 flex 
                items-center transition duration-150 ease-in-out">Features</Link>
              </li>
              <li>
                <Link to="/signin" className="font-medium text-emerald-600 hover:text-emerald-300 px-4 py-3 flex 
                items-center transition duration-150 ease-in-out">Features</Link>
              </li>
              {/* <li>
                <Link to="/signup" className="btn-sm text-white bg-emerald-600 hover:bg-emerald-300 ml-3">Tutorials</Link>
              </li> */}
            </ul>

          </nav>

          {/* Mobile menu */}
          <div className="md:hidden">

            {/* Hamburger button */}
            <button ref={trigger} className={`hamburger ${mobileNavOpen && 'active'}`} aria-controls="mobile-nav" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(!mobileNavOpen)}>
              <span className="sr-only">Menu</span>
              <svg className="w-6 h-6 fill-current text-gray-700 hover:text-gray-200 transition duration-150 ease-in-out" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect y="4" width="24" height="2" rx="1" />
                <rect y="11" width="24" height="2" rx="1" />
                <rect y="18" width="24" height="2" rx="1" />
              </svg>
            </button>

            {/*Mobile navigation */}
            <nav id="mobile-nav" ref={mobileNav} className="absolute top-full z-20 left-0 w-full px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out" style={mobileNavOpen ? { maxHeight: mobileNav.current.scrollHeight, opacity: 1 } : { maxHeight: 0, opacity: .8 } }>
              <ul className="bg-gray-20 px-4 py-2">
                <li>
                  <Link to="/signin" className="flex font-medium w-full text-purple-600 hover:text-gray-200 py-2 justify-center">Sign in</Link>
                </li>
                <li>
                  <Link to="/signup" className="font-medium w-full inline-flex items-center justify-center border border-transparent px-4 py-2 my-2 rounded-sm text-white bg-purple-600 hover:bg-purple-700 transition duration-150 ease-in-out">Sign up</Link>
                </li>
              </ul>
            </nav>

          </div>

        </div>
      </div>
    </header>
  );
}

export default HomeNavBar;
