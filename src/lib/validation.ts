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

/** URL tùy chọn: cho phép rỗng, nếu có phải là liên kết http(s) hợp lệ. */
export const optionalUrlSchema = z
	.string()
	.trim()
	.refine(
		(value) => value === "" || /^https?:\/\/\S+$/.test(value),
		"Liên kết không hợp lệ.",
	);

/** Ngày tùy chọn: cho phép rỗng, nếu có phải là ngày hợp lệ. */
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

/** Ngân sách dự án: số nguyên không âm (chuyển từ chuỗi form). */
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
