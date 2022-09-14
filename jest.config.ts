import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFiles: ["dotenv/config"],
	globalTeardown: "./jestTearDown.ts",
};

export default config;
