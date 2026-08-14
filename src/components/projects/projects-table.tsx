"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { FolderKanban } from "lucide-react";
import Image from "next/image";

import { DataTable } from "@/components/data-table";
import { ProjectActions } from "@/components/projects/project-actions";
import { Badge } from "@/components/ui/badge";
import { formatDate, getProjectStatusLabel } from "@/lib/format";
import type { ProjectProps } from "@/types";

const columns: ColumnDef<ProjectProps>[] = [
	{
		accessorKey: "name",
		cell: ({ row }) => {
			const project = row.original;
			return (
				<div className="flex items-center gap-3">
					{project.thumbnail ? (
						<Image
							alt={project.name}
							className="size-10 shrink-0 rounded-md border object-cover"
							height={40}
							src={project.thumbnail}
							width={40}
						/>
					) : (
						<span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
							<FolderKanban className="size-4" />
						</span>
					)}
					<div className="min-w-0">
						<p className="truncate font-medium">{project.name}</p>
						<p className="truncate text-muted-foreground text-xs">
							{project.client?.name ??
								project.client?.email ??
								"Chưa gán khách hàng"}
						</p>
					</div>
				</div>
			);
		},
		header: "Dự án",
	},
	{
		accessorKey: "startDate",
		cell: ({ row }) => (
			<span className="text-muted-foreground">
				{formatDate(row.original.startDate)}
			</span>
		),
		header: "Ngày bắt đầu",
	},
	{
		accessorKey: "status",
		cell: ({ row }) => (
			<Badge
				variant={row.original.status === "COMPLETED" ? "secondary" : "default"}
			>
				{getProjectStatusLabel(row.original.status)}
			</Badge>
		),
		header: "Trạng thái",
	},
	{
		cell: ({ row }) => (
			<ProjectActions projectId={row.original.id} slug={row.original.slug} />
		),
		header: () => <span className="sr-only">Thao tác</span>,
		id: "actions",
	},
];

export function ProjectsTable({ projects }: { projects: ProjectProps[] }) {
	return (
		<DataTable
			columns={columns}
			data={projects}
			emptyMessage="Không tìm thấy dự án nào. Hãy tạo dự án đầu tiên để bắt đầu."
			searchKeys={["name"]}
			searchPlaceholder="Tìm dự án theo tên..."
		/>
	);
}
