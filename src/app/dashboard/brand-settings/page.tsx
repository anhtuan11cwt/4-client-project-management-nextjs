import { redirect } from "next/navigation";

import { BrandForm } from "@/components/forms/brand-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export default async function BrandSettingsPage() {
	const session = await getSession();
	if (!session?.user?.id) {
		redirect("/sign-in");
	}

	const user = await prisma.user.findUnique({
		select: {
			companyName: true,
			email: true,
			location: true,
			phone: true,
			userLogo: true,
		},
		where: { id: session.user.id },
	});

	if (!user) {
		redirect("/sign-in");
	}

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Thương hiệu</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Quản lý thông tin hiển thị trên hóa đơn và thương hiệu của bạn.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Thông tin thương hiệu</CardTitle>
					<CardDescription>
						Logo và thông tin liên hệ sẽ xuất hiện trên hóa đơn.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<BrandForm user={user} />
				</CardContent>
			</Card>
		</div>
	);
}
