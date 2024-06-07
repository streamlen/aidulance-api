import { NextFunction, Request, Response } from "express";
import Twilio from "twilio";
import AppError from "../utils/AppError";
import { generateFourDigitOTP } from "../utils/helper";

const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log("in send OTP fucntions");

		const twillioAccountSid = process.env.TWILLIO_ACCOUNT_SID;
		const twillioAuthToken = process.env.TWILLIO_AUTH_TOKEN;

		const twillioClient = Twilio(twillioAccountSid, twillioAuthToken);

		const { mobileNumber } = req.body;
		if (!mobileNumber)
			return next(new AppError("provider mobileNumber in body", 400));

		const OTP = generateFourDigitOTP();
		const message = await twillioClient.messages.create({
			body: `OTP for Aidulance is - ${OTP}`,
			to: mobileNumber,
			from: "+13253136381",
		});
		console.log(message);
		res.status(200).json({
			status: "success",
			message: "OTP sent successfully",
		});
	} catch (err: any) {
		next(new AppError(err.message!, 404));
	}
};

export { sendOTP };
