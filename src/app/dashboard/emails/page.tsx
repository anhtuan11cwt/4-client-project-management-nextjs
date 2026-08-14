import { ComingSoon } from "@/components/coming-soon";

export default function EmailsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Email</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Giao tiếp với khách hàng qua email.
				</p>
			</div>
			<ComingSoon title="Email" />
		</div>
	);
}
