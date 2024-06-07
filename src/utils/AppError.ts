class AppError extends Error {
	message: string;
	statusCode: number;
	status: string;

	constructor(message: string, statusCode: number) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
		this.status = statusCode >= 500 ? "error" : "fail";
	}
}

export default AppError;
