"use client";

import { Loader2, Plus } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "sonner";

import { createPayment } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { submitDelay } from "@/lib/delay";
import { parsePayment } from "@/lib/validation";

const paymentMethods = [
	"Chuyển khoản",
	"Tiền mặt",
	"Thẻ tín dụng",
	"Ví điện tử",
	"Ví MoMo",
	"Mobile Money",
];

export function PaymentForm({ projectId }: { projectId: string }) {
	const [open, setOpen] = useState(false);
	const [method, setMethod] = useState(paymentMethods[0]);
	const boundAction = createPayment.bind(null, projectId);
	const action = async (
		prevState: Awaited<ReturnType<typeof boundAction>>,
		formData: FormData,
	) => {
		const parsed = parsePayment(formData);
		if (!parsed.success) {
			const message =
				parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.";
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
			toast.success("Đã tạo thanh toán");
			setOpen(false);
			return result;
		} catch (error) {
			toast.success("Đã tạo thanh toán");
			setOpen(false);
			throw error;
		}
	};
	const [state, formAction, isPending] = useActionState(action, undefined);
	const today = new Date().toISOString().split("T")[0];

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger
				render={
					<Button type="button">
						<Plus />
						Thêm thanh toán
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Thêm thanh toán</DialogTitle>
					<DialogDescription>
						Ghi nhận một khoản thanh toán từ khách hàng.
					</DialogDescription>
				</DialogHeader>
				<form action={formAction} className="space-y-4">
					<fieldset className="space-y-4" disabled={isPending}>
						<div className="space-y-1.5">
							<Label htmlFor="title">Tiêu đề</Label>
							<Input
								id="title"
								name="title"
								placeholder="Đợt 1 - Khởi động dự án"
								required
							/>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="amount">Số tiền (₫)</Label>
								<Input
									id="amount"
									inputMode="numeric"
									min={0}
									name="amount"
									placeholder="0"
									required
									type="number"
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="tax">Thuế (₫)</Label>
								<Input
									defaultValue={0}
									id="tax"
									inputMode="numeric"
									min={0}
									name="tax"
									placeholder="0"
									type="number"
								/>
							</div>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="date">Ngày</Label>
								<Input defaultValue={today} id="date" name="date" type="date" />
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="method">Phương thức</Label>
								<Select
									name="method"
									onValueChange={(value) =>
										setMethod(value ?? paymentMethods[0])
									}
									value={method}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{paymentMethods.map((item) => (
											<SelectItem key={item} value={item}>
												{item}
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
								{isPending ? "Đang lưu..." : "Lưu thanh toán"}
							</Button>
							<Button
								disabled={isPending}
								onClick={() => setOpen(false)}
								type="button"
								variant="outline"
							>
								Hủy
							</Button>
						</div>
					</fieldset>
				</form>
			</DialogContent>
		</Dialog>
	);
}
