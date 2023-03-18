import React from "react";
import { Link } from "react-router-dom";

import HomeLogin from "../components/HomeLogin";
import PageIllustration from "../components/PageIllustration";
import HomeFeaturesBlocks from "../components/HomeFeaturesBlocks";
import HomeNavBar from "../components/HomeNavBar";
import ScrollToTop from "../components/ScrollToTop";

function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <ScrollToTop />
      <HomeNavBar />

      {/*  Page content */}
      <main className="grow">
        {/*  Page illustration */}
        <div
          className="relative max-w-6xl mx-auto h-0 pointer-events-none"
          aria-hidden="true"
        >
          <PageIllustration />
        </div>
        <HomeLogin />
        <HomeFeaturesBlocks />
      </main>
    </div>
  );
}

export default Home;
