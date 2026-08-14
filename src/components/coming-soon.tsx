import { LayoutList } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function ComingSoon({
	title = "Sắp ra mắt",
	description = "Tính năng này sẽ có trong bản phát hành tiếp theo của Project Pro.",
}: {
	title?: string;
	description?: string;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col items-center justify-center gap-2 py-14 text-center">
				<span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
					<LayoutList className="size-5" />
				</span>
				<p className="font-medium text-sm">Chức năng đang được phát triển</p>
			</CardContent>
		</Card>
	);
}
