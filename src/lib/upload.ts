export async function uploadImage(
	file: File,
	folder = "4-client-project-management-nextjs",
): Promise<string> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("folder", folder);

	const res = await fetch("/api/upload", {
		body: formData,
		method: "POST",
	});
	const data = (await res.json()) as { url?: string; error?: string };
	if (!res.ok || !data.url) {
		throw new Error(data.error ?? "Tải lên thất bại.");
	}
	return data.url;
}
