import { NextFunction, Request, Response } from "express";

export type RateLimitingOptions = {
	windowMS: number;
	limit: number;
	message?: string;
};

export type ExpressMiddleware = {
	(req: Request, res: Response, next: NextFunction): void;
};
