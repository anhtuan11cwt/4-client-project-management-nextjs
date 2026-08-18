"use server";

import { revalidatePath } from "next/cache";

import { getRequiredUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { parseComment } from "@/lib/validation";

export type ActionState = { error?: string };

export async function createComment(
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

	const parsed = parseComment(formData);
	if (!parsed.success) {
		return {
			error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
		};
	}

	await prisma.projectComment.create({
		data: {
			authorId: user.id,
			projectId: project.id,
			text: parsed.data.content,
			userId: user.id,
			username: user.name ?? user.email ?? "Người dùng",
			userRole: user.role ?? "MEMBER",
		},
	});

	revalidatePath(`/project/${project.slug}`);
	return undefined;
}

export async function updateCommentById(
	id: string,
	_prevState: ActionState | undefined,
	formData: FormData,
): Promise<ActionState | undefined> {
	const user = await getRequiredUser();

	const existing = await prisma.projectComment.findFirst({
		select: {
			authorId: true,
			id: true,
			project: { select: { slug: true } },
		},
		where: { id },
	});
	if (!existing) {
		return { error: "Không tìm thấy bình luận." };
	}
	if (existing.authorId !== user.id) {
		return { error: "Bạn không có quyền chỉnh sửa bình luận này." };
	}

	const parsed = parseComment(formData);
	if (!parsed.success) {
		return {
			error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
		};
	}

	await prisma.projectComment.update({
		data: { text: parsed.data.content },
		where: { id },
	});

	revalidatePath(`/project/${existing.project.slug}`);
	return undefined;
}
