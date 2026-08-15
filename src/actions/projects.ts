"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { getRequiredUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { convertDateToISO, slugify } from "@/lib/slugify";
import {
	budgetSchema,
	optionalDateSchema,
	optionalUrlSchema,
} from "@/lib/validation";
import type { ProjectProps } from "@/types";

export type ActionState = { error?: string };

const projectSchema = z
	.object({
		bannerImage: optionalUrlSchema,
		budget: budgetSchema,
		clientId: z.string().trim(),
		description: z
			.string()
			.trim()
			.max(5000, "Mô tả không được vượt quá 5000 ký tự."),
		endDate: optionalDateSchema,
		name: z
			.string()
			.trim()
			.min(1, "Tên dự án là bắt buộc.")
			.max(200, "Tên dự án không được vượt quá 200 ký tự."),
		notes: z.string().trim().max(100000, "Ghi chú quá dài."),
		startDate: optionalDateSchema,
		status: z.enum(["ONGOING", "COMPLETED"]),
		thumbnail: optionalUrlSchema,
	})
	.refine(
		(data) =>
			!data.startDate || !data.endDate || data.startDate <= data.endDate,
		{ message: "Ngày kết thúc phải sau ngày bắt đầu.", path: ["endDate"] },
	);

const projectSelect = {
	bannerImage: true,
	budget: true,
	createdAt: true,
	description: true,
	endDate: true,
	id: true,
	name: true,
	notes: true,
	slug: true,
	startDate: true,
	status: true,
	thumbnail: true,
} as const;

function parseProjectForm(formData: FormData) {
	const value = (name: string) => String(formData.get(name) ?? "");
	return projectSchema.safeParse({
		bannerImage: value("bannerImage"),
		budget: value("budget"),
		clientId: value("clientId"),
		description: value("description"),
		endDate: value("endDate"),
		name: value("name"),
		notes: value("notes"),
		startDate: value("startDate"),
		status: value("status"),
		thumbnail: value("thumbnail"),
	});
}

async function validateClient(userId: string, clientId: string | undefined) {
	if (!clientId || clientId === "none") return null;
	const client = await prisma.user.findFirst({
		select: { id: true },
		where: { id: clientId, ownerId: userId, role: "CLIENT" },
	});
	if (!client) {
		throw new Error("Khách hàng được chọn không hợp lệ.");
	}
	return client.id;
}

async function generateUniqueSlug(name: string, userId: string) {
	const base = slugify(name);
	let slug = base;
	let counter = 2;
	while (true) {
		const existing = await prisma.project.findFirst({
			select: { id: true },
			where: { slug, userId },
		});
		if (!existing) return slug;
		slug = `${base}-${counter}`;
		counter += 1;
	}
}

export async function createProject(
	_prevState: ActionState | undefined,
	formData: FormData,
): Promise<ActionState | undefined> {
	const user = await getRequiredUser();

	const parsed = parseProjectForm(formData);
	if (!parsed.success) {
		return {
			error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
		};
	}

	const clientId = await validateClient(
		user.id,
		parsed.data.clientId || undefined,
	);

	const duplicateName = await prisma.project.findFirst({
		select: { id: true },
		where: { name: parsed.data.name, userId: user.id },
	});
	if (duplicateName) {
		return { error: "Đã tồn tại dự án với tên này." };
	}

	const slug = await generateUniqueSlug(parsed.data.name, user.id);

	await prisma.project.create({
		data: {
			bannerImage: parsed.data.bannerImage || null,
			budget: parsed.data.budget,
			clientId,
			description: parsed.data.description || null,
			endDate: convertDateToISO(parsed.data.endDate),
			name: parsed.data.name,
			notes: parsed.data.notes || null,
			slug,
			startDate: convertDateToISO(parsed.data.startDate),
			status: parsed.data.status,
			thumbnail: parsed.data.thumbnail || null,
			userId: user.id,
		},
	});

	revalidatePath("/dashboard/projects");
	redirect("/dashboard/projects");
}

export async function getUserProjects(): Promise<ProjectProps[]> {
	const user = await getRequiredUser();
	return prisma.project.findMany({
		orderBy: { createdAt: "desc" },
		select: {
			...projectSelect,
			client: {
				select: {
					companyName: true,
					email: true,
					id: true,
					image: true,
					name: true,
				},
			},
		},
		where: { userId: user.id },
	});
}

export async function getProjectById(id: string) {
	const user = await getRequiredUser();
	const project = await prisma.project.findFirst({
		include: {
			client: {
				select: {
					companyName: true,
					email: true,
					id: true,
					image: true,
					name: true,
				},
			},
		},
		where: { id, userId: user.id },
	});
	if (!project) {
		throw new Error("Không tìm thấy dự án.");
	}
	return project;
}

