"use client";

import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface ImageUploadProps {
	className?: string;
	/** Khóa toàn bộ control khi form đang submit. */
	disabled?: boolean;
	folder?: string;
	label?: string;
	onChange: (url: string) => void;
	onFileChange?: (file: File | null) => void;
	/** Upload to the server only on submit; otherwise preview locally first. */
	uploadOnSubmit?: boolean;
	value?: string | null;
}

export function ImageUpload({
	value,
	onChange,
	onFileChange,
	folder = "4-client-project-management-nextjs",
	label = "Tải ảnh lên",
	uploadOnSubmit = false,
	disabled = false,
	className,
}: ImageUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [localFile, setLocalFile] = useState<File | null>(null);

	const previewUrl = useMemo(
		() => (localFile ? URL.createObjectURL(localFile) : null),
		[localFile],
	);

	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	const displayedSrc = uploadOnSubmit
		? (previewUrl ?? (value || null))
		: value || null;

	const loading = disabled || uploading;

	async function uploadNow(file: File) {
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("folder", folder);
			const res = await fetch("/api/upload", {
				body: formData,
				method: "POST",
			});
			const data = (await res.json()) as { url?: string; error?: string };
			if (!res.ok || !data.url) {
				throw new Error(data.error ?? "Tải lên thất bại.");
			}
			onChange(data.url);
			toast.success("Ảnh đã tải lên");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Tải lên thất bại.");
		} finally {
			setUploading(false);
		}
	}

	function handleFile(file: File | null) {
		if (!file) {
			setLocalFile(null);
			onFileChange?.(null);
			onChange("");
			return;
		}
		if (uploadOnSubmit) {
			setLocalFile(file);
			onFileChange?.(file);
			onChange("");
		} else {
			void uploadNow(file);
		}
	}

	return (
		<div className={cn("flex items-center gap-4", className)}>
			{displayedSrc ? (
				<div
					className={cn(
						"relative",
						disabled && "pointer-events-none opacity-50",
					)}
				>
					<Image
						alt={label}
						className="size-24 rounded-lg border object-cover"
						height={96}
						src={displayedSrc}
						width={96}
					/>
					<button
						aria-label="Xóa ảnh"
						className={cn(
							"absolute -top-2 -right-2 rounded-full border bg-background p-1 shadow-sm transition-colors hover:bg-muted",
							disabled && "pointer-events-none opacity-50 hover:bg-transparent",
						)}
						disabled={disabled}
						onClick={() => handleFile(null)}
						type="button"
					>
						<X className="size-3.5" />
					</button>
				</div>
			) : (
				<button
					className="flex size-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
					disabled={loading}
					onClick={() => inputRef.current?.click()}
					type="button"
				>
					{loading ? (
						<Loader2 className="size-5 animate-spin" />
					) : (
						<UploadCloud className="size-5" />
					)}
					<span className="text-xs">
						{uploading ? "Đang tải lên..." : label}
					</span>
				</button>
			)}
			<input
				accept="image/*"
				className="hidden"
				onChange={(event) => {
					const file = event.target.files?.[0] ?? null;
					handleFile(file);
					event.target.value = "";
				}}
				ref={inputRef}
				type="file"
			/>
		</div>
	);
}
