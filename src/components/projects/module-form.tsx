"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { toast } from "sonner";

import { createModule, updateModuleById } from "@/actions/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitDelay } from "@/lib/delay";

interface ModuleFormProps {
	editingId?: string;
	initialName?: string;
	onDone: () => void;
	projectId: string;
}

export function ModuleForm({
	projectId,
	editingId,
	initialName = "",
	onDone,
}: ModuleFormProps) {
	const isEditing = editingId != null;

	const boundAction = isEditing
		? updateModuleById.bind(null, editingId)
		: createModule.bind(null, projectId);
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
			toast.success(isEditing ? "Đã cập nhật hạng mục" : "Đã thêm hạng mục");
			onDone();
			return result;
		} catch (error) {
			toast.success(isEditing ? "Đã cập nhật hạng mục" : "Đã thêm hạng mục");
			onDone();
			throw error;
		}
	};
	const [state, formAction, isPending] = useActionState(action, undefined);

	return (
		<form action={formAction}>
			<fieldset className="flex items-center gap-2" disabled={isPending}>
				<Input
					defaultValue={initialName}
					disabled={isPending}
					name="name"
					placeholder="Tên hạng mục (ví dụ: Wireframing)"
				/>
				<Button disabled={isPending} type="submit">
					{isPending ? <Loader2 className="animate-spin" /> : null}
					{isEditing ? "Cập nhật" : "Thêm"}
				</Button>
				{isEditing ? (
					<Button
						disabled={isPending}
						onClick={onDone}
						type="button"
						variant="outline"
					>
						Hủy
					</Button>
				) : null}
				{state?.error ? (
					<p className="text-destructive text-sm">{state.error}</p>
				) : null}
			</fieldset>
		</form>
	);
}
