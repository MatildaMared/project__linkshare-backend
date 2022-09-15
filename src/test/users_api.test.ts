import { connectToDB, disconnectFromDB } from "../database";
import request from "supertest";
import { app } from "../index";
import { User } from "../models/userModel";
import { StatusCode } from "../ts/enums/StatusCode";
import { ErrorMessage } from "../ts/enums/ErrorMessage";
import jwt from "jsonwebtoken";
import { VerifiedToken } from "../ts/interfaces/VerifiedToken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined");
}

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

		it("fails if name is missing", async () => {
			const newUser = {
				email: "test@test.com",
				password: "test123",
			};

			const response = await request(app)
				.post("/api/users")
				.send(newUser)
				.expect(StatusCode.BadRequest)
				.expect("Content-Type", /application\/json/);

			expect(response.body.message).toBe(ErrorMessage.MissingName);
		});

		it("fails if password is missing", async () => {
			const newUser = {
				name: "Test User",
				email: "test@test.com",
			};

			const response = await request(app)
				.post("/api/users")
				.send(newUser)
				.expect(StatusCode.BadRequest)
				.expect("Content-Type", /application\/json/);

			expect(response.body.message).toBe(ErrorMessage.MissingPassword);
		});

		it("fails if password is too short", async () => {
			const newUser = {
				name: "Test User",
				email: "test@test.com",
				password: "test",
			};

			const response = await request(app)
				.post("/api/users")
				.send(newUser)
				.expect(StatusCode.BadRequest)
				.expect("Content-Type", /application\/json/);

			expect(response.body.message).toBe(
				ErrorMessage.InsufficientPasswordLength,
			);
		});

		it("returns a token", async () => {
			const newUser = {
				name: "Test User",
				email: "test@test.com",
				password: "test123",
			};

			const response = await request(app)
				.post("/api/users")
				.send(newUser)
				.expect(StatusCode.Created)
				.expect("Content-Type", /application\/json/);

			expect(response.body.token).toBeDefined();
		});

		it("returns a token signed with the correct user id", async () => {
			const newUser = {
				name: "Test User",
				email: "test@test.com",
				password: "test123",
			};

			const response = await request(app)
				.post("/api/users")
				.send(newUser)
				.expect(StatusCode.Created)
				.expect("Content-Type", /application\/json/);

			const token = response.body.token;
			const idFromUser = response.body.user.id;
			const decodedToken = jwt.verify(token, JWT_SECRET) as VerifiedToken;
			expect(decodedToken.id).toBe(idFromUser);
		});
	});

	describe("Logging in", () => {
		beforeAll(async () => {
			await User.deleteMany({});
			// Creating a new user
			const newUser = {
				name: "Test User",
				email: "test@test.com",
				password: "test123",
			};

			await request(app).post("/api/users").send(newUser);
		});

		it("should return a token", async () => {
			const credentials = {
				email: "test@test.com",
				password: "test123",
			};

			const response = await request(app)
				.post("/api/users/login")
				.send(credentials)
				.expect(StatusCode.Ok)
				.expect("Content-Type", /application\/json/);

			expect(response.body.token).toBeDefined();
		});
	});

	afterAll(async () => {
		await disconnectFromDB();
	});
});
