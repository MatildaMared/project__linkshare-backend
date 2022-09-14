import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";

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
	} catch (err) {
		return next(err);
	}
}

export { createUser };
