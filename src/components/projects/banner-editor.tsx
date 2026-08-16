"use client";

import {
	Image as ImageIcon,
	Link as LinkIcon,
	Loader2,
	Palette,
	Pencil,
	Search,
} from "lucide-react";
import Image from "next/image";
import { type FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import {
	updateProjectBannerImage,
	updateProjectGradient,
} from "@/actions/projects";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const gradients = [
	"bg-gradient-to-r from-sky-500 to-indigo-600",
	"bg-gradient-to-r from-violet-500 to-fuchsia-600",
	"bg-gradient-to-r from-emerald-500 to-teal-600",
	"bg-gradient-to-r from-rose-500 to-orange-500",
	"bg-gradient-to-r from-amber-500 to-yellow-600",
	"bg-gradient-to-r from-cyan-500 to-blue-600",
	"bg-gradient-to-r from-fuchsia-500 to-pink-600",
	"bg-gradient-to-r from-slate-600 to-slate-900",
];

function UnsplashSearch({ onSelect }: { onSelect: (url: string) => void }) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Array<{ id: string; url: string }>>(
		[],
	);
	const [searched, setSearched] = useState(false);
	const [apiPending, setApiPending] = useState(true);
	const [searching, startSearch] = useTransition();

	function handleSearch(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const keyword = query.trim();
		if (!keyword) return;
		startSearch(async () => {
			try {
				const res = await fetch(
					`/api/unsplash?query=${encodeURIComponent(keyword)}`,
				);
				const data = (await res.json()) as {
					error?: string;
					results?: Array<{ id: string; url: string }>;
				};
				if (!res.ok || !data.results) {
					if (data.error?.includes("Chưa cấu hình Unsplash API")) {
						setApiPending(true);
						toast.error("Unsplash API chưa được kích hoạt.");
						return;
					}
					toast.error(data.error ?? "Không tìm thấy ảnh.");
					return;
				}
				setApiPending(false);
				setResults(data.results);
				setSearched(true);
			} catch {
				toast.error("Lỗi khi tìm kiếm ảnh Unsplash.");
			}
		});
	}

	return (
		<div className="space-y-3">
			{apiPending ? (
				<p className="rounded-lg bg-muted/50 px-3 py-2.5 text-muted-foreground text-sm">
					Đang chờ phê duyệt truy cập Unsplash API (5 ngày làm việc). Bạn có thể
					thử tìm kiếm ngay khi API đã được kích hoạt.
				</p>
			) : null}
			<form className="flex gap-2" onSubmit={handleSearch}>
				<Input
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Tìm kiếm ảnh... (vd: office, code, design)"
					value={query}
				/>
				<Button disabled={searching} type="submit" variant="outline">
					{searching ? <Loader2 className="animate-spin" /> : <Search />}
				</Button>
			</form>
			{searching ? (
				<p className="text-muted-foreground text-sm">Đang tìm kiếm...</p>
			) : results.length > 0 ? (
				<div className="grid grid-cols-3 gap-2">
					{results.map((photo) => (
						<button
							className="overflow-hidden rounded-md border transition-transform hover:scale-105"
							key={photo.id}
							onClick={() => onSelect(photo.url)}
							type="button"
						>
							<Image
								alt="Unsplash"
								className="h-16 w-full object-cover"
								height={96}
								src={photo.url}
								width={160}
							/>
						</button>
					))}
				</div>
			) : searched ? (
				<p className="text-muted-foreground text-sm">
					Không tìm thấy ảnh phù hợp.
				</p>
			) : null}
		</div>
	);
}

