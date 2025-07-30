import React from 'react'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router'

function Navbar() {
    const navigate = useNavigate();

  return (
    
    <div className="px-4 sm:px-6 lg:px-10">
      <div className="flex items-center justify-between my-4 mb-5 w-full">
        
        <div className="flex items-center  md:gap-40">
          <img src={logo} alt="logo" className="h-10 w-10" />
          <p className=" text-3xl px-10 sm:px-8  font-semibold">Dashboard</p>
        </div>

        <p onClick={()=>navigate('/login')}  className="font-semibold text-blue-600 hover:text-blue-700 hover:cursor-pointer border-b text-lg whitespace-nowrap">
          Sign Out
        </p>
      </div>
    </div>
  )
}

export default Navbar





