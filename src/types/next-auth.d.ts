import type { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User {
		role?: "ADMIN" | "CLIENT" | "MEMBER";
	}

	interface Session {
		user: {
			id: string;
			role?: "ADMIN" | "CLIENT" | "MEMBER";
		} & DefaultSession["user"];
	}
}