export function BannerEditor({
	projectId,
	currentGradient,
	currentBanner,
}: {
	projectId: string;
	currentGradient: string | null;
	currentBanner: string | null;
}) {
	const [open, setOpen] = useState(false);
	const [selectedGradient, setSelectedGradient] = useState(
		currentGradient ?? "",
	);
	const [bannerUrl, setBannerUrl] = useState(currentBanner ?? "");
	const [linkUrl, setLinkUrl] = useState("");
	const [savingGradient, startGradient] = useTransition();
	const [savingBanner, startBanner] = useTransition();
	const [savingLink, startLink] = useTransition();

	function handleGradientClick(gradient: string) {
		setSelectedGradient(gradient);
		startGradient(async () => {
			const result = await updateProjectGradient(projectId, gradient);
			if (result?.error) {
				toast.error(result.error);
			} else {
				toast.success("Đã cập nhật gradient");
			}
		});
	}

	function handleBannerUpdate(url: string) {
		if (!url) return;
		setBannerUrl(url);
		startBanner(async () => {
			const result = await updateProjectBannerImage(projectId, url);
			if (result?.error) {
				toast.error(result.error);
			} else {
				toast.success("Đã cập nhật ảnh banner");
			}
		});
	}

	function handleLinkSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const url = linkUrl.trim();
		if (!url) return;
		setBannerUrl(url);
		startLink(async () => {
			const result = await updateProjectBannerImage(projectId, url);
			if (result?.error) {
				toast.error(result.error);
			} else {
				toast.success("Đã cập nhật ảnh banner");
				setLinkUrl("");
			}
		});
	}

	return (
		<Sheet onOpenChange={setOpen} open={open}>
			<SheetTrigger
				render={
					<Button size="sm" type="button" variant="outline">
						<Pencil />
						Chỉnh sửa banner
					</Button>
				}
			/>
			<SheetContent className="w-full overflow-y-auto sm:max-w-md">
				<SheetHeader>
					<SheetTitle>Chỉnh sửa banner</SheetTitle>
					<SheetDescription>
						Chọn gradient hoặc tải lên hình ảnh banner.
					</SheetDescription>
				</SheetHeader>
				<Tabs className="mt-6" defaultValue="gradient">
					<TabsList className="w-full justify-start overflow-x-auto">
						<TabsTrigger value="gradient">
							<Palette />
							Gradient
						</TabsTrigger>
						<TabsTrigger value="upload">
							<ImageIcon />
							Upload
						</TabsTrigger>
						<TabsTrigger value="link">
							<LinkIcon />
							Link
						</TabsTrigger>
						<TabsTrigger value="unsplash">Unsplash</TabsTrigger>
					</TabsList>

					<TabsContent className="mt-4 space-y-3" value="gradient">
						<div className="grid grid-cols-4 gap-2">
							{gradients.map((gradient) => (
								<button
									aria-label={`Gradient ${gradient}`}
									className={cn(
										"h-14 rounded-lg transition-transform hover:scale-105",
										gradient,
										selectedGradient === gradient &&
											"ring-2 ring-ring ring-offset-2",
									)}
									key={gradient}
									onClick={() => handleGradientClick(gradient)}
									type="button"
								/>
							))}
						</div>
						{savingGradient ? (
							<p className="text-muted-foreground text-sm">Đang lưu...</p>
						) : null}
					</TabsContent>

					<TabsContent className="mt-4 space-y-3" value="upload">
						<ImageUpload
							folder="4-client-project-management-nextjs/projects/banner"
							label="Tải banner"
							onChange={handleBannerUpdate}
							value={bannerUrl}
						/>
						{savingBanner ? (
							<p className="text-muted-foreground text-sm">Đang cập nhật...</p>
						) : null}
					</TabsContent>

					<TabsContent className="mt-4 space-y-3" value="link">
						<form className="space-y-3" onSubmit={handleLinkSubmit}>
							<div className="space-y-1.5">
								<Label htmlFor="banner-url">Liên kết hình ảnh</Label>
								<Input
									id="banner-url"
									onChange={(event) => setLinkUrl(event.target.value)}
									placeholder="https://example.com/image.jpg"
									required
									type="url"
									value={linkUrl}
								/>
							</div>
							<Button disabled={savingLink} type="submit">
								{savingLink ? "Đang cập nhật..." : "Cập nhật banner"}
							</Button>
						</form>
					</TabsContent>

					<TabsContent className="mt-4 space-y-3" value="unsplash">
						<UnsplashSearch onSelect={handleBannerUpdate} />
						{savingBanner ? (
							<p className="text-muted-foreground text-sm">Đang cập nhật...</p>
						) : null}
					</TabsContent>
				</Tabs>
			</SheetContent>
		</Sheet>
	);
}
