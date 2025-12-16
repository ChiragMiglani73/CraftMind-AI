import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { SignIn, useUser } from '@clerk/clerk-react';

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className='flex flex-col items-start justify-start h-screen bg-[#0f0f1b] text-white'>

     {/* Nav */}
<nav className="w-full px-6 sm:px-20 xl:px-10 h-16 flex items-center justify-between
                border-b border-white/10 bg-[#0f0f1b] backdrop-blur">

  {/* Left: Logo + Text */}
  <div
    onClick={() => navigate('/')}
    className="flex items-center gap-2 cursor-pointer"
  >
    <img
      src={assets.logo}
      alt="CraftMind logo"
      className="w-8 h-8 sm:w-9 sm:h-9"
    />
    <span className="text-white font-semibold text-lg tracking-tight">
      Craft<span className="text-primary">Mind</span>.ai
    </span>
  </div>

  {/* Right: Menu toggle (mobile only) */}
  <div className="sm:hidden">
    {sidebar ? (
      <X
        onClick={() => setSidebar(false)}
        className="w-6 h-6 text-gray-300 cursor-pointer"
      />
    ) : (
      <Menu
        onClick={() => setSidebar(true)}
        className="w-6 h-6 text-gray-300 cursor-pointer"
      />
    )}
  </div>

</nav>


      {/* Main layout */}
      <div className='flex-1 w-full flex h-[calc(100vh-64px)]'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className='flex-1 bg-[#1c1c2e] text-white'>
          <Outlet />
        </div>
      </div>

    </div>
  ) : (
    <div className='flex items-center justify-center h-screen bg-[#0f0f1b] text-white'>
      <SignIn />
    </div>
  );
};

export default Layout;
