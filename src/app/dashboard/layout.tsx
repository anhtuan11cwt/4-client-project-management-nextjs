import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen flex-col overflow-hidden bg-muted/20 md:flex-row">
			<Sidebar />
			<main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
				<div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
			</main>
		</div>
	);
}
