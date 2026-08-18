"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useActionState, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";

import { createComment, updateCommentById } from "@/actions/comments";
import { Button } from "@/components/ui/button";
import { submitDelay } from "@/lib/delay";
import { cn } from "@/lib/utils";

const QuillEditor = dynamic(
	() => import("react-quill-new").then((m) => m.default),
	{ ssr: false },
);

const quillModules = {
	toolbar: [
		[{ header: [1, 2, 3, false] }],
		["bold", "italic", "underline", "strike"],
		[{ list: "ordered" }, { list: "bullet" }],
		["blockquote", "link", "image"],
		["clean"],
	],
};

const quillFormats = [
	"header",
	"bold",
	"italic",
	"underline",
	"strike",
	"list",
	"blockquote",
	"link",
	"image",
];

function isEmptyHtml(value: string): boolean {
	return value.replace(/<[^>]*>/g, "").trim().length === 0;
}

interface CommentFormProps {
	editingId?: string;
	initialContent?: string;
	onDone: () => void;
	projectId: string;
}

export function CommentForm({
	projectId,
	editingId,
	initialContent = "",
	onDone,
}: CommentFormProps) {
	const [content, setContent] = useState(initialContent);
	const isEditing = editingId != null;

	const boundAction = isEditing
		? updateCommentById.bind(null, editingId)
		: createComment.bind(null, projectId);
	const action = async (
		prevState: Awaited<ReturnType<typeof boundAction>>,
		formData: FormData,
	) => {
		if (isEmptyHtml(content)) {
			const message = "Nội dung bình luận là bắt buộc.";
			toast.error(message);
			return { error: message };
		}
		await submitDelay();
		try {
			const result = await boundAction(prevState, formData);
			if (result?.error) {
				toast.error(result.error);
				return result;
			}
			toast.success(isEditing ? "Đã cập nhật bình luận" : "Đã thêm bình luận");
			onDone();
			return result;
		} catch (error) {
			toast.success(isEditing ? "Đã cập nhật bình luận" : "Đã thêm bình luận");
			onDone();
			throw error;
		}
	};
	const [state, formAction, isPending] = useActionState(action, undefined);

	return (
		<form action={formAction}>
			<fieldset className="space-y-3" disabled={isPending}>
				<input name="content" type="hidden" value={content} />
				<div
					className={cn(
						"rounded-lg border transition-opacity",
						isPending && "pointer-events-none opacity-50",
					)}
				>
					<QuillEditor
						formats={quillFormats}
						modules={quillModules}
						onChange={setContent}
						placeholder="Viết bình luận..."
						readOnly={isPending}
						theme="snow"
						value={content}
					/>
				</div>
				{state?.error ? (
					<p className="text-destructive text-sm">{state.error}</p>
				) : null}
				<div className="flex items-center gap-2">
					<Button disabled={isPending} type="submit">
						{isPending ? <Loader2 className="animate-spin" /> : null}
						{isEditing
							? isPending
								? "Đang lưu..."
								: "Cập nhật bình luận"
							: isPending
								? "Đang lưu..."
								: "Thêm bình luận"}
					</Button>
					<Button
						disabled={isPending}
						onClick={onDone}
						type="button"
						variant="outline"
					>
						Hủy
					</Button>
				</div>
			</fieldset>
		</form>
	);
}
