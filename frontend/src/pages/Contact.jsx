import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className="text-gray-700 font-medium">US</span></p>
      </div>

      <div className='flex flex-col md:flex-row my-10 justify-center gap-10 m-28 text-sm'>
        <img className='w-full md:max-w-[360px]'  src={assets.contact_image} alt="" />
        <div className='flex flex-col items-start gap-6 justify-center'>
           <p className='font-semibold text-lg text-gray-600'>OUR OFFICE</p>
           <p className='text-gray-500'>2346 Down Town Street <br /> Chandigarh, India</p>
           <p className='text-gray-500'>Tel:(+91)81680-04947 <br /> Email : krishsangwan100@gmail.com</p>
           <p className='text-gray-600 text-lg font-semibold'>CAREER AT PRESCRIPTO</p>
           <p className='text-gray-500'>Learn more about our teams and job openings</p>
           <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 cursor-pointer'>Explore Jobs</button>
        </div>
      </div>


    </div>
  )
}

export default Contact