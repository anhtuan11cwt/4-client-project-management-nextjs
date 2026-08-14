import { ComingSoon } from "@/components/coming-soon";

export default function FileManagerPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Quản lý tệp</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Lưu trữ và quản lý tệp tài nguyên thương hiệu của bạn.
				</p>
			</div>
			<ComingSoon title="Quản lý tệp" />
		</div>
	);
}
