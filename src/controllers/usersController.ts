import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";
import { ErrorMessage } from "../ts/enums/ErrorMessage";
import { StatusCode } from "../ts/enums/StatusCode";
import { ErrorResponse } from "../utilities/errorResponse";

async function createUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { name, email, password } = req.body;

		const user = await User.create({
			name,
			email,
			password,
		});

		res.status(StatusCode.Created).json({
			success: true,
			user,
			token: user.getToken(),
		});
	} catch (err) {
		return next(err);
	}
}

async function login(req: Request, res: Response, next: NextFunction) {
	try {
		console.log("Will log in");
		const { email, password } = req.body;

		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return next(
				new ErrorResponse(
					ErrorMessage.UserNotFound,
					StatusCode.NotFound,
				),
			);
		}

		const isMatch = await user.comparePassword(password, user.password);

		if (!isMatch) {
			return next(
				new ErrorResponse(
					ErrorMessage.InvalidCredentials,
					StatusCode.Unauthorized,
				),
			);
		}

		res.status(StatusCode.Ok).json({
			success: true,
			user,
			token: user.getToken(),
		});
	} catch (err) {
		return next(err);
	}
}

export { createUser, login };
