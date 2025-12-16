import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { openSignIn } = useClerk()

  return (
    <div className="fixed z-50 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32 border-b border-white/10
">

      {/* Logo + Brand */}
     <div
  className="flex items-center gap-2 cursor-pointer select-none"
  onClick={() => navigate('/')}
>
  <img
    src={assets.logo}
    alt="CraftMind logo"
    className="w-10 h-10  drop-shadow-[0_0_8px_rgba(99,102,241,0.6)] sm:w-12 sm:h-12"
  />
   <span
  className="text-white font-semibold text-xl sm:text-2xl tracking-wide"
  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
>
  Craft<span className="text-primary">Mind</span>.ai
</span>

</div>

{/* Right side */}
{
  user ? (
    <UserButton />
  ) : (
    <>
      {/* Desktop button */}
      <button
        onClick={openSignIn}
        className="hidden sm:flex items-center gap-2 rounded-full text-sm
                   cursor-pointer bg-primary text-white
                   px-6 py-2.5 hover:scale-105 transition"
      >
        Get started
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Mobile button */}
      <button
        onClick={openSignIn}
        className="sm:hidden text-sm font-medium
                   bg-primary text-white
                   px-4 py-2 rounded-full"
      >
        Sign up
      </button>
    </>
  )
}
</div>

  )
}

export default Navbar
