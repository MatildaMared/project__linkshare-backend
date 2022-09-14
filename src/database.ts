import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { config } from "dotenv";
config();

export async function connectToDB() {
	if (process.env.NODE_ENV === "test") {
		await connectToTestDB();
	} else {
		await connectToProdDB();
	}
}

async function connectToProdDB() {
	try {
		const connectString = process.env.DB_URI;

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

async function connectToTestDB() {
	try {
		const mongoServer = await MongoMemoryServer.create();
		const connectString = await mongoServer.getUri();

		await mongoose.connect(connectString);

		console.log("Connected to test DB... 📝 🌸");
	} catch (err) {
		console.log(err);
		throw new Error(
			"Something went wrong while trying to set up the test Db",
		);
	}
}

export async function disconnectFromDB() {
	try {
		await mongoose.connection.close();
		console.log("Disconnected from DB... 📝 🌸");
	} catch (err) {
		console.log(err);
		throw new Error("Something went wrong while disconnecting from DB");
	}
}
