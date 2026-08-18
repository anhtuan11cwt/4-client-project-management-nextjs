"use client";

import {
	ArrowLeft,
	Building2,
	CalendarDays,
	CircleDollarSign,
	CreditCard,
	FileText,
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
import { useEffect, useState } from "react";
import { BannerEditor } from "@/components/projects/banner-editor";
import { BudgetProgressBar } from "@/components/projects/budget-progress-bar";
import { CommentForm } from "@/components/projects/comment-form";
import { DescriptionForm } from "@/components/projects/description-form";
import { ModuleForm } from "@/components/projects/module-form";
import { NotesView } from "@/components/projects/notes-view";
import { PaymentForm } from "@/components/projects/payment-form";
import { ProjectBanner } from "@/components/projects/project-banner";
import { TitleForm } from "@/components/projects/title-form";
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
	calculateDifferenceDays,
	formatCurrency,
	formatDate,
	formatTimeDifference,
	getProjectStatusLabel,
} from "@/lib/format";
import type {
	ModuleProps,
	PaymentProps,
	ProjectCommentProps,
	ProjectProps,
} from "@/types";

const NotesForm = dynamic(
	() => import("@/components/projects/notes-form").then((m) => m.NotesForm),
	{ ssr: false },
);

const DAY_MS = 86_400_000;

const ROLE_LABELS: Record<string, string> = {
	ADMIN: "Quản trị viên",
	CLIENT: "Khách hàng",
	MEMBER: "Thành viên",
};

interface CurrentUser {
	id: string;
	name: string;
	role?: "ADMIN" | "CLIENT" | "MEMBER";
}

interface ProjectDetailProps {
	currentUser?: CurrentUser;
	isOwner: boolean;
	project: ProjectProps & {
		client?: {
			id: string;
			name: string | null;
			email: string;
			image: string | null;
			companyName: string | null;
		} | null;
		comments: ProjectCommentProps[];
		payments: PaymentProps[];
		modules: ModuleProps[];
	};
}

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
	return `${first}${last}`.toUpperCase();
}

function CommentBody({ text }: { text: string }) {
	const isHtml = text.trim().startsWith("<");
	if (!isHtml) {
		return (
			<p className="mt-1 text-muted-foreground text-sm leading-relaxed">
				{text}
			</p>
		);
	}
	return (
		<div
			className="prose prose-sm mt-1 max-w-none text-foreground"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Nội dung HTML từ trình soạn thảo Quill của người dùng đã xác thực.
			dangerouslySetInnerHTML={{ __html: text }}
		/>
	);
}

