import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
	footer?: string;
	icon: LucideIcon;
	iconClassName?: string;
	isCurrency?: boolean;
	label: string;
	value: string | number;
}

export function OverviewCard({
	label,
	value,
	icon: Icon,
	iconClassName,
	footer,
	isCurrency = false,
}: OverviewCardProps) {
	return (
		<Card>
			<CardContent className="p-5">
				<div className="flex items-center justify-between">
					<p className="font-medium text-muted-foreground text-sm">{label}</p>
					<span
						className={cn(
							"flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
							iconClassName,
						)}
					>
						<Icon className="size-4" />
					</span>
				</div>
				<p
					className={cn(
						"mt-3 font-bold tracking-tight",
						isCurrency ? "text-xl" : "text-3xl",
					)}
				>
					{isCurrency ? formatCurrency(Number(value)) : value}
				</p>
				{footer ? (
					<p className="mt-1 text-muted-foreground text-xs">{footer}</p>
				) : null}
			</CardContent>
		</Card>
	);
}
