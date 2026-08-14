import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = Boolean(req.auth?.user);
	const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
	const isAuthPage =
		nextUrl.pathname === "/sign-in" || nextUrl.pathname === "/sign-up";

	if (isOnDashboard && !isLoggedIn) {
		return NextResponse.redirect(new URL("/sign-in", nextUrl));
	}

	if (isAuthPage && isLoggedIn) {
		return NextResponse.redirect(new URL("/dashboard", nextUrl));
	}

	return NextResponse.next();
});

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
	],
};
