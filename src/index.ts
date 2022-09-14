import { Request, Response } from "express";
import { connectToDB } from "./database";
import express from "express";
import { config } from "dotenv";
config();

const PORT = process.env.port || 3000;

export const app = express();

app.use("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

if (process.env.NODE_ENV !== "test") {
	app.listen(PORT || 3000, () => {
		console.log(`Server up and running on port ${PORT}... 🌈`);
	});

	connectToDB();
}
