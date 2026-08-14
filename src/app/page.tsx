import {
	ArrowRight,
	BarChart3,
	CheckCircle2,
	CircleDollarSign,
	ClipboardList,
	FolderKanban,
	LayoutGrid,
	MessagesSquare,
	Sparkles,
	Users,
	XCircle,
} from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";

const navLinks = [
	{ href: "#features", label: "Tính năng" },
	{ href: "#solutions", label: "Giải pháp" },
	{ href: "#resources", label: "Tài nguyên" },
	{ href: "#resources", label: "Tài liệu" },
	{ href: "#resources", label: "Bảng giá" },
];

const withoutItems = [
	"Cập nhật trạng thái chìm trong các chuỗi email",
	"Khách hàng hỏi “dự án của tôi đâu rồi?” suốt cả tuần",
	"Hóa đơn và thanh toán theo dõi trên bảng tính",
	"Danh mục dự án rải rác trong các tệp và liên kết",
];

const withItems = [
	"Một không gian làm việc chung với trạng thái dự án theo thời gian thực",
	"Khách hàng đăng nhập và xem tiến độ theo thời gian thực",
	"Hóa đơn, thanh toán và mốc thời gian tại một nơi",
	"Một danh mục dự án luôn cập nhật và sẵn sàng chia sẻ",
];

const highlights = [
	{
		description:
			"Lưu trữ mọi khách hàng và thông tin liên hệ của họ tại một nơi.",
		icon: Users,
		title: "Khách hàng",
	},
	{
		description:
			"Theo dõi phạm vi, ngày tháng và trạng thái với trang riêng cho mỗi dự án.",
		icon: FolderKanban,
		title: "Dự án",
	},
	{
		description: "Hóa đơn và thanh toán được liên kết với dự án tạo ra chúng.",
		icon: CircleDollarSign,
		title: "Tài chính",
	},
	{
		description: "Để khách hàng theo dõi tiến độ thay vì chuyển tiếp email.",
		icon: MessagesSquare,
		title: "Giao tiếp",
	},
];

