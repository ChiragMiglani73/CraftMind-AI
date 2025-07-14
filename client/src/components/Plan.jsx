import React from 'react'
import { PricingTable } from '@clerk/clerk-react'

const Plan = () => {
  return (
    <div className='bg-[#0f0f1b] py-24'> {/* <- full-width dark background wrapper */}
      <div className='max-w-2xl mx-auto z-20 text-white'>

        <div className='text-center'>
          <h2 className='text-[42px] font-semibold text-white'>Choose Your Plan</h2>
          <p className='text-gray-400 max-w-lg mx-auto'>
            Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
          </p>
        </div>

        <div className='mt-14 max-sm:mx-8 dark-pricing-wrapper'>
          <PricingTable />
        </div>

      </div>
    </div>
  )
}

export default Plan
