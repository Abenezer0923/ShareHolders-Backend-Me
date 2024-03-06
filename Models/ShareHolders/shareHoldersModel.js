import mongoose, { Schema } from "mongoose";

const shareHolderSchema = new Schema({
  first_name: String,
  middle_name: String,
  last_name: String,
  agent: {
    type: Schema.Types.ObjectId,
    ref: "agent",
  },
  address: String,
  house_number: String,
  state: String,
  city: String,
  country: String,
  zipCode: String,
  email: String,
  phone: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
},{
    timestamps: true
});

const shareHolders = mongoose.model('shareHolders', shareHolderSchema);
export default shareHolders;
