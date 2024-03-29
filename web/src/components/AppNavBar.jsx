import React, { useState, useEffect, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import useCookie, { setCookie } from "react-use-cookie";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import { Link } from 'react-router-dom';

export default function AppNavBar() {
  const [userinfo, setUserInfo] = useCookie("userinfo", "");
  const [isCameraOn, setIsCameraOn] = useState(false);

  const RemoveCookie = (locale) => {
    setCookie("userinfo", locale, {
      days: 0,
    });
  };

    const initialState = [
      { name: "Tracking System", href: "/track", current: true },
      { name: "FAQ", href: "/faq", current: false },
      { name: "Posture Overviews", href: "#", current: false},
      { name: "Our Approach", href: "#", current: false},
    ];
  
    const [navigation, setNavigation] = useState(() => {
      const storedNavigation = localStorage.getItem("navigation");
      return storedNavigation ? JSON.parse(storedNavigation) : initialState;
    });
  
    useEffect(() => {
      localStorage.setItem("navigation", JSON.stringify(navigation));
    }, [navigation]);
  
    const handleClick = (index) => {
      if (index === 2) {
        window.open("http://127.0.0.1:5000/dashboard/" + JSON.parse(userinfo).id);
        return; // do nothing if index 2 is clicked
      }
      if (index === 3) {
        window.open("https://github.com/SlickleZ/PoseDee");
        return; // do nothing if index 3 is clicked
      }
      
      fetch('/stop_camera')
      .then(() => {
          setIsCameraOn(false);
          localStorage.setItem('isCameraOn', false);
          // window.location.reload(false);
      })
      .catch(console.error);

      setNavigation((prevState) =>
        prevState.map((item, i) =>
          i === index ? { ...item, current: true } : { ...item, current: false }
        )
      );
    };

  const userNavigation = [{ name: "Sign out", href: "#" }];

  
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  // console.log(navigation);

  function handleStopClick() {
    fetch('/stop_camera')
        .then(() => {
            setIsCameraOn(false);
            // localStorage.setItem('isCameraOn', false);
            // window.location.reload(false);
        })
        .catch(console.error);
}

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-15 items-center justify-between">
                  {/* <div className="flex items-center"> */}
                  {/* Have to click multiple times to change current values --fixed*/}
                  <Link onClick={() => {handleClick(0); window.location.href="/track";}}>
                    <div className="py-1 flex-shrink-0 items-center">
                        <lord-icon
                          src="https://cdn.lordicon.com/zlyxhzar.json"
                          trigger="loop-on-hover"
                          colors="primary:#ffffff"
                          //scale="59"
                          style={{ width: "35px", height: "35px"}}>
                        </lord-icon>
                    </div>
                    </Link>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4 myClickable">
                        {navigation.map((item,index) => (
                          <a
                            key={item.name}
                            // href={item.href}
                            // target={item.target}
                            onClick={() => {handleClick(index); 
                              window.location.href=item.href;
                            }}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 transition ease-in-out delay-90 hover:-translate-y-1 hover:scale-100 duration-250 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  {/* </div> */}
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">

                      {/* Bell Button */}
                      <button
                        type="button"
                        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white hover:outline-none hover:ring-2 hover:ring-white hover:ring-offset-2 hover:ring-offset-gray-800
                        transition ease-in-out delay-150"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}

                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button
                            className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm 
                          hover:outline-none hover:ring-2 hover:ring-white hover:ring-offset-2 hover:ring-offset-gray-800
                          transition ease-in-out delay-150"
                          >
                            <span className="sr-only">Open user menu</span>

                            <img
                              className="h-8 w-8 rounded-full"
                              src={JSON.parse(userinfo).picture}
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-fit origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div class="px-4 py-2 text-right text-sm text-gray-900 ">
                              <div>Hi, {JSON.parse(userinfo).name} 😄</div>
                              <div class="font-medium truncate">
                                {JSON.parse(userinfo).email}
                              </div>
                              <a class="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700p"></a>
                            </div>

                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    // target={item.target}
                                    onClick={() => {
                                      RemoveCookie();
                                      localStorage.clear();
                                      handleStopClick();
                                      window.location.href = "/";
                                    }}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-right text-gray-700 "
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3 myClickable">
                  {navigation.map((item,index) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      onClick={() => {handleClick(index); window.location.href=item.href;}}
                      // target={item.target}
                      // href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={JSON.parse(userinfo).picture}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="my-1 text-base text-left font-medium leading-none text-white">
                        {JSON.parse(userinfo).name}
                      </div>
                      <div className="text-sm text-left font-medium leading-none text-gray-400">
                        {JSON.parse(userinfo).email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        onClick={() => {
                          RemoveCookie();
                          localStorage.clear();
                          handleStopClick();
                          window.location.href = "/";
                        }}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
