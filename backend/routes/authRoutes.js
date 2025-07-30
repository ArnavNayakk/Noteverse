import express from 'express';
import { sendOtp, verifyOtp, googleLogin  } from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/google', googleLogin);


export default router;