export function ProjectDetail({
	isOwner,
	currentUser,
	project,
}: ProjectDetailProps) {
	const clientName =
		project.client?.name ?? project.client?.email ?? "Chưa gán khách hàng";
	const [editingDescription, setEditingDescription] = useState(false);
	const [editingNotes, setEditingNotes] = useState(false);
	const [editingTitle, setEditingTitle] = useState(false);
	const [showCommentForm, setShowCommentForm] = useState(false);
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
	const [showModuleForm, setShowModuleForm] = useState(false);
	const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

	const [now, setNow] = useState<number>(() => Date.now());
	useEffect(() => {
		const interval = setInterval(() => setNow(Date.now()), DAY_MS);
		return () => clearInterval(interval);
	}, []);
	const daysDifference = calculateDifferenceDays(project.endDate, now);

	const isOverdue = daysDifference !== null && daysDifference < 0;
	const deadlineColor = isOverdue
		? "text-red-600 dark:text-red-400"
		: "text-green-600 dark:text-green-400";

	const paidAmount = project.payments.reduce(
		(sum, payment) => sum + payment.amount + payment.tax,
		0,
	);
	const remainingAmount = Math.max(project.budget - paidAmount, 0);

	const editingComment = project.comments.find(
		(comment) => comment.id === editingCommentId,
	);
	const editingModule = project.modules.find(
		(module) => module.id === editingModuleId,
	);

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
				<div className="relative">
					<ProjectBanner
						bannerImage={project.bannerImage}
						gradient={project.gradient}
						name={project.name}
					/>
					{isOwner ? (
						<div className="absolute top-3 right-3">
							<BannerEditor
								currentBanner={project.bannerImage}
								currentGradient={project.gradient}
								projectId={project.id}
							/>
						</div>
					) : null}
				</div>
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
							<div className="min-w-0">
								{editingTitle && isOwner ? (
									<TitleForm
										initialTitle={project.name}
										onDone={() => setEditingTitle(false)}
										projectId={project.id}
									/>
								) : (
									<div className="group flex items-center gap-1.5">
										<h1 className="font-bold text-2xl tracking-tight">
											{project.name}
										</h1>
										{isOwner ? (
											<Button
												aria-label="Đổi tên dự án"
												className="opacity-0 transition-opacity group-hover:opacity-100"
												onClick={() => setEditingTitle(true)}
												size="icon-sm"
												type="button"
												variant="ghost"
											>
												<Pencil />
											</Button>
										) : null}
									</div>
								)}
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
					<TabsTrigger value="notes">
						<FileText />
						Ghi chú
					</TabsTrigger>
					<TabsTrigger value="comments">
						<MessagesSquare />
						Bình luận
					</TabsTrigger>
					<TabsTrigger value="modules">
						<LayoutList />
						Hạng mục
					</TabsTrigger>
					<TabsTrigger value="payments">
						<CreditCard />
						Thanh toán & Hóa đơn
					</TabsTrigger>
				</TabsList>

				<TabsContent className="mt-4 space-y-4" value="overview">
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Ngân sách tổng</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="font-bold text-xl">
									{formatCurrency(project.budget)}
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Đã thanh toán</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="font-bold text-xl">
									{formatCurrency(paidAmount)}
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Còn lại</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="font-bold text-xl">
									{formatCurrency(remainingAmount)}
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Tiến độ</CardDescription>
							</CardHeader>
							<CardContent>
								<BudgetProgressBar
									budget={project.budget}
									paidAmount={paidAmount}
								/>
							</CardContent>
						</Card>
					</div>

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

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
								<p
									className={`font-semibold text-sm ${daysDifference === null ? "" : deadlineColor}`}
								>
									{formatTimeDifference(daysDifference)}
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

				<TabsContent className="mt-4 space-y-4" value="notes">
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
				</TabsContent>

				<TabsContent className="mt-4 space-y-4" value="comments">
					<Card>
						<CardHeader className="flex-row items-center justify-between space-y-0">
							<div>
								<CardTitle className="text-base">Bình luận</CardTitle>
								<CardDescription>Thảo luận về dự án này</CardDescription>
							</div>
							{!showCommentForm && !editingCommentId ? (
								<Button
									onClick={() => setShowCommentForm(true)}
									size="sm"
									type="button"
								>
									<Plus />
									Thêm bình luận
								</Button>
							) : null}
						</CardHeader>
						<CardContent>
							{showCommentForm || editingCommentId ? (
								<div className="mb-6">
									<CommentForm
										editingId={editingCommentId ?? undefined}
										initialContent={editingComment?.text}
										onDone={() => {
											setShowCommentForm(false);
											setEditingCommentId(null);
										}}
										projectId={project.id}
									/>
								</div>
							) : null}
							{project.comments.length === 0 ? (
								<p className="text-muted-foreground text-sm">
									Chưa có bình luận nào.
								</p>
							) : (
								<ul className="space-y-5">
									{project.comments.map((comment) => {
										const canEdit =
											currentUser?.id === comment.userId ||
											currentUser?.id === comment.authorId;
										const isEditingThis = editingCommentId === comment.id;
										return (
											<li
												className="group flex items-start gap-3"
												key={comment.id}
											>
												<Avatar className="size-8 shrink-0">
													{comment.author?.image ? (
														<AvatarImage
															alt={comment.username}
															src={comment.author.image}
														/>
													) : null}
													<AvatarFallback>
														{getInitials(comment.username || "U")}
													</AvatarFallback>
												</Avatar>
												<div className="min-w-0 flex-1">
													<p className="flex flex-wrap items-center gap-2 font-semibold text-sm">
														{comment.username}
														<span className="rounded-full bg-muted px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
															{ROLE_LABELS[comment.userRole] ??
																comment.userRole}
														</span>
														<span className="font-normal text-muted-foreground text-xs">
															{formatDate(comment.createdAt)}
														</span>
														{canEdit ? (
															<Button
																aria-label="Chỉnh sửa bình luận"
																className="opacity-0 transition-opacity group-hover:opacity-100"
																onClick={() => setEditingCommentId(comment.id)}
																size="icon-sm"
																type="button"
																variant="ghost"
															>
																<Pencil />
															</Button>
														) : null}
													</p>
													{isEditingThis ? (
														<CommentForm
															editingId={comment.id}
															initialContent={comment.text}
															onDone={() => setEditingCommentId(null)}
															projectId={project.id}
														/>
													) : (
														<CommentBody text={comment.text} />
													)}
												</div>
											</li>
										);
									})}
								</ul>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent className="mt-4 space-y-4" value="modules">
					<Card>
						<CardHeader className="flex-row items-center justify-between space-y-0">
							<div>
								<CardTitle className="text-base">Hạng mục</CardTitle>
								<CardDescription>Chia nhỏ công việc của dự án</CardDescription>
							</div>
							{!showModuleForm && !editingModuleId ? (
								<Button
									onClick={() => setShowModuleForm(true)}
									size="sm"
									type="button"
								>
									<Plus />
									Thêm hạng mục
								</Button>
							) : null}
						</CardHeader>
						<CardContent>
							{showModuleForm || editingModuleId ? (
								<div className="mb-6">
									<ModuleForm
										editingId={editingModuleId ?? undefined}
										initialName={editingModule?.name ?? ""}
										onDone={() => {
											setShowModuleForm(false);
											setEditingModuleId(null);
										}}
										projectId={project.id}
									/>
								</div>
							) : null}
							{project.modules.length === 0 ? (
								<p className="text-muted-foreground text-sm">
									Chưa có hạng mục nào cho dự án này.
								</p>
							) : (
								<ul className="divide-y">
									{project.modules.map((module) => {
										const canEdit = currentUser?.id === module.userId;
										return (
											<li
												className="group flex items-center gap-3 py-3"
												key={module.id}
											>
												<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
													<LayoutList className="size-4" />
												</span>
												<div className="min-w-0 flex-1">
													<p className="truncate font-medium text-sm">
														{module.name}
													</p>
													<p className="truncate text-muted-foreground text-xs">
														{module.username} · {formatDate(module.createdAt)}
													</p>
												</div>
												{canEdit ? (
													<Button
														aria-label="Chỉnh sửa hạng mục"
														className="opacity-0 transition-opacity group-hover:opacity-100"
														onClick={() => setEditingModuleId(module.id)}
														size="icon-sm"
														type="button"
														variant="ghost"
													>
														<Pencil />
													</Button>
												) : null}
											</li>
										);
									})}
								</ul>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent className="mt-4 space-y-4" value="payments">
					<Card>
						<CardHeader className="flex-row items-center justify-between space-y-0">
							<div>
								<CardTitle className="text-base">Thanh toán</CardTitle>
								<CardDescription>
									Các khoản thanh toán từ khách hàng
								</CardDescription>
							</div>
							{isOwner ? <PaymentForm projectId={project.id} /> : null}
						</CardHeader>
						<CardContent className="space-y-4">
							{project.payments.length > 0 ? (
								<BudgetProgressBar
									budget={project.budget}
									paidAmount={paidAmount}
								/>
							) : null}
							{project.payments.length === 0 ? (
								<p className="text-muted-foreground text-sm">
									Chưa có khoản thanh toán nào cho dự án này.
								</p>
							) : (
								<ul className="divide-y">
									{project.payments.map((payment) => (
										<li
											className="flex items-center gap-4 py-3"
											key={payment.id}
										>
											<div className="min-w-0 flex-1">
												<p className="font-medium text-sm">{payment.title}</p>
												<p className="text-muted-foreground text-xs">
													{formatDate(payment.date)} · {payment.method} ·{" "}
													{payment.invoiceNumber}
												</p>
											</div>
											<p className="font-semibold text-sm">
												{formatCurrency(payment.amount + payment.tax)}
											</p>
											<Button
												render={
													<Link
														href={`/project/${project.slug}/invoice/${payment.id}`}
													/>
												}
												size="sm"
												variant="outline"
											>
												Xem hóa đơn
											</Button>
										</li>
									))}
								</ul>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">Hóa đơn</CardTitle>
							<CardDescription>
								Các hóa đơn phát sinh từ khoản thanh toán
							</CardDescription>
						</CardHeader>
						<CardContent>
							{project.payments.length === 0 ? (
								<p className="text-muted-foreground text-sm">
									Chưa có hóa đơn nào cho dự án này.
								</p>
							) : (
								<ul className="divide-y">
									{project.payments.map((payment) => (
										<li
											className="flex items-center gap-4 py-3"
											key={payment.id}
										>
											<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
												<Receipt className="size-4" />
											</span>
											<div className="min-w-0 flex-1">
												<p className="font-medium text-sm">{payment.title}</p>
												<p className="text-muted-foreground text-xs">
													{payment.invoiceNumber} · {formatDate(payment.date)}
												</p>
											</div>
											<p className="font-semibold text-sm">
												{formatCurrency(payment.amount + payment.tax)}
											</p>
											<Button
												render={
													<Link
														href={`/project/${project.slug}/invoice/${payment.id}`}
													/>
												}
												size="sm"
												variant="outline"
											>
												Xem hóa đơn
											</Button>
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
