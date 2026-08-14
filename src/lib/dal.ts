import { cache } from "react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getSession = cache(async () => {
	return await auth();
});

export async function getCurrentUser() {
	const session = await getSession();
	if (!session?.user?.id) return null;
	return prisma.user.findUnique({ where: { id: session.user.id } });
}

export async function getRequiredUser() {
	const session = await getSession();
	if (!session?.user?.id) {
		throw new Error("Không được phép truy cập");
	}
	return session.user;
}
