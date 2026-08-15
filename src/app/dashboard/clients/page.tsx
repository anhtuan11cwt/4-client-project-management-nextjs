import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ClientsTable } from "@/components/clients/clients-table";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import type { ClientProps } from "@/types";

export default async function ClientsPage() {
	const session = await getSession();
	if (!session?.user?.id) {
		redirect("/sign-in");
	}

	const clients = await prisma.user.findMany({
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
		},
		where: { ownerId: session.user.id, role: "CLIENT" },
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-bold text-2xl tracking-tight">Khách hàng</h1>
					<p className="mt-1 text-muted-foreground text-sm">
						Quản lý những người bạn làm việc cùng. Mỗi khách hàng có tài khoản
						đăng nhập riêng để theo dõi dự án của họ.
					</p>
				</div>
				<Button render={<Link href="/dashboard/clients/new" />}>
					<Plus />
					Thêm khách hàng
				</Button>
			</div>

			<ClientsTable clients={clients as ClientProps[]} />
		</div>
	);
}
