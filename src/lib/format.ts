export function formatDate(value: Date | string | null | undefined): string {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date);
}

export function formatDateTime(
	value: Date | string | null | undefined,
): string {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date);
}

export function formatDateInput(
	value: Date | string | null | undefined,
): string {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function formatCurrency(value: number | null | undefined): string {
	return `${new Intl.NumberFormat("vi-VN").format(value ?? 0)} ₫`;
}

const DAY_MS = 86_400_000;

export function formatDeadline(
	value: Date | string | null | undefined,
): string {
	if (!value) return "—";
	const end = new Date(value);
	if (Number.isNaN(end.getTime())) return "—";
	const days = Math.ceil((end.getTime() - Date.now()) / DAY_MS);
	if (days < 0) return "Quá hạn";
	if (days === 0) return "Hôm nay";
	return `${days} ngày`;
}

export const PROJECT_STATUS_LABELS: Record<string, string> = {
	COMPLETED: "Hoàn thành",
	ONGOING: "Đang thực hiện",
};

export function getProjectStatusLabel(status: string): string {
	return PROJECT_STATUS_LABELS[status] ?? status;
}
