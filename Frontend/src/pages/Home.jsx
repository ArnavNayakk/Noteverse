import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Users from '../components/Users';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success('Login successful!');
    }
  }, [location]);

  return (
    <div className='bg-white'>
      <ToastContainer />
      <Navbar />
      <Users />
    </div>
  );
}

export default Home;
