import { ComingSoon } from "@/components/coming-soon";

export default function PaymentsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Thanh toán</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Theo dõi các khoản thanh toán từ khách hàng.
				</p>
			</div>
			<ComingSoon title="Thanh toán" />
		</div>
	);
}
