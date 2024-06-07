import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateFourDigitOTP = (): number => {
	const value = crypto.randomInt(1000, 9999);
	console.log(value);

	return value;
};
