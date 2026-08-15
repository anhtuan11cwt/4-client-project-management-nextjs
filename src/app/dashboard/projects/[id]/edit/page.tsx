import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/forms/project-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export default async function EditProjectPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const session = await getSession();
	if (!session?.user?.id) {
		notFound();
	}

	const [project, clients] = await Promise.all([
		prisma.project.findFirst({
			select: {
				budget: true,
				clientId: true,
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
			where: { id, userId: session.user.id },
		}),
		prisma.user.findMany({
			orderBy: { createdAt: "desc" },
			select: { email: true, id: true, name: true },
			where: { ownerId: session.user.id, role: "CLIENT" },
		}),
	]);

	if (!project) {
		notFound();
	}

	return (
		<div className="mx-auto max-w-7xl space-y-6">
			<div>
				<Link
					className="inline-flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
					href={`/dashboard/projects/view/${project.slug}`}
				>
					<ArrowLeft className="size-3.5" />
					Quay lại dự án
				</Link>
				<h1 className="mt-2 font-bold text-2xl tracking-tight">
					Chỉnh sửa dự án
				</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Cập nhật thông tin dự án bên dưới.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Thông tin dự án</CardTitle>
					<CardDescription>
						Các thay đổi được lưu khi bạn gửi biểu mẫu.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ProjectForm clients={clients} project={project} />
				</CardContent>
			</Card>
		</div>
	);
}