export async function getProjectBySlug(slug: string) {
	const user = await getRequiredUser();
	const project = await prisma.project.findFirst({
		include: {
			client: {
				select: {
					companyName: true,
					email: true,
					id: true,
					image: true,
					name: true,
				},
			},
			comments: {
				include: {
					author: {
						select: { id: true, image: true, name: true },
					},
				},
				orderBy: { createdAt: "desc" },
			},
		},
		where: { slug, userId: user.id },
	});
	if (!project) {
		return null;
	}
	return project;
}

export async function updateProjectById(
	id: string,
	_prevState: ActionState | undefined,
	formData: FormData,
): Promise<ActionState | undefined> {
	const user = await getRequiredUser();

	const existing = await prisma.project.findFirst({
		select: {
			bannerImage: true,
			id: true,
			name: true,
			slug: true,
			thumbnail: true,
		},
		where: { id, userId: user.id },
	});
	if (!existing) {
		return { error: "Không tìm thấy dự án." };
	}

	const parsed = parseProjectForm(formData);
	if (!parsed.success) {
		return {
			error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
		};
	}

	const clientId = await validateClient(
		user.id,
		parsed.data.clientId || undefined,
	);

	let slug = existing.slug;
	if (parsed.data.name !== existing.name) {
		slug = await generateUniqueSlug(parsed.data.name, user.id);
	}

	const newThumbnail = parsed.data.thumbnail || null;
	const newBannerImage = parsed.data.bannerImage || null;

	await prisma.project.update({
		data: {
			bannerImage: newBannerImage,
			budget: parsed.data.budget,
			clientId,
			description: parsed.data.description || null,
			endDate: convertDateToISO(parsed.data.endDate),
			name: parsed.data.name,
			notes: parsed.data.notes || null,
			slug,
			startDate: convertDateToISO(parsed.data.startDate),
			status: parsed.data.status,
			thumbnail: newThumbnail,
		},
		where: { id },
	});

	if (existing.thumbnail && existing.thumbnail !== newThumbnail) {
		await deleteCloudinaryImage(existing.thumbnail);
	}
	if (existing.bannerImage && existing.bannerImage !== newBannerImage) {
		await deleteCloudinaryImage(existing.bannerImage);
	}

	revalidatePath("/dashboard/projects");
	revalidatePath(`/dashboard/projects/view/${slug}`);
	redirect(`/dashboard/projects/view/${slug}`);
}

export async function deleteProject(id: string): Promise<void> {
	const user = await getRequiredUser();

	const existing = await prisma.project.findFirst({
		select: { bannerImage: true, id: true, thumbnail: true },
		where: { id, userId: user.id },
	});
	if (!existing) {
		throw new Error("Không tìm thấy dự án.");
	}

	await prisma.project.delete({ where: { id } });

	await deleteCloudinaryImage(existing.thumbnail);
	await deleteCloudinaryImage(existing.bannerImage);

	revalidatePath("/dashboard/projects");
}

export async function updateProjectDescription(
	id: string,
	_prevState: ActionState | undefined,
	formData: FormData,
): Promise<ActionState | undefined> {
	const user = await getRequiredUser();

	const existing = await prisma.project.findFirst({
		select: { id: true, slug: true },
		where: { id, userId: user.id },
	});
	if (!existing) {
		return { error: "Không tìm thấy dự án." };
	}

	const description = String(formData.get("description") ?? "").trim();
	if (description.length > 5000) {
		return { error: "Mô tả không được vượt quá 5000 ký tự." };
	}

	await prisma.project.update({
		data: { description: description || null },
		where: { id },
	});

	revalidatePath(`/dashboard/projects/view/${existing.slug}`);
	return undefined;
}

export async function updateProjectNotes(
	id: string,
	_prevState: ActionState | undefined,
	formData: FormData,
): Promise<ActionState | undefined> {
	const user = await getRequiredUser();

	const existing = await prisma.project.findFirst({
		select: { id: true, slug: true },
		where: { id, userId: user.id },
	});
	if (!existing) {
		return { error: "Không tìm thấy dự án." };
	}

	const notes = String(formData.get("notes") ?? "");
	if (notes.length > 100000) {
		return { error: "Ghi chú quá dài." };
	}

	await prisma.project.update({
		data: { notes: notes || null },
		where: { id },
	});

	revalidatePath(`/dashboard/projects/view/${existing.slug}`);
	return undefined;
}
