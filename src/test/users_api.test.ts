import { connectToDB, disconnectFromDB } from "../database";
import request from "supertest";
import { app } from "../index";
import { User } from "../models/userModel";
import { StatusCode } from "../ts/enums/StatusCode";
import { ErrorMessage } from "../ts/enums/ErrorMessage";

describe("Users API", () => {
	beforeAll(async () => {
		await connectToDB();
	});

	describe("Creating a user", () => {
		beforeEach(async () => {
			await User.deleteMany({});
		});

		it("should create a user in the database", async () => {
			const newUser = {
				name: "Test User",
				email: "test@test.com",
				password: "test123",
			};

			const response = await request(app)
				.post("/api/users")
				.send(newUser)
				.expect(201)
				.expect("Content-Type", /application\/json/);

			expect(response.body.user.name).toBe(newUser.name);

			const userInDb = await User.findOne({ email: newUser.email });
			expect(userInDb && userInDb.name).toBe(newUser.name);
		});

		it("fails if email is invalid", async () => {
			const newUser = {
				name: "Test User",
				email: "test",
				password: "test123",
			};

			const response = await request(app)
				.post("/api/users")
				.send(newUser)
				.expect(StatusCode.BadRequest)
				.expect("Content-Type", /application\/json/);

			expect(response.body.message).toBe(ErrorMessage.InvalidEmail);
		});

		it("fails if email is missing", async () => {
			const newUser = {
				name: "Test User",
				password: "test123",
			};

			const response = await request(app)
				.post("/api/users")
				.send(newUser)
				.expect(StatusCode.BadRequest)
				.expect("Content-Type", /application\/json/);

			expect(response.body.message).toBe(ErrorMessage.MissingEmail);
		});
	});

	afterAll(async () => {
		await disconnectFromDB();
	});
});
