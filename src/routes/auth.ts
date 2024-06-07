import express from "express";
import { sendOTP } from "../controllers/auth";

const router = express.Router();

router.post("/sendOTP", sendOTP);
router.post("/verifyOTP");

export default router;
