"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { toast } from "sonner";
import { registerUser } from "@/actions/auth";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitDelay } from "@/lib/delay";
import { cn } from "@/lib/utils";
import { parseRegister } from "@/lib/validation";

export function SignUpForm() {
	const action = async (prevState: string | undefined, formData: FormData) => {
		const parsed = parseRegister(formData);
		if (!parsed.success) {
			const message =
				parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.";
			toast.error(message);
			return message;
		}
		await submitDelay();
		try {
			const error = await registerUser(prevState, formData);
			if (error) {
				toast.error(error);
				return error;
			}
			return error;
		} catch (error) {
			toast.success("Đã tạo tài khoản thành công");
			throw error;
		}
	};
	const [errorMessage, formAction, isPending] = useActionState(
		action,
		undefined,
	);

	return (
		<div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
			<div className="mb-8 text-center">
				<h1 className="font-bold text-2xl tracking-tight">
					Tạo không gian làm việc của bạn
				</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Bắt đầu quản lý khách hàng và dự án cùng Project Pro
				</p>
			</div>

			<form action={formAction} className="space-y-4">
				<fieldset className="space-y-4" disabled={isPending}>
					<div className="space-y-1.5">
						<Label htmlFor="name">Họ và tên</Label>
						<Input
							autoComplete="name"
							id="name"
							name="name"
							placeholder="Nguyễn Văn A"
							required
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="email">Email</Label>
						<Input
							autoComplete="email"
							id="email"
							name="email"
							placeholder="you@example.com"
							required
							type="email"
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="password">Mật khẩu</Label>
						<PasswordInput
							autoComplete="new-password"
							disabled={isPending}
							id="password"
							name="password"
							placeholder="Từ 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
							required
						/>
					</div>
					{errorMessage && (
						<p className="text-destructive text-sm">{errorMessage}</p>
					)}
					<Button className="w-full" disabled={isPending} type="submit">
						{isPending ? <Loader2 className="animate-spin" /> : null}
						{isPending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
					</Button>
				</fieldset>
			</form>

			<p className="mt-6 text-center text-muted-foreground text-sm">
				Đã có tài khoản?{" "}
				<Link
					className={cn(
						"font-medium text-primary hover:underline",
						isPending && "pointer-events-none opacity-50",
					)}
					href="/sign-in"
				>
					Đăng nhập
				</Link>
			</p>
		</div>
	);
}
