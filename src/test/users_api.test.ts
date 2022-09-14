import { connectToDB, disconnectFromDB } from "../database";
import request from "supertest";
import { app } from "../index";

describe("Users API", () => {
	beforeAll(async () => {
		await connectToDB();
	});

	describe("Creating a user", () => {
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
		});
	});

	afterAll(async () => {
		await disconnectFromDB();
	});
});
