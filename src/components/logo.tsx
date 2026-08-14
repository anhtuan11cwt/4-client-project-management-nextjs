import { LayoutGrid } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
	className,
	href = "/",
}: {
	className?: string;
	href?: string;
}) {
	return (
		<Link className={cn("flex items-center gap-2", className)} href={href}>
			<span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
				<LayoutGrid className="size-4" />
			</span>
			<span className="font-bold text-lg tracking-tight">Project Pro</span>
		</Link>
	);
}
