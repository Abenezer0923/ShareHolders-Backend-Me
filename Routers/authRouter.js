import express from "express";
const router = express.Router();
import {
    login, 
    verifyOtp,
   
    forgotPassword,
    restPasswords, 
    updatePassword,}  from '../Controller/Auth/authController.js';
import { localVariables } from "../middleware/authRestHandler.js";

router.post('/login', login);
router.post("/verifyOTP", verifyOtp);


router.post('/forgot-password', forgotPassword);
router.post('/reset_password/:id/:token', restPasswords)
router.post('/updatePassword', updatePassword);




export default router;


