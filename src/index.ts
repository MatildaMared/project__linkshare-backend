import { Request, Response } from "express";
import { connectToDB } from "./database";
const express = require("express");
require("dotenv").config();

const PORT = process.env.port || 3000;

const app = express();

app.use("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

if (process.env.development !== "test") {
	app.listen(PORT || 3000, () => {
		console.log(`Server up and running on port ${PORT}... 🌈`);
	});

	connectToDB();
}