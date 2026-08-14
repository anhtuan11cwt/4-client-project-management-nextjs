"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteUser } from "@/actions/clients";
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

export function ClientActions({ clientId }: { clientId: string }) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	function handleDelete() {
		startTransition(async () => {
			try {
				await deleteUser(clientId);
				setOpen(false);
				router.refresh();
				toast.success("Đã xoá khách hàng");
			} catch {
				toast.error("Không thể xoá khách hàng");
			}
		});
	}

	return (
		<div className="flex items-center justify-end gap-1">
			<Button
				aria-label="Sửa khách hàng"
				render={<Link href={`/dashboard/clients/${clientId}/edit`} />}
				size="icon-sm"
				variant="ghost"
			>
				<Pencil />
			</Button>
			<AlertDialog onOpenChange={setOpen} open={open}>
				<AlertDialogTrigger
					render={
						<Button
							aria-label="Xoá khách hàng"
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
						<AlertDialogTitle>Xoá khách hàng này?</AlertDialogTitle>
						<AlertDialogDescription>
							Hành động này không thể hoàn tác. Các dự án đang gán cho khách
							hàng này sẽ bị bỏ gán.
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
