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

export function calculateDifferenceDays(
	endDate: Date | string | null | undefined,
	now: number = Date.now(),
): number | null {
	if (!endDate) return null;
	const end = new Date(endDate);
	if (Number.isNaN(end.getTime())) return null;
	return Math.ceil((end.getTime() - now) / DAY_MS);
}

export function formatTimeDifference(days: number | null | undefined): string {
	if (days === null || days === undefined) return "—";
	const absolute = Math.abs(days);
	const year = Math.floor(absolute / 365);
	const unitYears = year > 0 ? "năm" : "ngày";
	const count = year > 0 ? year : absolute;
	if (days > 0) return `${count} ${unitYears} còn lại`;
	if (days < 0) return `${count} ${unitYears} quá hạn`;
	return "Hết hạn hôm nay";
}

export function formatDeadline(
	value: Date | string | null | undefined,
): string {
	return formatTimeDifference(calculateDifferenceDays(value));
}

export const PROJECT_STATUS_LABELS: Record<string, string> = {
	COMPLETED: "Hoàn thành",
	ONGOING: "Đang thực hiện",
};

export function getProjectStatusLabel(status: string): string {
	return PROJECT_STATUS_LABELS[status] ?? status;
}
