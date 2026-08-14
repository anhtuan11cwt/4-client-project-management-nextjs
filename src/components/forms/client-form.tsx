"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { toast } from "sonner";

import { createClient, updateUserById } from "@/actions/clients";
import { ImageUpload } from "@/components/image-upload";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitDelay } from "@/lib/delay";
import { uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { parseCreateClient, parseUpdateClient } from "@/lib/validation";

interface ClientFormProps {
	client?: {
		id: string;
		name: string | null;
		email: string;
		phone: string | null;
		location: string | null;
		image: string | null;
	};
}

export function ClientForm({ client }: ClientFormProps) {
	const isEditing = Boolean(client);
	const editingId = client?.id;
	const [image, setImage] = useState(client?.image ?? "");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [phone, setPhone] = useState(client?.phone ?? "");
	const boundAction = editingId
		? updateUserById.bind(null, editingId)
		: createClient;
	const action = async (
		prevState: Awaited<ReturnType<typeof boundAction>>,
		formData: FormData,
	) => {
		const parsed = isEditing
			? parseUpdateClient(formData)
			: parseCreateClient(formData);
		if (!parsed.success) {
			const message =
				parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.";
			toast.error(message);
			return { error: message };
		}
		await submitDelay();
		if (imageFile) {
			try {
				const url = await uploadImage(
					imageFile,
					"4-client-project-management-nextjs/clients",
				);
				formData.set("image", url);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Tải lên thất bại.";
				toast.error(message);
				return { error: message };
			}
		}
		try {
			const result = await boundAction(prevState, formData);
			if (result?.error) {
				toast.error(result.error);
				return result;
			}
			toast.success(isEditing ? "Đã cập nhật khách hàng" : "Đã tạo khách hàng");
			return result;
		} catch (error) {
			toast.success(isEditing ? "Đã cập nhật khách hàng" : "Đã tạo khách hàng");
			throw error;
		}
	};
	const [state, formAction, isPending] = useActionState(action, undefined);

	return (
		<form action={formAction} className="space-y-6">
			<input name="image" type="hidden" value={image} />

			<fieldset className="space-y-6" disabled={isPending}>
				<div>
					<Label>Ảnh đại diện</Label>
					<p className="mt-1 mb-3 text-muted-foreground text-xs">
						Không bắt buộc — giúp bạn nhận diện khách hàng nhanh hơn.
					</p>
					<ImageUpload
						disabled={isPending}
						label="Ảnh đại diện"
						onChange={setImage}
						onFileChange={setImageFile}
						uploadOnSubmit
						value={image}
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-1.5 sm:col-span-2">
						<Label htmlFor="name">Họ và tên</Label>
						<Input
							defaultValue={client?.name ?? ""}
							id="name"
							name="name"
							placeholder="Nguyễn Văn A"
							required
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="email">Email</Label>
						<Input
							defaultValue={client?.email ?? ""}
							id="email"
							name="email"
							placeholder="an@congty.com"
							required
							type="email"
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="phone">Số điện thoại</Label>
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
					<div className="space-y-1.5 sm:col-span-2">
						<Label htmlFor="location">Địa chỉ</Label>
						<Input
							defaultValue={client?.location ?? ""}
							id="location"
							name="location"
							placeholder="Thành phố Hồ Chí Minh"
						/>
					</div>
					<div className="space-y-1.5 sm:col-span-2">
						<Label htmlFor="password">
							{isEditing ? "Mật khẩu mới (không bắt buộc)" : "Mật khẩu"}
						</Label>
						<PasswordInput
							autoComplete="new-password"
							disabled={isPending}
							id="password"
							name="password"
							placeholder={
								isEditing
									? "Để trống nếu giữ mật khẩu hiện tại"
									: "Từ 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
							}
							required={!isEditing}
						/>
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
						{isPending
							? isEditing
								? "Đang lưu..."
								: "Đang tạo..."
							: isEditing
								? "Lưu thay đổi"
								: "Tạo khách hàng"}
					</Button>
					<Button
						className={cn(isPending && "pointer-events-none opacity-50")}
						disabled={isPending}
						render={<Link href="/dashboard/clients" />}
						variant="outline"
					>
						Hủy
					</Button>
				</div>
			</fieldset>
		</form>
	);
}
