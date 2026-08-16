"use client";

import { useActionState, useState } from "react";
import { toast } from "sonner";

import { updateUser } from "@/actions/profile";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitDelay } from "@/lib/delay";
import { uploadImage } from "@/lib/upload";
import { parseBrand } from "@/lib/validation";

interface BrandFormProps {
	user: {
		userLogo: string | null;
		companyName: string | null;
		email: string;
		phone: string | null;
		location: string | null;
	};
}

export function BrandForm({ user }: BrandFormProps) {
	const [logo, setLogo] = useState(user.userLogo ?? "");
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [phone, setPhone] = useState(user.phone ?? "");
	const action = async (
		prevState: Awaited<ReturnType<typeof updateUser>>,
		formData: FormData,
	) => {
		const parsed = parseBrand(formData);
		if (!parsed.success) {
			const message =
				parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.";
			toast.error(message);
			return { error: message };
		}
		await submitDelay();
		if (logoFile) {
			try {
				const url = await uploadImage(
					logoFile,
					"4-client-project-management-nextjs/brand",
				);
				formData.set("userLogo", url);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Tải lên thất bại.";
				toast.error(message);
				return { error: message };
			}
		}
		try {
			const result = await updateUser(prevState, formData);
			if (result?.error) {
				toast.error(result.error);
				return result;
			}
			toast.success("Đã cập nhật thương hiệu");
			return result;
		} catch (error) {
			toast.success("Đã cập nhật thương hiệu");
			throw error;
		}
	};
	const [state, formAction, isPending] = useActionState(action, undefined);

	return (
		<form action={formAction} className="space-y-6">
			<input name="userLogo" type="hidden" value={logo} />
			<input name="email" type="hidden" value={user.email} />

			<fieldset className="space-y-6" disabled={isPending}>
				<div>
					<Label>Logo thương hiệu</Label>
					<p className="mt-1 mb-3 text-muted-foreground text-xs">
						Hiển thị trên hóa đơn và thương hiệu của bạn.
					</p>
					<ImageUpload
						disabled={isPending}
						folder="4-client-project-management-nextjs/brand"
						label="Tải logo"
						onChange={setLogo}
						onFileChange={setLogoFile}
						uploadOnSubmit
						value={logo}
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-1.5">
						<Label htmlFor="companyName">Tên công ty</Label>
						<Input
							defaultValue={user.companyName ?? ""}
							id="companyName"
							name="companyName"
							placeholder="Công ty ABC"
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="email">Email</Label>
						<Input
							className="disabled:cursor-not-allowed"
							defaultValue={user.email}
							disabled
							id="email"
							type="email"
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="phone">Điện thoại</Label>
						<Input
							id="phone"
							inputMode="numeric"
							maxLength={10}
							name="phone"
							onChange={(event) =>
								setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
							}
							placeholder="0901234567"
							value={phone}
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="location">Địa chỉ</Label>
						<Input
							defaultValue={user.location ?? ""}
							id="location"
							name="location"
							placeholder="Thành phố Hồ Chí Minh"
						/>
					</div>
				</div>

				{state?.error ? (
					<p className="rounded-lg bg-destructive/10 px-3 py-2.5 text-destructive text-sm">
						{state.error}
					</p>
				) : null}

				<Button disabled={isPending} type="submit">
					{isPending ? "Đang lưu..." : "Lưu thương hiệu"}
				</Button>
			</fieldset>
		</form>
	);
}
