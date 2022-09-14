import { Request, Response } from "express";
import { Error } from "mongoose";
import { ErrorResponse } from "../utilities/errorResponse";
import { StatusCode } from "../ts/enums/StatusCode";

function errorHandler(
	err: TypeError | Error | ErrorResponse,
	req: Request,
	res: Response,
) {
	let error = { ...err };

	if (!(err instanceof ErrorResponse)) {
		error = new ErrorResponse(
			err.message || "Something went wrong",
			StatusCode.InternalServerError,
		);
	}

	if (err instanceof Error.ValidationError) {
		const message = Object.values(err.errors)
			.map((val) => val.message)
			.join(", ");
		error = new ErrorResponse(message, StatusCode.BadRequest);
	}

	res.status((error as ErrorResponse).statusCode).json({
		success: false,
		message: error.message,
	});
}

export default errorHandler;
