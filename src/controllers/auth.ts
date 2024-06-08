import { NextFunction, Request, Response } from "express";
import Twilio from "twilio";
import AppError from "../utils/AppError";
import { generateFourDigitOTP, generateOTPHash } from "../utils/helper";

const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const twillioAccountSid = process.env.TWILLIO_ACCOUNT_SID;
		const twillioAuthToken = process.env.TWILLIO_AUTH_TOKEN;

		const twillioClient = Twilio(twillioAccountSid, twillioAuthToken);

		const { phoneNumber } = req.body;
		if (!phoneNumber)
			return next(new AppError("provider phoneNumber in body", 400));

		const OTP = generateFourDigitOTP();
		const expiry = Date.now() + 300000; // expiry in 5 minutes
		const hashedOTP = generateOTPHash(phoneNumber, OTP, expiry);

		// we need this client response in logger later on.
		await twillioClient.messages.create({
			body: `OTP for Aidulance is - ${OTP}`,
			to: phoneNumber,
			from: "+13253136381",
		});
		res.status(200).json({
			status: "success",
			message: "OTP sent successfully",
			data: {
				hashedOTP,
				expiry,
			},
		});
	} catch (err: any) {
		next(new AppError(err.message!, 404));
	}
};

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { phoneNumber, otp, hashedOTP, expiry } = req.body;

		if (Date.now() > expiry) {
			return next(new AppError("OTP expired", 401));
		}
		const userHashedOTP = generateOTPHash(phoneNumber, otp, expiry);
		if (hashedOTP !== userHashedOTP) {
			return next(new AppError("Wrong OTP", 401));
		}
		res.status(200).json({
			status: "success",
			message: "OTP verified successfully",
		});
	} catch (err: any) {
		next(new AppError(err.message!, 404));
	}
};

export { sendOTP, verifyOTP };
