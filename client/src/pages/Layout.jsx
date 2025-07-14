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
      <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-700 bg-[#0f0f1b]'>
        <img
          className='cursor-pointer w-40 sm:w-60'
          src={assets.logo}
          alt="logo"
          onClick={() => navigate('/')}
        />
        {
          sidebar ? (
            <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-300 sm:hidden' />
          ) : (
            <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-300 sm:hidden' />
          )
        }
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
