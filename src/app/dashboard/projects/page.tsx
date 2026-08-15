import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ProjectsTable } from "@/components/projects/projects-table";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import type { ProjectProps } from "@/types";

export default async function ProjectsPage() {
	const session = await getSession();
	if (!session?.user?.id) {
		redirect("/sign-in");
	}

	const projects = await prisma.project.findMany({
		orderBy: { createdAt: "desc" },
		select: {
			bannerImage: true,
			budget: true,
			client: {
				select: {
					companyName: true,
					email: true,
					id: true,
					image: true,
					name: true,
				},
			},
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
		},
		where: { userId: session.user.id },
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-bold text-2xl tracking-tight">Dự án</h1>
					<p className="mt-1 text-muted-foreground text-sm">
						Theo dõi phạm vi, thời gian và trạng thái của mọi dự án bạn thực
						hiện.
					</p>
				</div>
				<Button render={<Link href="/dashboard/projects/new" />}>
					<Plus />
					Thêm dự án
				</Button>
			</div>

			<ProjectsTable projects={projects as ProjectProps[]} />
		</div>
	);
}
