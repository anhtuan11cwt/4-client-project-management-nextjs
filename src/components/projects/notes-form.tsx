"use client";

import { Extension } from "@tiptap/core";
import {
	createImageUpload,
	EditorContent,
	EditorRoot,
	handleImageDrop,
	handleImagePaste,
	type JSONContent,
	Placeholder,
	StarterKit,
	UpdatedImage,
	UploadImagesPlugin,
} from "novel";
import { useActionState, useState } from "react";
import { toast } from "sonner";

import { updateProjectNotes } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { submitDelay } from "@/lib/delay";
import { uploadImage } from "@/lib/upload";

const UploadImages = Extension.create({
	addProseMirrorPlugins() {
		return [
			UploadImagesPlugin({
				imageClass: "opacity-40 rounded-lg border border-stone-200",
			}),
		];
	},
	name: "uploadImages",
});

export const notesExtensions = [
	StarterKit,
	UpdatedImage,
	Placeholder.configure({
		includeChildren: true,
		placeholder: "Viết ghi chú dự án...",
	}),
	UploadImages,
];

const uploadFn = createImageUpload({
	onUpload: async (file) =>
		uploadImage(file, "4-client-project-management-nextjs/projects/notes"),
	validateFn: (file) => file.size < 5 * 1024 * 1024,
});

function parseInitialContent(notes: string | null): JSONContent {
	if (!notes) return {};
	try {
		const parsed: unknown = JSON.parse(notes);
		return typeof parsed === "object" && parsed !== null
			? (parsed as JSONContent)
			: {};
	} catch {
		return {};
	}
}

export function NotesForm({
	projectId,
	initialNotes,
	onDone,
}: {
	projectId: string;
	initialNotes: string | null;
	onDone: () => void;
}) {
	const boundAction = updateProjectNotes.bind(null, projectId);
	const action = async (
		prevState: Awaited<ReturnType<typeof boundAction>>,
		formData: FormData,
	) => {
		await submitDelay();
		try {
			const result = await boundAction(prevState, formData);
			if (result?.error) {
				toast.error(result.error);
				return result;
			}
			toast.success("Đã lưu ghi chú");
			onDone();
			return result;
		} catch (error) {
			toast.success("Đã lưu ghi chú");
			onDone();
			throw error;
		}
	};
	const [state, formAction, isPending] = useActionState(action, undefined);
	const [json, setJson] = useState<JSONContent | null>(() =>
		parseInitialContent(initialNotes),
	);

	return (
		<form action={formAction} className="space-y-3">
			<input
				name="notes"
				type="hidden"
				value={json ? JSON.stringify(json) : ""}
			/>
			<div className="rounded-lg border p-3">
				<EditorRoot>
					<EditorContent
						className="prose prose-sm max-w-none"
						editorProps={{
							attributes: {
								class: "prose prose-sm max-w-none min-h-40 focus:outline-none",
							},
							handleDrop: (view, event, _slice, moved) =>
								handleImageDrop(view, event, moved, uploadFn),
							handlePaste: (view, event) =>
								handleImagePaste(view, event, uploadFn),
						}}
						extensions={notesExtensions}
						initialContent={parseInitialContent(initialNotes)}
						onUpdate={({ editor }) => setJson(editor.getJSON())}
					/>
				</EditorRoot>
			</div>
			{state?.error ? (
				<p className="text-destructive text-sm">{state.error}</p>
			) : null}
			<div className="flex gap-2">
				<Button disabled={isPending} type="submit">
					{isPending ? "Đang lưu..." : "Lưu"}
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
		</form>
	);
}
