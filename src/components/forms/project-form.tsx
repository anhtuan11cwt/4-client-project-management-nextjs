"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { toast } from "sonner";

import { createProject, updateProjectById } from "@/actions/projects";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitDelay } from "@/lib/delay";
import { formatDateInput } from "@/lib/format";
import { uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface ProjectFormProps {
	clients: Array<{ id: string; name: string | null; email: string }>;
	project?: {
		id: string;
		name: string;
		description: string | null;
		notes: string | null;
		thumbnail: string | null;
		startDate: Date | null;
		endDate: Date | null;
		status: "ONGOING" | "COMPLETED";
		clientId: string | null;
	};
}

const statusItems = {
	COMPLETED: "Hoàn thành",
	ONGOING: "Đang thực hiện",
} as const;

export function ProjectForm({ clients, project }: ProjectFormProps) {
	const isEditing = Boolean(project);
	const editingId = project?.id;
	const [thumbnail, setThumbnail] = useState(project?.thumbnail ?? "");
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [status, setStatus] = useState<"ONGOING" | "COMPLETED">(
		project?.status ?? "ONGOING",
	);
	const [clientId, setClientId] = useState(project?.clientId ?? "none");
	const boundAction = editingId
		? updateProjectById.bind(null, editingId)
		: createProject;
	const action = async (
		prevState: Awaited<ReturnType<typeof boundAction>>,
		formData: FormData,
	) => {
		await submitDelay();
		if (thumbnailFile) {
			try {
				const url = await uploadImage(
					thumbnailFile,
					"4-client-project-management-nextjs/projects",
				);
				formData.set("thumbnail", url);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Tải lên thất bại.";
				toast.error(message);
				return { error: message };
			}
		}
		try {
			const result = await boundAction(prevState, formData);
			if (result?.error) {
				toast.error(result.error);
				return result;
			}
			toast.success(isEditing ? "Đã cập nhật dự án" : "Đã tạo dự án");
			return result;
		} catch (error) {
			toast.success(isEditing ? "Đã cập nhật dự án" : "Đã tạo dự án");
			throw error;
		}
	};
	const [state, formAction, isPending] = useActionState(action, undefined);

	const clientItems = clients.reduce<Record<string, string>>(
		(acc, client) => {
			acc[client.id] = client.name ?? client.email;
			return acc;
		},
		{ none: "Không có khách hàng" },
	);

	return (
		<form action={formAction} className="space-y-6">
			<input name="thumbnail" type="hidden" value={thumbnail} />

			<fieldset className="space-y-6" disabled={isPending}>
				<div>
					<Label>Ảnh bìa dự án</Label>
					<p className="mt-1 mb-3 text-muted-foreground text-xs">
						Không bắt buộc — hiển thị trong danh sách dự án.
					</p>
					<ImageUpload
						disabled={isPending}
						label="Ảnh bìa"
						onChange={setThumbnail}
						onFileChange={setThumbnailFile}
						uploadOnSubmit
						value={thumbnail}
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-1.5 sm:col-span-2">
						<Label htmlFor="name">Tên dự án</Label>
						<Input
							defaultValue={project?.name ?? ""}
							id="name"
							name="name"
							placeholder="Thiết kế lại website"
							required
						/>
					</div>
					<div className="space-y-1.5 sm:col-span-2">
						<Label htmlFor="description">Mô tả</Label>
						<Textarea
							defaultValue={project?.description ?? ""}
							id="description"
							name="description"
							placeholder="Dự án này nói về điều gì?"
							rows={4}
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="startDate">Ngày bắt đầu</Label>
						<Input
							defaultValue={formatDateInput(project?.startDate)}
							id="startDate"
							name="startDate"
							type="date"
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="endDate">Ngày kết thúc</Label>
						<Input
							defaultValue={formatDateInput(project?.endDate)}
							id="endDate"
							name="endDate"
							type="date"
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="status">Trạng thái</Label>
						<Select
							disabled={isPending}
							items={statusItems}
							name="status"
							onValueChange={(value) =>
								setStatus(value as "ONGOING" | "COMPLETED")
							}
							value={status}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ONGOING">Đang thực hiện</SelectItem>
								<SelectItem value="COMPLETED">Hoàn thành</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="clientId">Khách hàng</Label>
						<Select
							disabled={isPending}
							items={clientItems}
							name="clientId"
							onValueChange={(value) => setClientId(value ?? "none")}
							value={clientId}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">Không có khách hàng</SelectItem>
								{clients.map((client) => (
									<SelectItem key={client.id} value={client.id}>
										{client.name ?? client.email}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{state?.error ? (
					<p className="rounded-lg bg-destructive/10 px-3 py-2.5 text-destructive text-sm">
						{state.error}
					</p>
				) : null}

				<div className="flex items-center gap-3">
					<Button disabled={isPending} type="submit">
						{isPending ? <Loader2 className="animate-spin" /> : null}
						{isPending
							? isEditing
								? "Đang lưu..."
								: "Đang tạo..."
							: isEditing
								? "Lưu thay đổi"
								: "Tạo dự án"}
					</Button>
					<Button
						className={cn(isPending && "pointer-events-none opacity-50")}
						disabled={isPending}
						render={<Link href="/dashboard/projects" />}
						variant="outline"
					>
						Hủy
					</Button>
				</div>
			</fieldset>
		</form>
	);
}
