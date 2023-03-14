import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Login from '../components/Login';
import PageIllustration from '../components/PageIllustration';
import FeaturesBlocks from '../components/FeaturesBlocks';

function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/*  Site header */}
      <Header />
      {/*  Page content */}
      <main className="grow">
        {/*  Page illustration */}
        <div className="relative max-w-6xl mx-auto h-0 pointer-events-none" aria-hidden="true">
          <PageIllustration />
        </div>
      <Login />
      <FeaturesBlocks/>

      </main>
    </div>
  );
}

export default Home;