import { DollarSign, FolderKanban, Handshake, Users } from "lucide-react";
import { redirect } from "next/navigation";
import {
	getDashboardAnalytics,
	getRecentClients,
	getRecentProjects,
} from "@/actions/dashboard";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { RecentClients } from "@/components/dashboard/recent-clients";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { getSession } from "@/lib/dal";

export default async function DashboardOverviewPage() {
	const session = await getSession();
	if (!session?.user?.id) {
		redirect("/sign-in");
	}

	const [analytics, recentProjects, recentClients] = await Promise.all([
		getDashboardAnalytics(),
		getRecentProjects(),
		getRecentClients(),
	]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Tổng quan</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Đây là những gì đang diễn ra trong không gian làm việc của bạn.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<OverviewCard
					footer="Khách hàng trong không gian làm việc của bạn"
					icon={Users}
					label="Tổng số khách hàng"
					value={analytics.clientCount}
				/>
				<OverviewCard
					footer="Dự án của tất cả khách hàng"
					icon={FolderKanban}
					label="Tổng số dự án"
					value={analytics.projectCount}
				/>
				<OverviewCard
					footer="Tổng ngân sách của tất cả dự án"
					icon={DollarSign}
					isCurrency
					label="Tổng doanh thu"
					value={analytics.totalRevenue}
				/>
				<OverviewCard
					footer="Số tiền đã nhận từ khách hàng"
					icon={Handshake}
					isCurrency
					label="Đã thanh toán"
					value={analytics.totalPaid}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<RecentProjects projects={recentProjects} />
				<RecentClients clients={recentClients} />
			</div>
		</div>
	);
}
