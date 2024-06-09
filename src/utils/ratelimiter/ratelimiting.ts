import { ExpressMiddleware, RateLimitingOptions } from "../../types";

export default (options: RateLimitingOptions): ExpressMiddleware => {
	const { windowMS, limit, message = "Too many requests" } = options;
	const requests = new Map<string, number[]>();

	return (req, res, next) => {
		const currentTime = Date.now();
		const windowStart = currentTime - windowMS;
		const userIP = req.ip!;

		if (!requests.get(userIP)) {
			requests.set(userIP, []);
			next();
		} else {
			const timeStamps: number[] = requests
				.get(userIP)
				?.filter((timeStamp) => timeStamp > windowStart)!;

			/*
             Thus this below line of code has any signifance here ? 
             I think its crucial because next time when you iterate 
             over the array to filter (line 18) needed timestamps it would make the original array smaller ;)
             TODO: We need to decide later how costly is this below line of code...
            */
			requests.set(userIP, timeStamps);

			// already max no. of requests in a given  window?
			if (timeStamps?.length! >= limit) {
				res.status(429).json({
					status: "fail",
					message,
				});
			} else {
				timeStamps.push(currentTime);
				requests.set(userIP, timeStamps);
				next();
			}
		}
	};
};
