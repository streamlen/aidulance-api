import crypto from "crypto";

export const generateFourDigitOTP = (): number => {
	const value = crypto.randomInt(1000, 9999);
	console.log(value);

	return value;
};

export const generateOTPHash = (
	phoneNumber: string,
	otp: number,
	expiry = Date.now() + 300000
): string => {
	const data = `${phoneNumber}.${otp}.${expiry}`;
	return crypto
		.createHmac("sha256", process.env.OTP_HASH_SECRET_KEY!)
		.update(data)
		.digest("hex");
};
