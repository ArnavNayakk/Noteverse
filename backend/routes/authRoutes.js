import express from 'express';
import { sendOtp, verifyOtp, googleLogin,checkUser  } from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/google', googleLogin);
router.post('/check-user', checkUser);



export default router;
