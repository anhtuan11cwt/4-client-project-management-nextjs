import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface BudgetProgressBarProps {
	budget: number;
	paidAmount: number;
}

export function BudgetProgressBar({
	budget,
	paidAmount,
}: BudgetProgressBarProps) {
	const remainingAmount = Math.max(budget - paidAmount, 0);
	const paidPercentage = budget > 0 ? (paidAmount / budget) * 100 : 0;
	const isBelowHalf = paidPercentage < 50;

	return (
		<div className="space-y-2 border-t pt-4">
			<div className="flex items-center justify-between text-sm">
				<span className="text-muted-foreground">Đã thanh toán</span>
				<span className="font-semibold tabular-nums">
					{formatCurrency(paidAmount)}
				</span>
			</div>
			<div
				aria-label={`Tiến độ thanh toán ${paidPercentage.toFixed(2)}%`}
				aria-valuemax={100}
				aria-valuemin={0}
				aria-valuenow={Math.min(paidPercentage, 100)}
				className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted"
				role="progressbar"
			>
				<div
					className={cn(
						"h-full rounded-full transition-all",
						isBelowHalf ? "bg-yellow-500" : "bg-green-500",
					)}
					style={{ width: `${Math.min(paidPercentage, 100)}%` }}
				/>
			</div>
			<div className="flex items-center justify-between text-muted-foreground text-xs">
				<span className="font-medium tabular-nums">
					{paidPercentage.toFixed(2)}%
				</span>
				<span>Còn lại: {formatCurrency(remainingAmount)}</span>
			</div>
		</div>
	);
}
