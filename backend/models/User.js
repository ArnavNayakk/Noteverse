import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  dob: String,
  otp: String,
  otpExpiry: Date,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;

