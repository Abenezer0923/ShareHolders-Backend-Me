import mongoose from "mongoose";

const OtpSchema = mongoose.Schema(
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


const Otp = mongoose.model('Otp', OtpSchema);

export default Otp;
