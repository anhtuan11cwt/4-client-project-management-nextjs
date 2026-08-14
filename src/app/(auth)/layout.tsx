import { Logo } from "@/components/logo";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
			<div className="absolute top-6 left-6">
				<Logo href="/" />
			</div>
			{children}
		</div>
	);
}
