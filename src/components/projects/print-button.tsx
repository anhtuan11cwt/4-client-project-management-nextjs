"use client";

import { CloudDownload, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PrintButton() {
	return (
		<Button onClick={() => window.print()} type="button" variant="outline">
			<Printer />
			In
		</Button>
	);
}

export function DownloadPdfButton() {
	return (
		<Button onClick={() => window.print()} type="button" variant="outline">
			<CloudDownload />
			Tải PDF
		</Button>
	);
}
