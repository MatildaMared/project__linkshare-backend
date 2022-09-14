import { Request, Response } from "express";
const express = require("express");
const PORT = 3000;

const app = express();

app.use("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

app.listen(PORT || 3000, () => {
	console.log(`Server up and running on port ${PORT}... 🌈`);
});
