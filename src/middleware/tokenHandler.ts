import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ErrorMessage } from "../ts/enums/ErrorMessage";
import { StatusCode } from "../ts/enums/StatusCode";
import { ExtendedRequest } from "../ts/interfaces/ExtendedRequest";
import { VerifiedToken } from "../ts/interfaces/VerifiedToken";
import { ErrorResponse } from "../utilities/errorResponse";

function tokenHandler(req: ExtendedRequest, res: Response, next: NextFunction) {
	try {
		const JWT_SECRET = process.env.JWT_SECRET;

		if (!JWT_SECRET) {
			throw new Error("JWT_SECRET is not defined");
		}

		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			throw new ErrorResponse(
				ErrorMessage.NoToken,
				StatusCode.Unauthorized,
			);
		}

		const decodedToken = jwt.verify(token, JWT_SECRET) as VerifiedToken;
		req.id = decodedToken.id;
		next();
	} catch (err) {
		next(err);
	}
}

export default tokenHandler;
