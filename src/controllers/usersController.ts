import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";
import { StatusCode } from "../ts/enums/StatusCode";

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

export { createUser };
