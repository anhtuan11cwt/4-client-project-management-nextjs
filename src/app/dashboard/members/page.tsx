import { ComingSoon } from "@/components/coming-soon";

export default function MembersPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Thành viên</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Quản lý các thành viên trong không gian làm việc của bạn.
				</p>
			</div>
			<ComingSoon title="Thành viên" />
		</div>
	);
}
