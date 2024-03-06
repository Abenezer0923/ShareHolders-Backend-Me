import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: String,
  phone: String,
  password: String,
  role: {
    type: String,
    default: "USER",
  },
}, {
  timestamps: true,
});

const User = mongoose.model('Users', UserSchema);

export default User;
