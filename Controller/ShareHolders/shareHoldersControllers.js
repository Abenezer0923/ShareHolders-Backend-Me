import shareHolders from "../../Models/ShareHolders/shareHoldersModel.js";
import UserModel from "../../Models/Auth/UserModel.js";
import paymentHistoryModel from "../../Models/ShareHolders/paymentHistoryModel.js";
import PaymentModel from "../../Models/Payment/PaymentModel.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import bcrypt from 'bcrypt';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import asyncHandler from "../../middleware/asyncHandler.js";
import shareInfoModel from "../../Models/ShareHolders/shareInfoModel.js";
import shareInfo from "../../Models/ShareHolders/shareInfoModel.js";



const getDashBord = asyncHandler(async (req, res) => {
  const dash_data = {};
  const payment_historys = [];
  

  // Extract user ID from the token in the request cookie
  const token = req.cookies.jwt;
  console.log("whyyy", req)
  console.log("this is the token",token);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Token not provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your-secret-key' with your actual secret key
    const userId = decoded.userId;
    const shareHolder = await shareHolders.findById(userId);
    dash_data.shareHolderInfo = shareHolder;
    let currShareInfo = await shareInfo.find({
      shareHolder: shareHolder._id,
      paymentCompleted: true,
    })
    
    dash_data.currShareInfoInfo = currShareInfo;
  
    let shareTotal = await shareInfo.aggregate([
      {
        $match: {
          shareHolder: {
            $eq: shareHolder._id,
          }
        },
      },
      {
        $group: {
          _id: "$shareCatagory",
          total: {
            $sum: "$amountSubscribed",
          },
        },
      },
    ]);
    dash_data.shareCatagoryTotal = shareTotal;
      let subtotal = await shareInfo.aggregate([
          {
              $match: {
                shareHolder: {
                  $eq: shareHolder._id,
                },
              },
          },
          {
              $group: {
                _id: null,
                subtotal: {
                  $sum: "$amountSubscribed",
                },
              },
          },
  
      ])
      dash_data.subtotal = subtotal[0].subtotal;
      let payment_hy = await PaymentModel.find({
        shareHolder: shareHolder._id
      });
  
      let payment = await PaymentModel.find({
          shareHolder: shareHolder._id,
          percentage: "100%",  
      })
      // console.log("this is payment",payment);
      dash_data.payment = payment;
  
      if(currShareInfo) {
          let currentPayment = await PaymentModel.findOne({
              shareInfo: currShareInfo._id,
          });
          dash_data.completedPayment = currentPayment;
      }
  
      for (var i = 0; i < payment_hy.length; i++){
        let payment_history = await paymentHistoryModel.find({
            payment: payment_hy[i]._id,
          });
  
          for(var j = 0; j < payment_history.length; j++) {
            payment_historys.push(payment_history[j]);
          }
  
      }
  
      dash_data.payment_history = payment_historys;
  
  
    // if (shareHolder) {
    //   res.status(200).json({
    //     _id: shareHolder._id,
    //     name: shareHolder.first_name,
    //     email: shareHolder.email,
    //   });
    // } else {
    //   res.status(404).json({ message: 'User not found' });
    // }
    return res.json({
      success: true,
      data: dash_data
    })

  }catch (error) {
    console.error('Error decoding token:', error);
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
});







export {
    getDashBord
}

