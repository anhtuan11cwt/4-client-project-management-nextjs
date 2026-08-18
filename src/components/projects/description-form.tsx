"use client";

import { useActionState } from "react";
import { toast } from "sonner";

import { updateProjectDescription } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitDelay } from "@/lib/delay";

export function DescriptionForm({
	projectId,
	initialDescription,
	onDone,
}: {
	projectId: string;
	initialDescription: string | null;
	onDone: () => void;
}) {
	const boundAction = updateProjectDescription.bind(null, projectId);
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
			toast.success("Đã cập nhật mô tả");
			onDone();
			return result;
		} catch (error) {
			toast.success("Đã cập nhật mô tả");
			onDone();
			throw error;
		}
	};
	const [state, formAction, isPending] = useActionState(action, undefined);

	return (
		<form action={formAction}>
			<fieldset className="space-y-3" disabled={isPending}>
				<Textarea
					defaultValue={initialDescription ?? ""}
					disabled={isPending}
					name="description"
					placeholder="Mô tả dự án..."
					rows={4}
				/>
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
			</fieldset>
		</form>
	);
}
