import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utilities/errorResponse";

function errorHandler(
	err: TypeError | ErrorResponse,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	let error = { ...err };

	if (!(err instanceof ErrorResponse)) {
		error = new ErrorResponse(err.message || "Something went wrong", 500);
	}

	res.status((error as ErrorResponse).statusCode).json({
		success: false,
		message: error.message,
	});
}

export default errorHandler;
