import mongoose, {Schema} from "mongoose";

const paymentSchema = new mongoose.Schema({
    shareHolder: {
      type: Schema.Types.ObjectId,
      ref: "shareHolder",
    },
  
    shareInfo: {
      type: Schema.Types.ObjectId,
      ref: "shareInfo",
    },
  
    percentage: {
      type: String,
      default: "0",
    },
    amountPaid: Number,
    amountSubscribed: Number,
},{
    timestamps:true
});

const payment = mongoose.model("payment", paymentSchema);

export default payment;