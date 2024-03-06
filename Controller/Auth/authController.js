import UserModel from "../../Models/Auth/UserModel.js";
import OtpModel from "../../Models/Auth/OtpModel.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import loginLogModel from "../../Models/Auth/loginLogModel.js";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer"; 
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken.js";

import fs from "fs";
import hbs from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Password Checker
const isPasswordCorrect = async (pass1, pass2) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass1, pass2, (err, result) => {
      resolve(result);
    });
  });
};

const PB_email = process.env.SENDER_GMAIL_ADDRESS;
const pass = process.env.SENDER_GMAIL_PASSWORD;

const email_info = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "abnew0923@gmail.com", // Use your Gmail email address
    pass: "mrfewpltrafipslo", // Use your Gmail password
  },
});

const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

const filePath = path.join(__dirname, "../../email/otp.html");
const restFilePath  = path.join(__dirname, "../../email/restOtp.html");

const login = asyncHandler(async (req, res) => {
  const body = req.body;
  const email = body.username.toLowerCase();
  let user = await UserModel.findOne({ email: email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: `Incorrect Credential!`,
    });
  } else {
    ////console.log(await isPasswordCorrect(body.password, user.password));
    if (await isPasswordCorrect(body.password, user.password)) {
      // //console.log(logins)
      let otp = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);
      let new_otp = new OtpModel({
        email: req.body.username,
        otp: otp,
      });

      let newOtp = await new_otp.save();

      if (!newOtp) {
        return res.status(200).json({
          success: false,
          message: `OTP not Sent successfully!`,
        });
      } else {
        try {
          readHTMLFile(filePath, function (err, html) {
            const template = hbs.compile(html);
            const replacements = {
              otp: otp,
            };
            const htmlToSend = template(replacements);
            const email = {
              from: PB_email,
              to: user.email,
              subject: "PurposeBlack ETH ShareHolder OTP",
              html: htmlToSend,
            };
            email_info.sendMail(email, (error, info) => {
              if (error) {
                console.log(error);
                console.log("email not sent!");
                return res.status(200).json({
                  success: false,
                  message: `OTP not Sent successfully!`,
                });
              } else {
                console.log(info);
                return res.status(201).json({
                  success: true,
                  message: "OTP Sent successfully!",
                });
              }
            });
          });
        } catch (error) {
          console.log(error);
          return res.status(200).json({
            success: true,
            message: `OTP Sent successfully!`,
          });
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        message: `Incorrect Credential!`,
      });
    }
  }
});
// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
};


// const verifyOtp = asyncHandler(async (req, res) => {
//   const userOTP = req.body.otp;
//   try {
//     let otp = await OtpModel.findOne({ otp: userOTP, status: false });

//     if (!otp) {
//       return res.status(400).json({
//         success: false,
//         message: `Wrong OTP, please try again`,
//       });
//     }

//     let user = await UserModel.findOne({ email: otp.email });
//     const userAgent = req.headers["user-agent"];
      
//     var logins = new loginLogModel({
//       ip: req.connection.remoteAddress,
//       // device: s.os.name + " " + s.os.version + " " + s.browser.name,
//       user_agent: userAgent,
//       user_type: user.role,
//       user: user._id,
//     });
//     otp.status = true;
//     await otp.save();

//     let loginLog = await logins.save();

//     if (!loginLog) {
//       return res.status(500).json({
//         message: "Error when creating logins",
//       });
//     }

//     generateToken(res, user._id);

//     return res.status(200).json({
//       success: true,
//       message: `Sign In Successful`,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// });

const verifyOtp = asyncHandler(async (req, res) => {
  const userOTP = req.body.otp;
  // const storageType = req.body.storageType || 'auto';

  try {
      let otp = await OtpModel.findOne({ otp: userOTP, status: false });

      if (!otp) {
          return res.status(400).json({
              success: false,
              message: `Wrong OTP, please try again`,
          });
      }

      let user = await UserModel.findOne({ email: otp.email });
      const userAgent = req.headers["user-agent"];

      var logins = new loginLogModel({
          ip: req.connection.remoteAddress,
          user_agent: userAgent,
          user_type: user.role,
          user: user._id,
      });
      otp.status = true;
      await otp.save();

      let loginLog = await logins.save();

      if (!loginLog) {
          return res.status(500).json({
              message: "Error when creating logins",
          });
      }

      // Use the updated generateToken function with auto-detection
      const token = generateToken(res, user._id);

      return res.status(200).json({
          success: true,
          message: `Sign In Successful`,
          token: token,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: "Internal Server Error",
          error: error.message,
      });
  }
});



const forgotPassword = asyncHandler(async (req, res) => {
  const {email} = req.body
  UserModel.findOne({email: email})
  .then(user => {
    if(!user){
      return res.send({status: "User is not found"})
    }
    const token = jwt.sign({id: user._id},"jwt_secret_key", {expiresIn:"1d"})

    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "abnew0923@gmail.com", // Use your Gmail email address
        pass: "mrfewpltrafipslo", // Use your Gmail password
      },
    });

    var mailOptions = {
      from: PB_email,
      to: user.email,
      subject: 'Reset Password Link',
      text: `http://localhost:3000/auth/resetPassword/${user._id}/${token}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        return res.send({Status: "Success"})
      }
    });
      
    

  })
})

const restPasswords = asyncHandler(async(req, res) => {
  const {id, token} = req.params
  const {password} = req.body
  jwt.verify(token, "jwt_secret_key", (err, decoded) =>{
    if(err) {
      return res.json({Status: "Error with token"})
    } else {
      bcrypt.hash(password, 10)
      .then(hash => {
          UserModel.findByIdAndUpdate({_id: id}, {password: hash})
          .then(u => res.send({Status: "Success"}))
          .catch(err => res.send({Status: err}))
      })
      .catch(err => res.send({Status: err}))
  }

  })
  
});

const updatePassword = asyncHandler(async (req, res) => {

  const email = req.body.username
  
  const { oldPassword, newPassword } = req.body;

  let user = await UserModel.findOne({ email: email });

  // Check if the provided old password matches the existing password
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ status: "Error", message: "Old password is incorrect" });
  }

  // Hash the new password and update it in the database
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return res.json({ status: "Success", message: "Password updated successfully" });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/images"); // Set the destination folder for uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set unique filenames
  },
});

const upload = multer({ storage: storage });

const uploadImage = asyncHandler(upload.single("image"), async (req, res) => {
  const userId = req.user.id; // Assuming you have middleware to extract user ID from the token.

  // Save the file path or details in the user document in the database
  const imagePath = req.file.path;

  // Update the user document with the image path
  await UserModel.findByIdAndUpdate(userId, { $set: { profileImage: imagePath } });

  return res.json({ status: "Success", message: "Image uploaded successfully" });
});



export {
  forgotPassword,
  login,
  verifyOtp,
  updatePassword,
  restPasswords,
  uploadImage,
  logoutUser,

};
