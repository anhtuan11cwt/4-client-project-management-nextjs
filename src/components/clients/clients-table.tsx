"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { ClientActions } from "@/components/clients/client-actions";
import { DataTable } from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { ClientProps } from "@/types";

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
	return `${first}${last}`.toUpperCase();
}

const columns: ColumnDef<ClientProps>[] = [
	{
		accessorKey: "name",
		cell: ({ row }) => {
			const client = row.original;
			const fullName = client.name ?? client.email;
			return (
				<div className="flex items-center gap-3">
					<Avatar className="size-9">
						{client.image ? (
							<AvatarImage alt={fullName} src={client.image} />
						) : null}
						<AvatarFallback>{getInitials(fullName)}</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<p className="truncate font-medium">{fullName}</p>
						<p className="truncate text-muted-foreground text-xs">
							Đã thêm {formatDate(client.createdAt)}
						</p>
					</div>
				</div>
			);
		},
		header: "Tên",
	},
	{
		accessorKey: "phone",
		cell: ({ row }) => (
			<span className="text-muted-foreground">{row.original.phone ?? "—"}</span>
		),
		header: "Số điện thoại",
	},
	{
		accessorKey: "email",
		cell: ({ row }) => (
			<span className="text-muted-foreground">{row.original.email}</span>
		),
		header: "Email",
	},
	{
		accessorKey: "location",
		cell: ({ row }) => {
			const location = row.original.location;
			return (
				<Badge className="font-normal" variant="secondary">
					{location || "—"}
				</Badge>
			);
		},
		header: "Khu vực",
	},
	{
		cell: ({ row }) => <ClientActions clientId={row.original.id} />,
		header: () => <span className="sr-only">Thao tác</span>,
		id: "actions",
	},
];

export function ClientsTable({ clients }: { clients: ClientProps[] }) {
	return (
		<DataTable
			columns={columns}
			data={clients}
			emptyMessage="Không tìm thấy khách hàng nào. Hãy tạo khách hàng đầu tiên để bắt đầu."
			searchKeys={["name", "email", "phone"]}
			searchPlaceholder="Tìm khách hàng theo tên, email hoặc số điện thoại..."
		/>
	);
}
