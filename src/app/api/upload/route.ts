import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
	const session = await auth();
	if (!session?.user?.id) {
		return NextResponse.json(
			{ error: "Không có quyền truy cập." },
			{ status: 401 },
		);
	}

	try {
		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const folder =
			(formData.get("folder") as string) ||
			"4-client-project-management-nextjs";

		if (!file) {
			return NextResponse.json(
				{ error: "Chưa cung cấp tệp." },
				{ status: 400 },
			);
		}

		const buffer = Buffer.from(await file.arrayBuffer());

		const result = await new Promise<{ secure_url: string }>(
			(resolve, reject) => {
				const stream = cloudinary.uploader.upload_stream(
					{
						folder,
						resource_type: "auto",
						transformation: { crop: "limit", width: 1200 },
					},
					(error, uploadResult) => {
						if (error) {
							reject(error);
						} else {
							resolve(uploadResult as { secure_url: string });
						}
					},
				);
				stream.end(buffer);
			},
		);

		return NextResponse.json({ url: result.secure_url });
	} catch (error) {
		console.error("Upload failed:", error);
		return NextResponse.json({ error: "Tải lên thất bại." }, { status: 500 });
	}
}
