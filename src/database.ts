import mongoose from "mongoose";
import { config } from "dotenv";
config();

const connectString = process.env.DB_URI;

export async function connectToDB() {
	try {
		if (!connectString) {
			throw new Error("No connection string provided");
		}
		await mongoose.connect(connectString);

		console.log("Connected to DB... 📝 🌸");
	} catch (err) {
		console.log(err);
		throw new Error("Something went wrong while connecting to DB");
	}
}

export async function disconnectFromDb() {
	try {
		await mongoose.connection.close();
		console.log("Disconnected from DB... 📝 🌸");
	} catch (err) {
		console.log(err);
		throw new Error("Something went wrong while disconnecting from DB");
	}
}
