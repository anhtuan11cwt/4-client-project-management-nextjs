"use client";

import { LayoutDashboard, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

interface MobileMenuProps {
	links: Array<{ label: string; href: string }>;
	user?: {
		name?: string | null;
		email?: string | null;
	} | null;
}

export function MobileMenu({ links, user }: MobileMenuProps) {
	const [open, setOpen] = useState(false);
	const isLoggedIn = Boolean(user);

	return (
		<Sheet onOpenChange={setOpen} open={open}>
			<SheetTrigger
				render={
					<Button
						aria-label="Mở menu"
						className="md:hidden"
						size="icon"
						variant="ghost"
					/>
				}
			>
				<Menu />
			</SheetTrigger>
			<SheetContent className="flex w-72 flex-col p-0" side="right">
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<SheetDescription className="sr-only">
					Điều hướng chính
				</SheetDescription>
				<nav className="flex flex-col gap-1 px-3 pt-6">
					{links.map((link) => (
						<Link
							className="rounded-md px-3 py-2.5 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
							href={link.href}
							key={link.label}
							onClick={() => setOpen(false)}
						>
							{link.label}
						</Link>
					))}
				</nav>
				<div className="mt-auto flex flex-col gap-2 border-t p-4">
					{isLoggedIn ? (
						<>
							<Button
								className="w-full"
								onClick={() => setOpen(false)}
								render={<Link href="/dashboard" />}
							>
								<LayoutDashboard />
								Tổng quan
							</Button>
							<form
								action={logout}
								onSubmit={() => {
									setOpen(false);
									toast.success("Đã đăng xuất");
								}}
							>
								<Button className="w-full" type="submit" variant="outline">
									<LogOut />
									Đăng xuất
								</Button>
							</form>
						</>
					) : (
						<>
							<Button
								className="w-full"
								onClick={() => setOpen(false)}
								render={<Link href="/sign-in" />}
								variant="outline"
							>
								Đăng nhập
							</Button>
							<Button
								className="w-full"
								onClick={() => setOpen(false)}
								render={<Link href="/sign-up" />}
							>
								Bắt đầu
							</Button>
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
