"use client";

import {
	BarChart3,
	Briefcase,
	DollarSign,
	FileText,
	FolderKanban,
	Handshake,
	LayoutGrid,
	LogOut,
	Mail,
	Menu,
	Palette,
	Settings,
	Users,
	UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { logout } from "@/actions/auth";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navGroups = [
	{
		links: [
			{ href: "/dashboard/clients", icon: Users, title: "Khách hàng" },
			{ href: "/dashboard/projects", icon: FolderKanban, title: "Dự án" },
		],
		title: "Khách hàng & Dự án",
	},
	{
		links: [
			{ href: "/dashboard/invoices", icon: DollarSign, title: "Hóa đơn" },
			{ href: "/dashboard/payments", icon: Handshake, title: "Thanh toán" },
		],
		title: "Tài chính",
	},
	{
		links: [
			{ href: "/dashboard/members", icon: UsersRound, title: "Thành viên" },
		],
		title: "Nhóm",
	},
	{
		links: [{ href: "/dashboard/emails", icon: Mail, title: "Email" }],
		title: "Giao tiếp",
	},
	{
		links: [
			{
				href: "/dashboard/portfolio",
				icon: Briefcase,
				title: "Danh mục dự án",
			},
			{
				href: "/dashboard/file-manager",
				icon: FileText,
				title: "Quản lý tệp",
			},
		],
		title: "Danh mục dự án",
	},
	{
		links: [
			{
				href: "/dashboard/reports/project-progress",
				icon: BarChart3,
				title: "Tiến độ dự án",
			},
		],
		title: "Báo cáo",
	},
	{
		links: [
			{
				href: "/dashboard/brand-settings",
				icon: Palette,
				title: "Thương hiệu",
			},
			{
				href: "/dashboard/settings/account",
				icon: Settings,
				title: "Cài đặt tài khoản",
			},
		],
		title: "Cài đặt",
	},
];

const overviewLink = {
	href: "/dashboard",
	icon: LayoutGrid,
	title: "Tổng quan",
};

function SidebarNav() {
	const pathname = usePathname();

	const isActive = (href: string) =>
		href === "/dashboard"
			? pathname === "/dashboard"
			: pathname.startsWith(href);

	return (
		<nav className="min-h-0 flex-1 px-3">
			<ScrollArea className="h-full pr-1">
				<div className="space-y-6 py-4">
					<div>
						<Link
							className={cn(
								"flex items-center gap-3 rounded-md px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground",
								isActive(overviewLink.href) &&
									"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
							)}
							href={overviewLink.href}
						>
							<overviewLink.icon className="size-4 shrink-0" />
							{overviewLink.title}
						</Link>
					</div>

					{navGroups.map((group) => (
						<div key={group.title}>
							<p className="mb-2 px-3 font-semibold text-[11px] text-muted-foreground/80 uppercase tracking-wider">
								{group.title}
							</p>
							<div className="space-y-0.5">
								{group.links.map((link) => (
									<Link
										className={cn(
											"flex items-center gap-3 rounded-md px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground",
											isActive(link.href) &&
												"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
										)}
										href={link.href}
										key={link.href}
									>
										<link.icon className="size-4 shrink-0" />
										{link.title}
									</Link>
								))}
							</div>
						</div>
					))}
				</div>
			</ScrollArea>
		</nav>
	);
}

function SidebarFooter() {
	return (
		<div className="border-t p-3">
			<form action={logout} onSubmit={() => toast.success("Đã đăng xuất")}>
				<Button
					className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
					type="submit"
					variant="ghost"
				>
					<LogOut className="size-4 shrink-0" />
					Đăng xuất
				</Button>
			</form>
		</div>
	);
}

export function Sidebar() {
	return (
		<>
			<aside className="hidden h-full w-64 shrink-0 flex-col overflow-hidden border-r bg-background md:flex">
				<div className="flex h-16 items-center border-b px-4">
					<Logo href="/dashboard" />
				</div>
				<SidebarNav />
				<SidebarFooter />
			</aside>

			<div className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background px-4 md:hidden">
				<Sheet>
					<SheetTrigger
						render={
							<Button
								aria-label="Mở menu điều hướng"
								size="icon-sm"
								variant="ghost"
							/>
						}
					>
						<Menu />
					</SheetTrigger>
					<SheetContent className="w-72 p-0" side="left">
						<SheetTitle className="sr-only">Điều hướng</SheetTitle>
						<div className="flex h-dvh flex-col overflow-hidden">
							<div className="flex h-16 items-center border-b px-4">
								<Logo href="/dashboard" />
							</div>
							<SidebarNav />
							<SidebarFooter />
						</div>
					</SheetContent>
				</Sheet>
				<Logo href="/dashboard" />
			</div>
		</>
	);
}
