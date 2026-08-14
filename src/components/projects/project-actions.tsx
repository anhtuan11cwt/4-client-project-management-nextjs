"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteProject } from "@/actions/projects";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function ProjectActions({
	projectId,
	slug,
}: {
	projectId: string;
	slug: string;
}) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	function handleDelete() {
		startTransition(async () => {
			try {
				await deleteProject(projectId);
				setOpen(false);
				router.refresh();
				toast.success("Đã xoá dự án");
			} catch {
				toast.error("Không thể xoá dự án");
			}
		});
	}

	return (
		<div className="flex items-center justify-end gap-1">
			<Button
				aria-label="Xem dự án"
				render={<Link href={`/dashboard/projects/view/${slug}`} />}
				size="icon-sm"
				variant="ghost"
			>
				<Eye />
			</Button>
			<Button
				aria-label="Sửa dự án"
				render={<Link href={`/dashboard/projects/${projectId}/edit`} />}
				size="icon-sm"
				variant="ghost"
			>
				<Pencil />
			</Button>
			<AlertDialog onOpenChange={setOpen} open={open}>
				<AlertDialogTrigger
					render={
						<Button
							aria-label="Xoá dự án"
							className="text-destructive hover:bg-destructive/10 hover:text-destructive"
							size="icon-sm"
							variant="ghost"
						/>
					}
				>
					<Trash2 />
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xoá dự án này?</AlertDialogTitle>
						<AlertDialogDescription>
							Hành động này không thể hoàn tác và sẽ xoá toàn bộ dữ liệu của dự
							án.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Huỷ</AlertDialogCancel>
						<AlertDialogAction disabled={isPending} onClick={handleDelete}>
							{isPending ? "Đang xoá..." : "Xoá"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
