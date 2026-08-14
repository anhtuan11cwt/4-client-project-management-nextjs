export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		const { prisma } = await import("./lib/prisma");
		try {
			await prisma.$connect();
			const dbUrl = process.env.DATABASE_URL || "";
			const urlMatch = dbUrl.match(/\/\/([^@]+)@([^/]+)\/([^?]+)/);
			const host = urlMatch?.[2] || "unknown";
			const database = urlMatch?.[3] || "unknown";
			console.log("Kết nối MongoDB thành công");
			console.log(`   Host: ${host}`);
			console.log(`   Database: ${database}`);
		} catch (error) {
			console.error("Kết nối MongoDB thất bại:", error);
		}

		const { v2: cloudinary } = await import("cloudinary");
		cloudinary.config({
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		});
		try {
			const result = await cloudinary.api.ping();
			if (result.status === "ok") {
				console.log("Kết nối Cloudinary thành công");
				console.log(`   Cloud name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
			}
		} catch (error) {
			console.error("Kết nối Cloudinary thất bại:", error);
		}
	}
}
