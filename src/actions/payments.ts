"use server";

import { revalidatePath } from "next/cache";

import { getRequiredUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { parsePayment } from "@/lib/validation";

export type ActionState = { error?: string };

async function generateInvoiceNumber(): Promise<string> {
	while (true) {
		const number = Math.floor(1000000 + Math.random() * 9000000).toString();
		const existing = await prisma.payment.findUnique({
			select: { id: true },
			where: { invoiceNumber: number },
		});
		if (!existing) return number;
	}
}

export async function createPayment(
	projectId: string,
	_prevState: ActionState | undefined,
	formData: FormData,
): Promise<ActionState | undefined> {
	const user = await getRequiredUser();

	const project = await prisma.project.findFirst({
		select: { clientId: true, id: true, slug: true },
		where: { id: projectId, userId: user.id },
	});
	if (!project) {
		return { error: "Không tìm thấy dự án." };
	}

	const parsed = parsePayment(formData);
	if (!parsed.success) {
		return {
			error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.",
		};
	}

	const date = parsed.data.date ? new Date(parsed.data.date) : new Date();
	if (Number.isNaN(date.getTime())) {
		return { error: "Ngày thanh toán không hợp lệ." };
	}

	const invoiceNumber = await generateInvoiceNumber();

	await prisma.payment.create({
		data: {
			amount: parsed.data.amount,
			clientId: project.clientId,
			date,
			invoiceNumber,
			method: parsed.data.method,
			projectId: project.id,
			tax: parsed.data.tax,
			title: parsed.data.title,
			userId: user.id,
		},
	});

	revalidatePath(`/project/${project.slug}`);
	revalidatePath(`/dashboard/projects/view/${project.slug}`);
	return undefined;
}

export async function getInvoiceById(id: string) {
	const user = await getRequiredUser();

	const payment = await prisma.payment.findFirst({
		include: {
			client: {
				select: {
					companyName: true,
					email: true,
					id: true,
					location: true,
					name: true,
					phone: true,
				},
			},
			owner: {
				select: {
					companyName: true,
					email: true,
					id: true,
					location: true,
					name: true,
					phone: true,
					userLogo: true,
				},
			},
			project: {
				select: { id: true, name: true, slug: true },
			},
		},
		where: {
			id,
			project: {
				OR: [{ userId: user.id }, { clientId: user.id }],
			},
		},
	});

	if (!payment) {
		return null;
	}
	return payment;
}
