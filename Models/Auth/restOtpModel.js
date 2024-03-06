import mongoose from "mongoose";

const restOtpSchema = mongoose.Schema(
  {
    email: String,
    otp: String,
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


const resetOTP = mongoose.model('restOTP', restOtpSchema);

export default resetOTP;