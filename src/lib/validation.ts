import { z } from "zod";

const LATIN_LETTERS =
	"\u0041-\u005A\u0061-\u007A" +
	"\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF" +
	"\u0100-\u024F" +
	"\u1E00-\u1EFF";

const VIETNAMESE_NAME_REGEX = new RegExp(
	`^[${LATIN_LETTERS}]+( [${LATIN_LETTERS}]+)*$`,
	"u",
);

export const fullNameSchema = z
	.string()
	.transform((value) => value.normalize("NFC").replace(/\s+/g, " ").trim())
	.pipe(
		z
			.string()
			.min(2, "Họ tên phải có ít nhất 2 ký tự.")
			.max(100, "Họ tên không được vượt quá 100 ký tự.")
			.regex(
				VIETNAMESE_NAME_REGEX,
				"Họ tên chỉ có thể chứa chữ cái và dấu cách đơn (hỗ trợ tên tiếng Việt).",
			),
	);

export const vietnamPhoneSchema = z
	.string()
	.trim()
	.regex(
		/^0[0-9]{9}$/,
		"Số điện thoại phải gồm đúng 10 chữ số và bắt đầu bằng 0.",
	);

export const emailSchema = z
	.string()
	.trim()
	.min(1, "Email là bắt buộc.")
	.max(254, "Email không được vượt quá 254 ký tự.")
	.email("Vui lòng nhập email hợp lệ.");

export const optionalUrlSchema = z
	.string()
	.trim()
	.refine(
		(value) => value === "" || /^https?:\/\/\S+$/.test(value),
		"Liên kết không hợp lệ.",
	);

export const optionalDateSchema = z
	.string()
	.trim()
	.refine(
		(value) => value === "" || !Number.isNaN(new Date(value).getTime()),
		"Ngày không hợp lệ.",
	);

export const passwordSchema = z
	.string()
	.min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
	.max(128, "Mật khẩu không được vượt quá 128 ký tự.")
	.regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết hoa.")
	.regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết thường.")
	.regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số.")
	.regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.")
	.regex(/^\S+$/, "Mật khẩu không được chứa khoảng trắng.");

export const budgetSchema = z.coerce
	.number()
	.int()
	.min(0, "Ngân sách không được âm.")
	.max(9_999_999_999, "Ngân sách quá lớn.");

const clientFields = {
	companyDescription: z
		.string()
		.trim()
		.max(2000, "Mô tả công ty không được vượt quá 2000 ký tự."),
	companyName: z
		.string()
		.trim()
		.max(200, "Tên công ty không được vượt quá 200 ký tự."),
	email: emailSchema,
	image: optionalUrlSchema,
	location: z
		.string()
		.trim()
		.max(200, "Địa chỉ không được vượt quá 200 ký tự."),
	name: fullNameSchema,
	phone: z.union([vietnamPhoneSchema, z.literal("")]),
};

export const createClientSchema = z.object({
	...clientFields,
	password: passwordSchema,
});

export const updateClientSchema = z.object({
	...clientFields,
	password: z.union([passwordSchema, z.literal("")]),
});

export function collectClientValues(formData: FormData) {
	return {
		companyDescription: formData.get("companyDescription"),
		companyName: formData.get("companyName"),
		email: formData.get("email"),
		image: formData.get("image"),
		location: formData.get("location"),
		name: formData.get("name"),
		password: formData.get("password"),
		phone: formData.get("phone"),
	};
}

export function parseCreateClient(formData: FormData) {
	return createClientSchema.safeParse(collectClientValues(formData));
}

export function parseUpdateClient(formData: FormData) {
	return updateClientSchema.safeParse(collectClientValues(formData));
}

export const registerSchema = z.object({
	email: emailSchema,
	name: fullNameSchema,
	password: passwordSchema,
});

export function collectRegisterValues(formData: FormData) {
	return {
		email: formData.get("email"),
		name: formData.get("name"),
		password: formData.get("password"),
	};
}

export function parseRegister(formData: FormData) {
	return registerSchema.safeParse(collectRegisterValues(formData));
}

export const projectSchema = z
	.object({
		bannerImage: optionalUrlSchema,
		budget: budgetSchema,
		clientId: z.string().trim(),
		description: z
			.string()
			.trim()
			.max(5000, "Mô tả không được vượt quá 5000 ký tự."),
		endDate: optionalDateSchema,
		name: z
			.string()
			.trim()
			.min(1, "Tên dự án là bắt buộc.")
			.max(200, "Tên dự án không được vượt quá 200 ký tự."),
		notes: z.string().trim().max(100000, "Ghi chú quá dài."),
		startDate: optionalDateSchema,
		status: z.enum(["ONGOING", "COMPLETED"]),
		thumbnail: optionalUrlSchema,
	})
	.refine(
		(data) =>
			!data.startDate || !data.endDate || data.startDate <= data.endDate,
		{ message: "Ngày kết thúc phải sau ngày bắt đầu.", path: ["endDate"] },
	);

export function collectProjectValues(formData: FormData) {
	const value = (name: string) => String(formData.get(name) ?? "");
	return {
		bannerImage: value("bannerImage"),
		budget: value("budget"),
		clientId: value("clientId"),
		description: value("description"),
		endDate: value("endDate"),
		name: value("name"),
		notes: value("notes"),
		startDate: value("startDate"),
		status: value("status"),
		thumbnail: value("thumbnail"),
	};
}

export function parseProject(formData: FormData) {
	return projectSchema.safeParse(collectProjectValues(formData));
}

export const paymentSchema = z.object({
	amount: z.coerce.number().int().min(0, "Số tiền không được âm."),
	date: z.string().trim(),
	method: z.string().trim().min(1, "Vui lòng chọn phương thức thanh toán."),
	tax: z.coerce.number().int().min(0, "Thuế không được âm."),
	title: z
		.string()
		.trim()
		.min(1, "Tiêu đề là bắt buộc.")
		.max(200, "Tiêu đề không được vượt quá 200 ký tự."),
});

export function collectPaymentValues(formData: FormData) {
	return {
		amount: formData.get("amount"),
		date: formData.get("date"),
		method: formData.get("method"),
		tax: formData.get("tax"),
		title: formData.get("title"),
	};
}

export function parsePayment(formData: FormData) {
	return paymentSchema.safeParse(collectPaymentValues(formData));
}

export const brandSchema = z.object({
	companyName: z
		.string()
		.trim()
		.max(200, "Tên công ty không được vượt quá 200 ký tự."),
	email: emailSchema,
	location: z
		.string()
		.trim()
		.max(200, "Địa chỉ không được vượt quá 200 ký tự."),
	phone: z.union([vietnamPhoneSchema, z.literal("")]),
	userLogo: optionalUrlSchema,
});

export function collectBrandValues(formData: FormData) {
	return {
		companyName: formData.get("companyName"),
		email: formData.get("email"),
		location: formData.get("location"),
		phone: formData.get("phone"),
		userLogo: formData.get("userLogo"),
	};
}

export function parseBrand(formData: FormData) {
	return brandSchema.safeParse(collectBrandValues(formData));
}
