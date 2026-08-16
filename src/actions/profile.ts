"use server";

import { revalidatePath } from "next/cache";

import { getRequiredUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { parseBrand } from "@/lib/validation";

export type ActionState = { error?: string };

export async function updateUser(
	_prevState: ActionState | undefined,
	formData: FormData,
): Promise<ActionState | undefined> {
	const user = await getRequiredUser();

	const parsed = parseBrand(formData);
	if (!parsed.success) {
		return {
			error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
		};
	}

	const current = await prisma.user.findUnique({
		select: { email: true },
		where: { id: user.id },
	});
	if (!current) {
		return { error: "Không tìm thấy người dùng." };
	}

	await prisma.user.update({
		data: {
			companyName: parsed.data.companyName || null,
			email: current.email,
			location: parsed.data.location || null,
			phone: parsed.data.phone || null,
			userLogo: parsed.data.userLogo || null,
		},
		where: { id: user.id },
	});

	revalidatePath("/dashboard/brand-settings");
	revalidatePath("/dashboard");
	return undefined;
}
