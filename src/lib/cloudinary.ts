import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

function getPublicId(url: string): string | null {
	try {
		const parsed = new URL(url);
		if (!parsed.hostname.endsWith("res.cloudinary.com")) return null;
		const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
		if (!match) return null;
		return match[1].replace(/\.[a-zA-Z0-9]+$/, "");
	} catch {
		return null;
	}
}

export async function deleteCloudinaryImage(
	url: string | null | undefined,
): Promise<void> {
	if (!url) return;
	const publicId = getPublicId(url);
	if (!publicId) return;
	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.error("Không thể xóa ảnh trên Cloudinary:", error);
	}
}

export { cloudinary };
