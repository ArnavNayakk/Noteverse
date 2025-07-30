import React from 'react'
import { Route, Routes } from 'react-router';
import Home from './pages/Home'
import Login from './pages/Login'

import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <div className=' '>
     <ToastContainer/>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
     </Routes>
    </div>
  )
}

export default App