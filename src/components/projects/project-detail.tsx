"use client";

import {
	ArrowLeft,
	CalendarDays,
	ClipboardList,
	CreditCard,
	FolderKanban,
	Gauge,
	LayoutList,
	MessagesSquare,
	Receipt,
	UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, getProjectStatusLabel } from "@/lib/format";
import type { ProjectCommentProps, ProjectProps } from "@/types";

interface ProjectDetailProps {
	project: ProjectProps & {
		client?: {
			id: string;
			name: string | null;
			email: string;
			image: string | null;
		} | null;
		comments: ProjectCommentProps[];
	};
}

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
	return `${first}${last}`.toUpperCase();
}

function ComingSoon() {
	return (
		<Card>
			<CardContent className="flex flex-col items-center justify-center gap-2 py-14 text-center">
				<span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
					<LayoutList className="size-5" />
				</span>
				<p className="font-medium text-sm">Sắp ra mắt</p>
				<p className="max-w-xs text-muted-foreground text-sm">
					Phần này sẽ có trong bản phát hành Project Pro tiếp theo.
				</p>
			</CardContent>
		</Card>
	);
}

export function ProjectDetail({ project }: ProjectDetailProps) {
	const clientName =
		project.client?.name ?? project.client?.email ?? "Chưa gán khách hàng";
	return (
		<div className="space-y-6">
			<div>
				<Link
					className="inline-flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
					href="/dashboard/projects"
				>
					<ArrowLeft className="size-3.5" />
					Quay lại danh sách dự án
				</Link>
			</div>

			<div className="overflow-hidden rounded-2xl border bg-card">
				{project.bannerImage ? (
					<Image
						alt=""
						className="h-40 w-full object-cover sm:h-52"
						height={240}
						src={project.bannerImage}
						width={1200}
					/>
				) : (
					<div className="h-28 bg-gradient-to-r from-primary/20 via-chart-4/20 to-primary/10 sm:h-36" />
				)}
				<div className="p-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex items-start gap-4">
							{project.thumbnail ? (
								<Image
									alt={project.name}
									className="size-14 rounded-xl border object-cover"
									height={56}
									src={project.thumbnail}
									width={56}
								/>
							) : (
								<span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
									<FolderKanban className="size-6" />
								</span>
							)}
							<div>
								<h1 className="font-bold text-2xl tracking-tight">
									{project.name}
								</h1>
								<div className="mt-2 flex flex-wrap items-center gap-2">
									<Badge
										variant={
											project.status === "COMPLETED" ? "secondary" : "default"
										}
									>
										{getProjectStatusLabel(project.status)}
									</Badge>
									<span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
										<CalendarDays className="size-3.5" />
										{formatDate(project.startDate)}
										{" — "}
										{formatDate(project.endDate)}
									</span>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Avatar className="size-9">
								{project.client?.image ? (
									<AvatarImage alt={clientName} src={project.client.image} />
								) : null}
								<AvatarFallback>{getInitials(clientName)}</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-medium text-sm">{clientName}</p>
								<p className="text-muted-foreground text-xs">
									{project.client?.email ?? "Chưa liên kết khách hàng"}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Tabs className="w-full" defaultValue="overview">
				<TabsList className="w-full justify-start overflow-x-auto rounded-lg">
					<TabsTrigger value="overview">
						<Gauge />
						Tổng quan
					</TabsTrigger>
					<TabsTrigger value="invoices">
						<Receipt />
						Hoá đơn
					</TabsTrigger>
					<TabsTrigger value="payments">
						<CreditCard />
						Thanh toán
					</TabsTrigger>
					<TabsTrigger value="modules">
						<LayoutList />
						Hạng mục
					</TabsTrigger>
					<TabsTrigger value="tasks">
						<ClipboardList />
						Công việc
					</TabsTrigger>
					<TabsTrigger value="comments">
						<MessagesSquare />
						Bình luận
					</TabsTrigger>
				</TabsList>

				<TabsContent className="mt-4 space-y-4" value="overview">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Mô tả</CardTitle>
							<CardDescription>Giới thiệu về dự án này</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground text-sm leading-relaxed">
								{project.description || "Chưa có mô tả cho dự án này."}
							</p>
						</CardContent>
					</Card>
					<div className="grid gap-4 sm:grid-cols-3">
						<Card>
							<CardHeader className="pb-2">
								<CardDescription className="flex items-center gap-1.5">
									<CalendarDays className="size-3.5" />
									Ngày bắt đầu
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="font-semibold text-sm">
									{formatDate(project.startDate)}
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription className="flex items-center gap-1.5">
									<CalendarDays className="size-3.5" />
									Ngày kết thúc
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="font-semibold text-sm">
									{formatDate(project.endDate)}
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription className="flex items-center gap-1.5">
									<UserRound className="size-3.5" />
									Khách hàng
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="font-semibold text-sm">{clientName}</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent className="mt-4" value="invoices">
					<ComingSoon />
				</TabsContent>
				<TabsContent className="mt-4" value="payments">
					<ComingSoon />
				</TabsContent>
				<TabsContent className="mt-4" value="modules">
					<ComingSoon />
				</TabsContent>
				<TabsContent className="mt-4" value="tasks">
					<ComingSoon />
				</TabsContent>

				<TabsContent className="mt-4 space-y-4" value="comments">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Bình luận</CardTitle>
							<CardDescription>Thảo luận về dự án này</CardDescription>
						</CardHeader>
						<CardContent>
							{project.comments.length === 0 ? (
								<p className="text-muted-foreground text-sm">
									Chưa có bình luận. Tính năng bình luận sẽ có trong bản phát
									hành tiếp theo.
								</p>
							) : (
								<ul className="space-y-4">
									{project.comments.map((comment) => (
										<li className="flex items-start gap-3" key={comment.id}>
											<Avatar className="size-8">
												{comment.author?.image ? (
													<AvatarImage
														alt={comment.author.name ?? "Người dùng"}
														src={comment.author.image}
													/>
												) : null}
												<AvatarFallback>
													{getInitials(comment.author?.name ?? "U")}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-semibold text-sm">
													{comment.author?.name ?? "Không rõ"}
													<span className="ml-2 font-normal text-muted-foreground">
														{formatDate(comment.createdAt)}
													</span>
												</p>
												<p className="mt-0.5 text-muted-foreground text-sm">
													{comment.text}
												</p>
											</div>
										</li>
									))}
								</ul>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
