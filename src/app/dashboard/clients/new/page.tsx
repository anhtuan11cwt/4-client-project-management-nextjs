import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ClientForm } from "@/components/forms/client-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function NewClientPage() {
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
					Thêm khách hàng mới
				</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Tạo tài khoản khách hàng để họ có thể đăng nhập và theo dõi dự án của
					mình.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Thông tin khách hàng</CardTitle>
					<CardDescription>
						Email và mật khẩu được khách hàng sử dụng để đăng nhập.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ClientForm />
				</CardContent>
			</Card>
		</div>
	);
}
