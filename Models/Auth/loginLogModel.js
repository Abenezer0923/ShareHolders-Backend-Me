import mongoose, {Schema} from "mongoose";

const loginsSchema = new mongoose.Schema({
    ip: {
        type: String,
      },
      device: {
        type: String,
      },
      user_agent: {
        type: String,
      },
      user_type: {
        type: String,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
},{
    timestamps: true
})
const login = mongoose.model('login', loginsSchema);
export default login;