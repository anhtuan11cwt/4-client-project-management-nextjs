"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { getRequiredUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { parseCreateClient, parseUpdateClient } from "@/lib/validation";
import type { ClientProps } from "@/types";

export type ActionState = { error?: string };

const clientSelect = {
	companyDescription: true,
	companyName: true,
	createdAt: true,
	email: true,
	id: true,
	image: true,
	location: true,
	name: true,
	phone: true,
	role: true,
} as const;

function toNull(value: string | undefined) {
	return value ? value : null;
}

export async function createClient(
	_prevState: ActionState | undefined,
	formData: FormData,
): Promise<ActionState | undefined> {
	const user = await getRequiredUser();

	const parsed = parseCreateClient(formData);

	if (!parsed.success) {
		return {
			error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
		};
	}

	const existing = await prisma.user.findUnique({
		where: { email: parsed.data.email },
	});
	if (existing) {
		return { error: "Đã tồn tại người dùng với email này." };
	}

	const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

	await prisma.user.create({
		data: {
			companyDescription: toNull(parsed.data.companyDescription),
			companyName: toNull(parsed.data.companyName),
			email: parsed.data.email,
			image: toNull(parsed.data.image),
			location: toNull(parsed.data.location),
			name: parsed.data.name,
			ownerId: user.id,
			password: hashedPassword,
			phone: toNull(parsed.data.phone),
			role: "CLIENT",
		},
	});

	revalidatePath("/dashboard/clients");
	redirect("/dashboard/clients");
}

export async function getClients(): Promise<ClientProps[]> {
	const user = await getRequiredUser();
	return prisma.user.findMany({
		orderBy: { createdAt: "desc" },
		select: clientSelect,
		where: { ownerId: user.id, role: "CLIENT" },
	});
}

export async function getUserById(id: string) {
	const user = await getRequiredUser();
	const client = await prisma.user.findFirst({
		where: { id, ownerId: user.id, role: "CLIENT" },
	});
	if (!client) {
		throw new Error("Không tìm thấy khách hàng.");
	}
	return client;
}

export async function updateUserById(
	id: string,
	_prevState: ActionState | undefined,
	formData: FormData,
): Promise<ActionState | undefined> {
	const user = await getRequiredUser();

	const existing = await prisma.user.findFirst({
		where: { id, ownerId: user.id, role: "CLIENT" },
	});
	if (!existing) {
		return { error: "Không tìm thấy khách hàng." };
	}

	const parsed = parseUpdateClient(formData);

	if (!parsed.success) {
		return {
			error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
		};
	}

	if (parsed.data.email !== existing.email) {
		const duplicate = await prisma.user.findUnique({
			where: { email: parsed.data.email },
		});
		if (duplicate) {
			return { error: "Đã tồn tại người dùng với email này." };
		}
	}

	const data: Parameters<typeof prisma.user.update>[0]["data"] = {
		companyDescription: toNull(parsed.data.companyDescription),
		companyName: toNull(parsed.data.companyName),
		email: parsed.data.email,
		image: toNull(parsed.data.image),
		location: toNull(parsed.data.location),
		name: parsed.data.name,
		phone: toNull(parsed.data.phone),
	};

	if (parsed.data.password) {
		data.password = await bcrypt.hash(parsed.data.password, 10);
	}

	await prisma.user.update({ data, where: { id } });

	if (existing.image && existing.image !== data.image) {
		await deleteCloudinaryImage(existing.image);
	}

	revalidatePath("/dashboard/clients");
	redirect("/dashboard/clients");
}

export async function deleteUser(id: string): Promise<void> {
	const user = await getRequiredUser();

	const existing = await prisma.user.findFirst({
		where: { id, ownerId: user.id, role: "CLIENT" },
	});
	if (!existing) {
		throw new Error("Không tìm thấy khách hàng.");
	}

	await prisma.project.updateMany({
		data: { clientId: null },
		where: { clientId: id },
	});

	await prisma.user.delete({ where: { id } });

	await deleteCloudinaryImage(existing.image);

	revalidatePath("/dashboard/clients");
}
