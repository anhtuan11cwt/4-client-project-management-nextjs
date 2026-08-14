import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

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

export default async function NewProjectPage() {
	const session = await getSession();
	if (!session?.user?.id) {
		redirect("/sign-in");
	}

	const clients = await prisma.user.findMany({
		orderBy: { createdAt: "desc" },
		select: { email: true, id: true, name: true },
		where: { ownerId: session.user.id, role: "CLIENT" },
	});

	return (
		<div className="mx-auto max-w-7xl space-y-6">
			<div>
				<Link
					className="inline-flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
					href="/dashboard/projects"
				>
					<ArrowLeft className="size-3.5" />
					Quay lại danh sách dự án
				</Link>
				<h1 className="mt-2 font-bold text-2xl tracking-tight">
					Thêm dự án mới
				</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Tạo dự án và gán cho một trong những khách hàng của bạn.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Thông tin dự án</CardTitle>
					<CardDescription>
						Bạn có thể tải lên ảnh thu nhỏ và thiết lập tiến độ dự án.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ProjectForm clients={clients} />
				</CardContent>
			</Card>
		</div>
	);
}
