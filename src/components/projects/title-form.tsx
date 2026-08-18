"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { toast } from "sonner";

import { updateProjectTitle } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitDelay } from "@/lib/delay";

interface TitleFormProps {
	initialTitle: string;
	onDone: () => void;
	projectId: string;
}

export function TitleForm({ projectId, initialTitle, onDone }: TitleFormProps) {
	const router = useRouter();
	const [title, setTitle] = useState(initialTitle);
	const boundAction = updateProjectTitle.bind(null, projectId);
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
			toast.success("Đã cập nhật tiêu đề dự án");
			if (result?.slug) {
				router.replace(`/project/${result.slug}`);
			}
			onDone();
			return result;
		} catch (error) {
			toast.success("Đã cập nhật tiêu đề dự án");
			onDone();
			throw error;
		}
	};
	const [state, formAction, isPending] = useActionState(action, undefined);

	return (
		<form action={formAction}>
			<fieldset className="flex items-center gap-2" disabled={isPending}>
				<Input
					className="max-w-md font-bold text-lg"
					disabled={isPending}
					name="name"
					onChange={(event) => setTitle(event.target.value)}
					value={title}
				/>
				<Button disabled={isPending} size="sm" type="submit">
					{isPending ? <Loader2 className="animate-spin" /> : null}
					{isPending ? "Đang lưu..." : "Lưu"}
				</Button>
				<Button
					disabled={isPending}
					onClick={onDone}
					size="sm"
					type="button"
					variant="outline"
				>
					Hủy
				</Button>
				{state?.error ? (
					<p className="text-destructive text-sm">{state.error}</p>
				) : null}
			</fieldset>
		</form>
	);
}
