import { ComingSoon } from "@/components/coming-soon";

export default function ProjectProgressReportPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Tiến độ dự án</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Báo cáo tổng quan về tiến độ các dự án của bạn.
				</p>
			</div>
			<ComingSoon title="Tiến độ dự án" />
		</div>
	);
}
