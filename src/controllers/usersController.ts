import { Request, Response, NextFunction } from "express";

async function createUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please enter all fields",
			});
		}

		console.log("Will create user");
	} catch (err) {
		console.log(err);
		return next(err);
	}
}

export { createUser };
