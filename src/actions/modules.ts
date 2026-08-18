"use server";

import { revalidatePath } from "next/cache";

import { getRequiredUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { parseModule } from "@/lib/validation";

export type ActionState = { error?: string };

export async function createModule(
	projectId: string,
	_prevState: ActionState | undefined,
	formData: FormData,
): Promise<ActionState | undefined> {
	const user = await getRequiredUser();

	const project = await prisma.project.findFirst({
		select: { id: true, slug: true },
		where: {
			id: projectId,
			OR: [{ clientId: user.id }, { userId: user.id }],
		},
	});
	if (!project) {
		return { error: "Không tìm thấy dự án." };
	}

	const parsed = parseModule(formData);
	if (!parsed.success) {
		return {
			error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
		};
	}

	await prisma.module.create({
		data: {
			name: parsed.data.name,
			projectId: project.id,
			userId: user.id,
			username: user.name ?? user.email ?? "Người dùng",
		},
	});

	revalidatePath(`/project/${project.slug}`);
	return undefined;
}

export async function updateModuleById(
	id: string,
	_prevState: ActionState | undefined,
	formData: FormData,
): Promise<ActionState | undefined> {
	const user = await getRequiredUser();

	const existing = await prisma.module.findFirst({
		select: {
			id: true,
			project: { select: { slug: true } },
			userId: true,
		},
		where: { id },
	});
	if (!existing) {
		return { error: "Không tìm thấy hạng mục." };
	}
	if (existing.userId !== user.id) {
		return { error: "Bạn không có quyền chỉnh sửa hạng mục này." };
	}

	const parsed = parseModule(formData);
	if (!parsed.success) {
		return {
			error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
		};
	}

	await prisma.module.update({
		data: { name: parsed.data.name },
		where: { id },
	});

	revalidatePath(`/project/${existing.project.slug}`);
	return undefined;
}
