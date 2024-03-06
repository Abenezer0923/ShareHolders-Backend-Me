import mongoose, { Schema } from "mongoose";


const shareInfoSchema = new mongoose.Schema({
    numberOfShare: Number,
    amountSubscribed: Number,
    shareCatagory: String,
    shareType: String,
    shareHolder: {
      type: Schema.Types.ObjectId,
      ref: "shareHolder",
    },
    paymentStarted: {
       type: Boolean,
       default: false,
    },
    paymentCompleted: {
       type: Boolean,
       default: false,
    },
},{
    timestamps:true
});

const shareInfo = mongoose.model('shareInfo', shareInfoSchema);
export default shareInfo;


