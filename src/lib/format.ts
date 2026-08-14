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

export const PROJECT_STATUS_LABELS: Record<string, string> = {
	COMPLETED: "Hoàn thành",
	ONGOING: "Đang thực hiện",
};

export function getProjectStatusLabel(status: string): string {
	return PROJECT_STATUS_LABELS[status] ?? status;
}
