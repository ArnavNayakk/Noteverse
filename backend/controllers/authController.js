import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import validator from 'validator';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtp = async (req, res) => {
  const { email, name, dob } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });
  if (!validator.isEmail(email)) return res.status(400).json({ message: 'Invalid email format' });

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); 

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ email, name, dob, otp, otpExpiry });
  } else {
    user.otp = otp;
    user.otpExpiry = otpExpiry;
  }

  await user.save();

  try {
    await sendEmail(
      email,
      'Your OTP for Login',
      `Hello,\n\nYour OTP is: ${otp}\n\nIt is valid for 5 minutes.\n\nBest,\nTeam`
    );
    res.status(200).json({ message: 'OTP sent successfully to your email.' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: 'Failed to send OTP. Try again.' });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  try {
    await sendEmail(
      email,
      'Your OTP for Login',
      `Hello,\n\nYour OTP is: ${otp}\n\nIt is valid for 5 minutes.\n\nBest,\nTeam`
    );
    res.status(200).json({ message: 'OTP resent successfully.' });
  } catch (err) {
    console.error('Error resending OTP:', err);
    res.status(500).json({ message: 'Failed to resend OTP. Try again.' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name || '',
      dob: user.dob || '',
    },
  });
};

export const googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name });
      await user.save();
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name || '',
        dob: user.dob || '',
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(401).json({ message: 'Invalid Google token' });
  }
};
