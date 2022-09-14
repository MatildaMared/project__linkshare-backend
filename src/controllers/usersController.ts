import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";
import { ErrorResponse } from "../utilities/errorResponse";

async function createUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { name, email, password } = req.body;

		const user = await User.create({
			name,
			email,
			password,
		});

		res.status(201).json({
			success: true,
			user,
			token: user.getToken(),
		});

		console.log("Will create user");
	} catch (err) {
		return next(err);
	}
}

export { createUser };
