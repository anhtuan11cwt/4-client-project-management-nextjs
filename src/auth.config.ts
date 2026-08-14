import type { NextAuthConfig } from "next-auth";

export const authConfig = {
	pages: {
		signIn: "/sign-in",
	},
	providers: [],
	session: {
		strategy: "jwt",
	},
} satisfies NextAuthConfig;
