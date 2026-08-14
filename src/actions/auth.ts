"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseRegister } from "@/lib/validation";

export async function registerUser(
	_prevState: string | undefined,
	formData: FormData,
): Promise<string | undefined> {
	const parsed = parseRegister(formData);

	if (!parsed.success) {
		return parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.";
	}

	const { name, email, password } = parsed.data;

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		return "Đã tồn tại tài khoản với email này.";
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	await prisma.user.create({
		data: { email, name, password: hashedPassword, role: "ADMIN" },
	});

	redirect("/sign-in?registered=true");
}

export async function authenticate(
	_prevState: string | undefined,
	formData: FormData,
): Promise<string | undefined> {
	try {
		await signIn("credentials", {
			email: formData.get("email"),
			password: formData.get("password"),
			redirectTo: "/dashboard",
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return "Thông tin đăng nhập không hợp lệ.";
				default:
					return "Đã có lỗi xảy ra. Vui lòng thử lại.";
			}
		}
		throw error;
	}
}

export async function logout() {
	await signOut({ redirectTo: "/" });
}
