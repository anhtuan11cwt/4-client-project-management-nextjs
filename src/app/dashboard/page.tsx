import { DollarSign, FolderKanban, Handshake, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { RecentClients } from "@/components/dashboard/recent-clients";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { getSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import type { ClientProps, ProjectProps } from "@/types";

export default async function DashboardOverviewPage() {
	const session = await getSession();
	if (!session?.user?.id) {
		redirect("/sign-in");
	}
	const userId = session.user.id;

	const [clientCount, projectCount, recentClients, recentProjects] =
		await Promise.all([
			prisma.user.count({ where: { ownerId: userId, role: "CLIENT" } }),
			prisma.project.count({ where: { userId } }),
			prisma.user.findMany({
				orderBy: { createdAt: "desc" },
				select: {
					createdAt: true,
					email: true,
					id: true,
					image: true,
					location: true,
					name: true,
					phone: true,
					role: true,
				},
				take: 5,
				where: { ownerId: userId, role: "CLIENT" },
			}),
			prisma.project.findMany({
				include: {
					client: {
						select: {
							email: true,
							id: true,
							image: true,
							name: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				take: 5,
				where: { userId },
			}),
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
					value={clientCount}
				/>
				<OverviewCard
					footer="Dự án của tất cả khách hàng"
					icon={FolderKanban}
					label="Tổng số dự án"
					value={projectCount}
				/>
				<OverviewCard
					footer="Sắp ra mắt"
					icon={DollarSign}
					label="Hóa đơn"
					value={0}
				/>
				<OverviewCard
					footer="Sắp ra mắt"
					icon={Handshake}
					label="Thanh toán"
					value={0}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<RecentProjects projects={recentProjects as ProjectProps[]} />
				<RecentClients clients={recentClients as ClientProps[]} />
			</div>
		</div>
	);
}
