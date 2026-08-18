import { ArrowUpRight, FolderKanban } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCurrency, getProjectStatusLabel } from "@/lib/format";
import type { ProjectProps } from "@/types";

export function RecentProjects({ projects }: { projects: ProjectProps[] }) {
	return (
		<Card className="lg:col-span-2">
			<CardHeader className="flex-row items-center justify-between space-y-0">
				<div>
					<CardTitle className="text-base">Dự án gần đây</CardTitle>
					<CardDescription>Các dự án mới nhất của bạn</CardDescription>
				</div>
				<Link
					className="inline-flex items-center gap-1 font-medium text-primary text-sm hover:underline"
					href="/dashboard/projects"
				>
					Xem tất cả
					<ArrowUpRight className="size-3.5" />
				</Link>
			</CardHeader>
			<CardContent>
				{projects.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
						<span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
							<FolderKanban className="size-5" />
						</span>
						<p className="font-medium text-sm">Chưa có dự án</p>
						<p className="text-muted-foreground text-sm">
							Tạo dự án đầu tiên để bắt đầu.
						</p>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Dự án</TableHead>
								<TableHead>Ngân sách</TableHead>
								<TableHead>Trạng thái</TableHead>
								<TableHead className="text-right">Hành động</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{projects.map((project) => (
								<TableRow key={project.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											{project.thumbnail ? (
												<Image
													alt={project.name}
													className="size-9 shrink-0 rounded-md border object-cover"
													height={36}
													src={project.thumbnail}
													width={36}
												/>
											) : (
												<span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
													<FolderKanban className="size-4" />
												</span>
											)}
											<div className="min-w-0">
												<Link
													className="block max-w-52 truncate font-semibold text-sm hover:underline"
													href={`/project/${project.slug}`}
												>
													{project.name}
												</Link>
												<p className="max-w-52 truncate text-muted-foreground text-xs">
													{project.client
														? (project.client.name ?? project.client.email)
														: "Chưa gán khách hàng"}
												</p>
											</div>
										</div>
									</TableCell>
									<TableCell className="font-medium tabular-nums">
										{formatCurrency(project.budget)}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												project.status === "COMPLETED" ? "secondary" : "default"
											}
										>
											{getProjectStatusLabel(project.status)}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button
											render={<Link href={`/project/${project.slug}`} />}
											size="sm"
											variant="outline"
										>
											Xem chi tiết
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
