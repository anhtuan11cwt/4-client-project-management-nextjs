import { ComingSoon } from "@/components/coming-soon";

export default function PortfolioPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Danh mục dự án</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Trưng bày các dự án đã hoàn thành của bạn.
				</p>
			</div>
			<ComingSoon title="Danh mục dự án" />
		</div>
	);
}
