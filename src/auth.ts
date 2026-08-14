import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.role = user.role;
			}
			return token;
		},
		session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub ?? "";
				session.user.role = token.role as
					| "ADMIN"
					| "CLIENT"
					| "MEMBER"
					| undefined;
			}
			return session;
		},
	},
	providers: [
		Credentials({
			authorize: async (credentials) => {
				const email = credentials?.email as string | undefined;
				const password = credentials?.password as string | undefined;
				if (!email || !password) return null;

				const user = await prisma.user.findUnique({ where: { email } });
				if (!user?.password) return null;

				const isValid = await bcrypt.compare(password, user.password);
				if (!isValid) return null;

				const name = user.name ?? user.email;

				return {
					email: user.email,
					id: user.id,
					image: user.image,
					name,
					role: user.role,
				};
			},
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Mật khẩu", type: "password" },
			},
		}),
	],
});
