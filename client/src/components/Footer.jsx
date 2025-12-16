import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-[#0f0f1b] text-gray-400 px-6 md:px-16 lg:px-24 xl:px-32 pt-10 w-full mt-20">
      
      {/* Top section */}
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-white/10 pb-8">
        
        {/* Left: Brand */}
        <div className="md:max-w-96">
          <div className="flex items-center gap-3">
            <img
              src={assets.logo}
              alt="CraftMind logo"
              className="h-12 w-12"
            />
            <span className="text-white font-semibold text-xl tracking-tight">
              Craft<span className="text-primary">Mind</span>.ai
            </span>
          </div>

          <p className="mt-6 text-sm leading-relaxed">
            Experience the power of AI with CraftMind.ai.
            Transform your content creation with our suite of premium AI tools.
            Write articles, generate images, and enhance your workflow.
          </p>
        </div>

        {/* Right: Links + Newsletter */}
        <div className="flex-1 flex flex-col sm:flex-row items-start md:justify-end gap-12">
          
          {/* Company links */}
          <div>
            <h2 className="font-semibold mb-5 text-white">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="max-w-sm">
            <h2 className="font-semibold text-white mb-5">
              Subscribe to our newsletter
            </h2>
            <p className="text-sm mb-4">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border border-white/20
                           placeholder-gray-500 text-white
                           focus:ring-2 ring-primary outline-none
                           w-full h-9 rounded px-3 text-sm"
              />
              <button
                className="bg-primary h-9 px-4 text-sm text-white
                           rounded cursor-pointer hover:opacity-90 transition"
              >
                Subscribe
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <p className="pt-4 text-center text-xs sm:text-sm text-gray-500 pb-5">
        © 2025 CraftMind.ai. All Rights Reserved.
      </p>

    </footer>
  )
}

export default Footer
