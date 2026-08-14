import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
	preload: false,
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	description:
		"Project Pro giúp freelancer quản lý khách hàng, dự án, hóa đơn và danh mục dự án tại một nơi duy nhất.",
	title: "Project Pro",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			className={cn("font-sans", inter.variable)}
			lang="vi"
			suppressHydrationWarning
		>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					disableTransitionOnChange
					enableSystem
				>
					{children}
					<Toaster duration={2000} position="top-center" richColors />
				</ThemeProvider>
			</body>
		</html>
	);
}
