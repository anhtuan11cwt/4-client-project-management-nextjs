"use client";

import {
	ArrowLeft,
	Building2,
	CalendarDays,
	CircleDollarSign,
	ClipboardList,
	CreditCard,
	FolderKanban,
	Gauge,
	LayoutList,
	MessagesSquare,
	Pencil,
	Plus,
	Receipt,
	Timer,
	UserRound,
	X,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DescriptionForm } from "@/components/projects/description-form";
import { NotesView } from "@/components/projects/notes-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	formatCurrency,
	formatDate,
	formatDeadline,
	getProjectStatusLabel,
} from "@/lib/format";
import type { ProjectCommentProps, ProjectProps } from "@/types";

const NotesForm = dynamic(
	() => import("@/components/projects/notes-form").then((m) => m.NotesForm),
	{ ssr: false },
);

interface ProjectDetailProps {
	project: ProjectProps & {
		client?: {
			id: string;
			name: string | null;
			email: string;
			image: string | null;
			companyName: string | null;
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

function EmptyState({
	icon: Icon,
	title,
	description,
	actionLabel,
}: {
	icon: typeof FolderKanban;
	title: string;
	description: string;
	actionLabel?: string;
}) {
	return (
		<Card>
			<CardContent className="flex flex-col items-center justify-center gap-2 py-14 text-center">
				<span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
					<Icon className="size-5" />
				</span>
				<p className="font-medium text-sm">{title}</p>
				<p className="max-w-xs text-muted-foreground text-sm">{description}</p>
				{actionLabel ? (
					<Button className="mt-2" size="sm" type="button" variant="outline">
						<Plus />
						{actionLabel}
					</Button>
				) : null}
			</CardContent>
		</Card>
	);
}

export function ProjectDetail({ project }: ProjectDetailProps) {
	const clientName =
		project.client?.name ?? project.client?.email ?? "Chưa gán khách hàng";
	const [editingDescription, setEditingDescription] = useState(false);
	const [editingNotes, setEditingNotes] = useState(false);

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
										{formatDate(project.startDate)} —{" "}
										{formatDate(project.endDate)}
									</span>
									<span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
										<CircleDollarSign className="size-3.5" />
										{formatCurrency(project.budget)}
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
									{project.client?.companyName ??
										project.client?.email ??
										"Chưa liên kết khách hàng"}
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
						<CardHeader className="flex-row items-center justify-between space-y-0">
							<div>
								<CardTitle className="text-base">Mô tả</CardTitle>
								<CardDescription>Giới thiệu về dự án này</CardDescription>
							</div>
							{!editingDescription ? (
								<Button
									aria-label="Chỉnh sửa mô tả"
									onClick={() => setEditingDescription(true)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									<Pencil />
								</Button>
							) : null}
						</CardHeader>
						<CardContent>
							{editingDescription ? (
								<DescriptionForm
									initialDescription={project.description}
									onDone={() => setEditingDescription(false)}
									projectId={project.id}
								/>
							) : (
								<p className="text-muted-foreground text-sm leading-relaxed">
									{project.description || "Chưa có mô tả cho dự án này."}
								</p>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex-row items-center justify-between space-y-0">
							<div>
								<CardTitle className="text-base">Ghi chú</CardTitle>
								<CardDescription>Ghi chú chi tiết về dự án</CardDescription>
							</div>
							{!editingNotes ? (
								<Button
									aria-label="Chỉnh sửa ghi chú"
									onClick={() => setEditingNotes(true)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									{project.notes ? <Pencil /> : <X />}
								</Button>
							) : null}
						</CardHeader>
						<CardContent>
							{editingNotes ? (
								<NotesForm
									initialNotes={project.notes}
									onDone={() => setEditingNotes(false)}
									projectId={project.id}
								/>
							) : (
								<NotesView notes={project.notes} />
							)}
						</CardContent>
					</Card>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
									<Timer className="size-3.5" />
									Thời hạn
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="font-semibold text-sm">
									{formatDeadline(project.endDate)}
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription className="flex items-center gap-1.5">
									<CircleDollarSign className="size-3.5" />
									Ngân sách
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="font-semibold text-sm">
									{formatCurrency(project.budget)}
								</p>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">Khách hàng</CardTitle>
							<CardDescription>Thông tin liên hệ</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<div className="flex items-center gap-3">
								<Avatar className="size-10">
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
							<div className="sm:ml-auto">
								{project.client?.companyName ? (
									<div className="flex items-center gap-2 text-muted-foreground text-sm">
										<Building2 className="size-4" />
										<span className="font-medium text-foreground">
											{project.client.companyName}
										</span>
									</div>
								) : (
									<span className="flex items-center gap-1.5 text-muted-foreground text-sm">
										<UserRound className="size-4" />
										Khách hàng cá nhân
									</span>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent className="mt-4" value="invoices">
					<EmptyState
						actionLabel="Thêm hóa đơn"
						description="Chưa có hóa đơn nào cho dự án này."
						icon={Receipt}
						title="Chưa có hóa đơn"
					/>
				</TabsContent>
				<TabsContent className="mt-4" value="payments">
					<EmptyState
						actionLabel="Ghi nhận thanh toán"
						description="Chưa có khoản thanh toán nào cho dự án này."
						icon={CreditCard}
						title="Chưa có thanh toán"
					/>
				</TabsContent>
				<TabsContent className="mt-4" value="modules">
					<EmptyState
						actionLabel="Thêm hạng mục"
						description="Chưa có hạng mục nào. Thêm hạng mục để chia nhỏ công việc dự án."
						icon={LayoutList}
						title="Chưa có hạng mục"
					/>
				</TabsContent>
				<TabsContent className="mt-4" value="tasks">
					<EmptyState
						description="Chưa có công việc nào cho dự án này."
						icon={ClipboardList}
						title="Chưa có công việc"
					/>
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
