import { connectToDB } from "./database";
import express from "express";
import { config } from "dotenv";
import usersRoutes from "./routes/usersRoutes";
import errorHandler from "./middleware/errorHandler";
config();

const PORT = process.env.port || 3000;

const app = express();

app.use(express.json());

app.use("/api/users", usersRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
	app.listen(PORT || 3000, () => {
		console.log(`Server up and running on port ${PORT}... 🌈`);
	});

	connectToDB();
}

export { app };