export default async function Home() {
	const session = await auth();
	const user = session?.user;

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
					<Logo />
					<nav className="hidden items-center gap-7 font-medium text-muted-foreground text-sm md:flex">
						{navLinks.map((link) => (
							<a
								className="transition-colors hover:text-foreground"
								href={link.href}
								key={link.label}
							>
								{link.label}
							</a>
						))}
					</nav>
					<div className="flex items-center gap-2">
						{user ? (
							<div className="hidden md:block">
								<UserMenu user={user} />
							</div>
						) : (
							<div className="hidden items-center gap-2 md:flex">
								<Button
									render={<Link href="/sign-in" />}
									size="sm"
									variant="ghost"
								>
									Đăng nhập
								</Button>
								<Button render={<Link href="/sign-up" />} size="sm">
									Bắt đầu
									<ArrowRight />
								</Button>
							</div>
						)}
						<MobileMenu links={navLinks} user={user} />
					</div>
				</div>
			</header>

			<main className="flex-1">
				<section className="mx-auto max-w-7xl px-4 pt-20 pb-20 sm:px-6 sm:pt-28">
					<div className="mx-auto max-w-3xl text-center">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 font-medium text-muted-foreground text-xs">
							<Sparkles className="size-3.5 text-primary" />
							Công cụ quản lý dự án ưu tiên khách hàng dành cho freelancer
						</div>
						<h1 className="text-balance font-bold text-4xl tracking-tight sm:text-6xl">
							Vận hành công việc tự do của bạn với{" "}
							<span className="bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
								sự rõ ràng
							</span>
						</h1>
						<p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
							Project Pro đưa khách hàng, dự án, hóa đơn và danh mục dự án của
							bạn vào một không gian làm việc duy nhất — để mọi người luôn biết
							rõ tình trạng công việc.
						</p>
						<div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Button render={<Link href="/sign-up" />} size="lg">
								Bắt đầu không gian làm việc miễn phí
								<ArrowRight />
							</Button>
							<Button
								render={<Link href="/sign-in" />}
								size="lg"
								variant="outline"
							>
								Đăng nhập tài khoản của bạn
							</Button>
						</div>
					</div>

					<div className="mx-auto mt-16 max-w-4xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-3">
								<span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<LayoutGrid className="size-5" />
								</span>
								<div>
									<p className="font-semibold text-sm">Bảng dự án trực tiếp</p>
									<p className="text-muted-foreground text-xs">
										Khách hàng của bạn thấy giao diện này ngay khi đăng nhập
									</p>
								</div>
							</div>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-600 text-xs">
								<span className="size-1.5 rounded-full bg-emerald-500" />
								Mọi dự án đúng tiến độ
							</span>
						</div>
						<div className="mt-6 grid gap-3 sm:grid-cols-3">
							{[
								{
									icon: ClipboardList,
									name: "Thiết kế lại website",
									status: "Đang thực hiện",
									statusClass: "bg-blue-500/10 text-blue-600",
								},
								{
									icon: BarChart3,
									name: "Báo cáo tăng trưởng Q3",
									status: "Đang thực hiện",
									statusClass: "bg-blue-500/10 text-blue-600",
								},
								{
									icon: FolderKanban,
									name: "Nhận diện thương hiệu",
									status: "Hoàn thành",
									statusClass: "bg-emerald-500/10 text-emerald-600",
								},
							].map((project) => (
								<div
									className="rounded-xl border bg-background p-4"
									key={project.name}
								>
									<div className="flex items-center gap-2">
										<span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
											<project.icon className="size-4" />
										</span>
										<p className="font-semibold text-sm">{project.name}</p>
									</div>
									<span
										className={`mt-3 inline-flex rounded-full px-2 py-0.5 font-semibold text-[11px] ${project.statusClass}`}
									>
										{project.status}
									</span>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="border-t bg-muted/30 py-20" id="features">
					<div className="mx-auto max-w-7xl px-4 sm:px-6">
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{highlights.map(({ icon: Icon, title, description }) => (
								<div
									className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm"
									key={title}
								>
									<span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<Icon className="size-4" />
									</span>
									<h3 className="mt-3 font-semibold text-sm">{title}</h3>
									<p className="mt-1 text-muted-foreground text-sm">
										{description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="py-20" id="solutions">
					<div className="mx-auto max-w-7xl px-4 sm:px-6">
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="text-balance font-bold text-3xl tracking-tight sm:text-4xl">
								Điều gì thay đổi khi khách hàng thấy công việc
							</h2>
							<p className="mt-4 text-muted-foreground">
								Ngừng quản lý kỳ vọng thủ công. Hãy cho mỗi dự án một nơi khách
								hàng thực sự có thể ghé thăm.
							</p>
						</div>
						<div className="mt-12 grid gap-6 md:grid-cols-2">
							<div className="rounded-2xl border bg-background p-7">
								<div className="flex items-center gap-2 font-semibold text-sm">
									<span className="flex size-7 items-center justify-center rounded-md bg-destructive/10 text-destructive">
										<XCircle className="size-4" />
									</span>
									Không có Project Pro
								</div>
								<ul className="mt-6 space-y-4">
									{withoutItems.map((item) => (
										<li
											className="flex items-start gap-3 text-muted-foreground text-sm"
											key={item}
										>
											<XCircle className="mt-0.5 size-4 shrink-0 text-destructive/70" />
											{item}
										</li>
									))}
								</ul>
							</div>
							<div className="rounded-2xl border-2 border-primary/20 bg-primary/[0.03] p-7">
								<div className="flex items-center gap-2 font-semibold text-sm">
									<span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
										<CheckCircle2 className="size-4" />
									</span>
									Có Project Pro
								</div>
								<ul className="mt-6 space-y-4">
									{withItems.map((item) => (
										<li className="flex items-start gap-3 text-sm" key={item}>
											<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
											{item}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</section>

				<section
					className="border-t bg-primary py-16 text-primary-foreground"
					id="resources"
				>
					<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:text-left">
						<div>
							<h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
								Sẵn sàng làm việc với sự rõ ràng?
							</h2>
							<p className="mt-2 text-primary-foreground/80">
								Tạo không gian làm việc trong chưa đầy một phút — không cần thẻ
								tín dụng.
							</p>
						</div>
						<Button
							render={<Link href="/sign-up" />}
							size="lg"
							variant="secondary"
						>
							Tạo không gian làm việc
							<ArrowRight />
						</Button>
					</div>
				</section>
			</main>

			<footer className="border-t bg-background" id="footer">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
					<Logo />
					<p className="text-muted-foreground text-sm">
						© {new Date().getFullYear()} Project Pro. Bảo lưu mọi quyền.
					</p>
					<div className="flex gap-5 text-muted-foreground text-sm">
						<a className="hover:text-foreground" href="#footer">
							Bảo mật
						</a>
						<a className="hover:text-foreground" href="#footer">
							Điều khoản
						</a>
						<a className="hover:text-foreground" href="#footer">
							Liên hệ
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
