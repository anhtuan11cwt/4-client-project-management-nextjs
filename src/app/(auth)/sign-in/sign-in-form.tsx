"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { authenticate } from "@/actions/auth";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitDelay } from "@/lib/delay";
import { cn } from "@/lib/utils";
import { emailSchema } from "@/lib/validation";

export function SignInForm() {
	const searchParams = useSearchParams();
	const registered = searchParams.get("registered") === "true";
	const returnUrl = searchParams.get("returnUrl") ?? "";
	const action = async (prevState: string | undefined, formData: FormData) => {
		const email = String(formData.get("email") ?? "");
		const password = String(formData.get("password") ?? "");
		if (!email.trim() || !password) {
			toast.error("Vui lòng nhập email và mật khẩu.");
			return "Vui lòng nhập email và mật khẩu.";
		}
		const emailCheck = emailSchema.safeParse(email);
		if (!emailCheck.success) {
			const message =
				emailCheck.error.issues[0]?.message ?? "Email không hợp lệ.";
			toast.error(message);
			return message;
		}
		await submitDelay();
		try {
			const error = await authenticate(prevState, formData);
			if (error) {
				toast.error(error);
				return error;
			}
			return error;
		} catch (error) {
			toast.success("Đã đăng nhập thành công");
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
				<h1 className="font-bold text-2xl tracking-tight">Chào mừng trở lại</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Đăng nhập vào không gian làm việc Project Pro của bạn
				</p>
			</div>

			{registered && (
				<p className="mb-4 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-emerald-600 text-sm">
					Tạo tài khoản thành công. Hãy đăng nhập để tiếp tục.
				</p>
			)}

			<form action={formAction} className="space-y-4">
				<input name="returnUrl" type="hidden" value={returnUrl} />
				<fieldset className="space-y-4" disabled={isPending}>
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
							autoComplete="current-password"
							disabled={isPending}
							id="password"
							name="password"
							placeholder="••••••••"
							required
						/>
					</div>
					{errorMessage && (
						<p className="text-destructive text-sm">{errorMessage}</p>
					)}
					<Button className="w-full" disabled={isPending} type="submit">
						{isPending ? <Loader2 className="animate-spin" /> : null}
						{isPending ? "Đang đăng nhập..." : "Đăng nhập"}
					</Button>
				</fieldset>
			</form>

			<p className="mt-6 text-center text-muted-foreground text-sm">
				Chưa có tài khoản?{" "}
				<Link
					className={cn(
						"font-medium text-primary hover:underline",
						isPending && "pointer-events-none opacity-50",
					)}
					href="/sign-up"
				>
					Tạo tài khoản
				</Link>
			</p>
		</div>
	);
}
