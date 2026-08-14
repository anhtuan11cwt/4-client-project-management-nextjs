import { ArrowUpRight, Users } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { ClientProps } from "@/types";

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
	return `${first}${last}`.toUpperCase();
}

export function RecentClients({ clients }: { clients: ClientProps[] }) {
	return (
		<Card>
			<CardHeader className="flex-row items-center justify-between space-y-0">
				<div>
					<CardTitle className="text-base">Khách hàng gần đây</CardTitle>
					<CardDescription>Khách hàng mới được thêm</CardDescription>
				</div>
				<Link
					className="inline-flex items-center gap-1 font-medium text-primary text-sm hover:underline"
					href="/dashboard/clients"
				>
					Xem tất cả
					<ArrowUpRight className="size-3.5" />
				</Link>
			</CardHeader>
			<CardContent>
				{clients.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
						<span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
							<Users className="size-5" />
						</span>
						<p className="font-medium text-sm">Chưa có khách hàng</p>
						<p className="text-muted-foreground text-sm">
							Thêm khách hàng đầu tiên để bắt đầu theo dõi công việc.
						</p>
					</div>
				) : (
					<ul className="divide-y">
						{clients.map((client) => {
							const name = client.name ?? client.email;
							return (
								<li className="flex items-center gap-3 py-3" key={client.id}>
									<Avatar className="size-9">
										{client.image ? (
											<AvatarImage alt={name} src={client.image} />
										) : null}
										<AvatarFallback>{getInitials(name)}</AvatarFallback>
									</Avatar>
									<div className="min-w-0 flex-1">
										<p className="truncate font-semibold text-sm">{name}</p>
										<p className="truncate text-muted-foreground text-xs">
											{client.location ?? "—"} · Đã thêm{" "}
											{formatDate(client.createdAt)}
										</p>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</CardContent>
		</Card>
	);
}
