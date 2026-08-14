"use client";

import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { logout } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
	return `${first}${last}`.toUpperCase();
}

export function UserMenu({ user }: UserMenuProps) {
	const name = user.name ?? user.email ?? "Người dùng";

	function handleLogout() {
		toast.success("Đã đăng xuất");
		void logout();
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						aria-label="Menu người dùng"
						className="rounded-full"
						size="icon"
						variant="ghost"
					/>
				}
			>
				<Avatar className="size-8">
					{user.image ? <AvatarImage alt={name} src={user.image} /> : null}
					<AvatarFallback>{getInitials(name)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<p className="truncate font-semibold text-sm">{name}</p>
						<p className="truncate font-normal text-muted-foreground text-xs">
							{user.email}
						</p>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem render={<Link href="/dashboard" />}>
					<LayoutDashboard />
					Tổng quan
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>
					<LogOut />
					Đăng xuất
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
