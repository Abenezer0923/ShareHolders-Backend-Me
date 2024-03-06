import express from 'express';
const router = express.Router();

import {getDashBord} from "../Controller/ShareHolders/shareHoldersControllers.js";
import {protect} from '../middleware/authHandler.js';

router.route('/dashBoard').get(protect,getDashBord);

export default router