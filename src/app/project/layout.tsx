import { Logo } from "@/components/logo";
import { Sidebar } from "@/components/sidebar";
import { UserMenu } from "@/components/user-menu";
import { getSession } from "@/lib/dal";

export default async function ProjectLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();
	const isClient = session?.user?.role === "CLIENT";

	if (isClient) {
		return (
			<div className="min-h-screen bg-background">
				<header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6 print:hidden">
					<Logo href="/" />
					{session?.user ? <UserMenu user={session.user} /> : null}
				</header>
				<main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 print:max-w-none print:p-0">
					{children}
				</main>
			</div>
		);
	}

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-muted/20 md:flex-row print:block print:h-auto print:overflow-visible">
			<div className="print:hidden">
				<Sidebar />
			</div>
			<main className="min-h-0 min-w-0 flex-1 overflow-y-auto print:overflow-visible">
				<div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 print:max-w-none print:p-0">
					{children}
				</div>
			</main>
		</div>
	);
}
