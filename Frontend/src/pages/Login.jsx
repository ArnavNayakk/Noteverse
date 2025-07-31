import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import side from '../assets/side.png';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    otp: '',
  });

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleOtpClick = async () => {
    if (!showOtpInput) {
      if (isSignup) {
        if (!formData.name || !formData.dob || !formData.email) {
          toast.error('Please fill all required fields!');
          return;
        }
      } else {
        if (!formData.email) {
          toast.error('Please enter your email!');
          return;
        }
      }

      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`, {
          email: formData.email,
          ...(isSignup && {
            name: formData.name,
            dob: formData.dob,
          }),
        });

        toast.success('OTP sent to your email!');
        setShowOtpInput(true);
        setResendTimer(30);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send OTP');
      }
    } else {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`, {
          email: formData.email,
          otp: formData.otp,
        });

        const payload = jwtDecode(res.data.token);
        console.log('JWT Payload:', payload);


        if (keepLoggedIn) {
          localStorage.setItem('token', res.data.token);
          console.log(res.data.token)
          localStorage.setItem('hd_user', JSON.stringify(res.data.user));
        } else {
          sessionStorage.setItem('token', res.data.token);
          sessionStorage.setItem('hd_user', JSON.stringify(res.data.user));
        }

        toast.success('Login successful!');
        setTimeout(() => navigate('/'), 1000);
      } catch (error) {
        toast.error(error.response?.data?.message || 'OTP verification failed');
      }
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`, {
        email: formData.email,
      });

      toast.success('OTP resent to your email!');
      setResendTimer(30);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setShowOtpInput(false);
    setShowOtp(false);
    setFormData({ name: '', dob: '', email: '', otp: '' });
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
        credential,
      });

      const { token, user } = res.data;

      if (keepLoggedIn) {
        localStorage.setItem('token', token);
        localStorage.setItem('hd_user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('hd_user', JSON.stringify(user));
      }

      toast.success('Google login successful!');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="w-full md:w-1/2 flex flex-col px-10 pt-8">
        <div className="flex items-center gap-2 mb-10 self-center md:self-auto">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <p className="font-semibold text-xl">HD</p>
        </div>

        <div className="max-w-sm mx-auto w-full pt-10">
          <div className="text-center md:text-left mb-6">
            <h2 className="text-3xl font-bold mb-2">
              {isSignup ? 'Sign up' : 'Sign in'}
            </h2>
            <p className="text-gray-500">
              {isSignup ? 'Sign up to enjoy the feature of HD' : 'Welcome back to HD'}
            </p>
          </div>

          <form className="space-y-6">
            {isSignup && (
              <>
                <div className="relative w-full">
                  <label htmlFor="name" className="absolute left-4 -top-2 bg-white px-1 text-sm text-gray-500 z-10">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 pt-6 pb-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="relative w-full">
                  <label htmlFor="dob" className="absolute left-4 -top-2 bg-white px-1 text-sm text-gray-500 z-10">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    id="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                    className="w-full px-4 pt-6 pb-2 text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="relative w-full">
              <label htmlFor="email" className="absolute left-4 -top-2 bg-white px-1 text-sm text-gray-500 z-10">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 pt-6 pb-2 text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {showOtpInput && (
              <>
                <div className="relative w-full">
                  <label htmlFor="otp" className="absolute left-4 -top-2 bg-white px-1 text-sm text-gray-500 z-10">
                    OTP
                  </label>
                  <input
                    type={showOtp ? 'text' : 'password'}
                    id="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="w-full px-4 pt-6 pb-2 pr-12 text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowOtp(!showOtp)}
                  >
                    {showOtp ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>

                {!isSignup && (
                  <div className="mt-2 text-left">
                    <button
                      type="button"
                      className={`text-blue-600 underline text-sm font-medium hover:text-blue-800 disabled:text-gray-400`}
                      onClick={resendOtp}
                      disabled={resendTimer > 0}
                    >
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="keepLoggedIn"
                    checked={keepLoggedIn}
                    onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                    className="mr-2"
                  />
                  <label htmlFor="keepLoggedIn" className="text-sm text-black">
                    Keep me logged in
                  </label>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={handleOtpClick}
              className="w-full bg-blue-500 text-white font-semibold rounded-xl py-3 hover:bg-blue-600 transition"
            >
              {showOtpInput ? (isSignup ? 'Sign Up' : 'Sign In') : 'Get OTP'}
            </button>
          </form>

          <div className="my-6 text-center">
            <p className="text-gray-500 mb-2">or</p>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error('Google login failed')}
              useOneTap
            />
          </div>

          <p className="text-sm text-gray-500 mt-6 text-center">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              onClick={toggleMode}
              className="text-blue-600 font-semibold text-lg hover:underline cursor-pointer"
            >
              {isSignup ? 'Sign in' : 'Create one'}
            </span>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 h-screen">
        <img
          src={side}
          alt="Signup Background"
          className="w-full h-full object-contain object-top rounded-b-2xl"
        />
      </div>
    </div>
  );
}

export default Login;