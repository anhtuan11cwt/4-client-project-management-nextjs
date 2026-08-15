import { CircleDollarSign, FolderKanban } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { ProjectProps } from "@/types";

export function ProjectSummary({ projects }: { projects: ProjectProps[] }) {
	const totalProjects = projects.length;
	const totalRevenue = projects.reduce(
		(sum, project) => sum + (project.budget ?? 0),
		0,
	);

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardContent className="p-5">
					<div className="flex items-center justify-between">
						<p className="font-medium text-muted-foreground text-sm">
							Tổng dự án
						</p>
						<span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<FolderKanban className="size-4" />
						</span>
					</div>
					<p className="mt-3 font-bold text-3xl tracking-tight">
						{totalProjects}
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="p-5">
					<div className="flex items-center justify-between">
						<p className="font-medium text-muted-foreground text-sm">
							Tổng doanh thu
						</p>
						<span className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
							<CircleDollarSign className="size-4" />
						</span>
					</div>
					<p className="mt-3 font-bold text-3xl tracking-tight">
						{formatCurrency(totalRevenue)}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
