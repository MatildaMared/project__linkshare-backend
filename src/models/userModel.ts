import mongoose, { InferSchemaType } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ErrorMessage } from "../ts/enums/ErrorMessage";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE;

if (!JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined");
}

if (!JWT_EXPIRE) {
	throw new Error("JWT_EXPIRE is not defined");
}

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, ErrorMessage.MissingName],
		trim: true,
	},
	email: {
		type: String,
		required: [true, ErrorMessage.MissingEmail],
		unique: true,
		trim: true,
		lowercase: true,
		match: [
			/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
			ErrorMessage.InvalidEmail,
		],
	},
	password: {
		type: String,
		required: [true, ErrorMessage.MissingPassword],
		minlength: [6, ErrorMessage.InsufficientPasswordLength],
		select: false,
	},
});

userSchema.pre("save", async function (next) {
	const saltRounds = 10;

	if (this && !this.isModified("password")) {
		return next();
	}

	this.password = await bcrypt.hash(this.password, saltRounds);
	next();
});

userSchema.methods.comparePassword = function (
	enteredPassword: string,
	userPassword: string,
) {
	return bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.getToken = function () {
	return jwt.sign({ id: this._id }, JWT_SECRET, {
		expiresIn: JWT_EXPIRE,
	});
};

declare interface IUser extends InferSchemaType<typeof userSchema> {
	comparePassword: (
		enteredPassword: string,
		userPassword: string,
	) => Promise<boolean>;
	getToken: () => string;
}

const User = mongoose.model<IUser>("User", userSchema);

userSchema.set("toJSON", {
	transform: (_, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.password;
	},
});

export { User };
