"use server";

import { getRequiredUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import type { ClientProps, ProjectProps } from "@/types";

export async function getDashboardAnalytics() {
	const user = await getRequiredUser();

	const [projectCount, clientCount, projects, payments] = await Promise.all([
		prisma.project.count({ where: { userId: user.id } }),
		prisma.user.count({ where: { ownerId: user.id, role: "CLIENT" } }),
		prisma.project.findMany({
			select: { budget: true },
			where: { userId: user.id },
		}),
		prisma.payment.findMany({
			select: { amount: true, tax: true },
			where: { userId: user.id },
		}),
	]);

	const totalRevenue = projects.reduce(
		(sum, project) => sum + project.budget,
		0,
	);
	const totalPaid = payments.reduce(
		(sum, payment) => sum + payment.amount + payment.tax,
		0,
	);

	return { clientCount, projectCount, totalPaid, totalRevenue };
}

export async function getRecentProjects(): Promise<ProjectProps[]> {
	const user = await getRequiredUser();

	return prisma.project.findMany({
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
		orderBy: { createdAt: "desc" },
		take: 5,
		where: { userId: user.id },
	});
}

export async function getRecentClients(): Promise<ClientProps[]> {
	const user = await getRequiredUser();

	return prisma.user.findMany({
		orderBy: { createdAt: "desc" },
		select: {
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
			userLogo: true,
		},
		take: 3,
		where: { ownerId: user.id, role: "CLIENT" },
	});
}
