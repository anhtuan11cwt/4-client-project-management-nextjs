import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

interface UnsplashPhoto {
	id: string;
	urls: { regular: string };
}

export async function GET(request: NextRequest) {
	const session = await auth();
	if (!session?.user?.id) {
		return NextResponse.json(
			{ error: "Không có quyền truy cập." },
			{ status: 401 },
		);
	}

	const query = request.nextUrl.searchParams.get("query")?.trim();
	const accessKey = process.env.UNSPLASH_ACCESS_KEY;

	if (!query || !accessKey) {
		return NextResponse.json(
			{ error: "Chưa cấu hình Unsplash API hoặc thiếu từ khóa tìm kiếm." },
			{ status: 400 },
		);
	}

	try {
		const url = new URL("https://api.unsplash.com/search/photos");
		url.searchParams.set("query", query);
		url.searchParams.set("per_page", "12");
		url.searchParams.set("orientation", "landscape");

		const res = await fetch(url, {
			cache: "no-store",
			headers: { Authorization: `Client-ID ${accessKey}` },
		});

		if (!res.ok) {
			return NextResponse.json(
				{ error: "Lỗi khi gọi Unsplash API." },
				{ status: res.status },
			);
		}

		const data = (await res.json()) as { results?: UnsplashPhoto[] };
		const results =
			data.results?.map((photo) => ({
				id: photo.id,
				url: photo.urls.regular,
			})) ?? [];

		return NextResponse.json({ results });
	} catch (error) {
		console.error("Unsplash search failed:", error);
		return NextResponse.json(
			{ error: "Lỗi khi tìm kiếm ảnh Unsplash." },
			{ status: 500 },
		);
	}
}
