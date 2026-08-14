import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ClientForm } from "@/components/forms/client-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export default async function EditClientPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const session = await getSession();
	if (!session?.user?.id) {
		return notFound();
	}

	const client = await prisma.user.findFirst({
		select: {
			email: true,
			id: true,
			image: true,
			location: true,
			name: true,
			phone: true,
		},
		where: { id, ownerId: session.user.id, role: "CLIENT" },
	});

	if (!client) {
		notFound();
	}

	return (
		<div className="mx-auto max-w-7xl space-y-6">
			<div>
				<Link
					className="inline-flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
					href="/dashboard/clients"
				>
					<ArrowLeft className="size-3.5" />
					Quay lại danh sách khách hàng
				</Link>
				<h1 className="mt-2 font-bold text-2xl tracking-tight">
					Chỉnh sửa khách hàng
				</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Cập nhật thông tin khách hàng bên dưới.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Thông tin khách hàng</CardTitle>
					<CardDescription>
						Để trống mật khẩu nếu muốn giữ nguyên mật khẩu hiện tại.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ClientForm client={client} />
				</CardContent>
			</Card>
		</div>
	);
}
