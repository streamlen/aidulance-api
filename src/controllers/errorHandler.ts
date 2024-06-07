import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

const errorHandler = (
	err: AppError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
	});
};

export default errorHandler;
