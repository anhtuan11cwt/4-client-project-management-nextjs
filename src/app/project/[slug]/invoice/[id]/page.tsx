import { ArrowLeft, Building2, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getInvoiceById } from "@/actions/payments";
import {
	DownloadPdfButton,
	PrintButton,
} from "@/components/projects/print-button";
import { buttonVariants } from "@/components/ui/button";
import { getSession } from "@/lib/dal";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function InvoicePage({
	params,
}: {
	params: Promise<{ id: string; slug: string }>;
}) {
	const { id, slug } = await params;

	const session = await getSession();
	if (!session?.user?.id) {
		redirect(
			`/sign-in?returnUrl=${encodeURIComponent(`/project/${slug}/invoice/${id}`)}`,
		);
	}

	const data = await getInvoiceById(id);
	if (!data) notFound();

	const { owner, client, project, ...invoice } = data;
	const total = invoice.amount + invoice.tax;
	const mailto = client?.email
		? `mailto:${client.email}?subject=${encodeURIComponent(
				`Hóa đơn ${invoice.invoiceNumber}`,
			)}&body=${encodeURIComponent(
				`Xin chào,\n\nHóa đơn ${invoice.invoiceNumber} cho "${invoice.title}" với số tiền ${formatCurrency(
					total,
				)}.\n\nTrân trọng,`,
			)}`
		: undefined;

	return (
		<div className="mx-auto max-w-3xl space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
				<Link
					className="inline-flex items-center gap-1 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
					href={`/project/${slug}`}
				>
					<ArrowLeft className="size-3.5" />
					Quay lại dự án
				</Link>
				<div className="flex items-center gap-2">
					<PrintButton />
					<DownloadPdfButton />
					{mailto ? (
						<a className={buttonVariants({ variant: "outline" })} href={mailto}>
							<Send />
							Gửi cho khách hàng
						</a>
					) : null}
				</div>
			</div>

			<div className="rounded-2xl border bg-card p-6 sm:p-10">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
					<div>
						{owner.userLogo ? (
							<Image
								alt="Logo"
								className="mb-3 size-14 rounded-lg object-cover"
								height={56}
								src={owner.userLogo}
								width={56}
							/>
						) : (
							<span className="mb-3 flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<Building2 className="size-6" />
							</span>
						)}
						<p className="font-bold text-xl">HÓA ĐƠN</p>
						<p className="text-muted-foreground text-sm">
							Mã: {invoice.invoiceNumber} · {formatDate(invoice.date)}
						</p>
					</div>
					<div className="text-sm">
						<p className="font-semibold">Thanh toán từ</p>
						<p>{owner.name}</p>
						{owner.companyName ? <p>{owner.companyName}</p> : null}
						<p className="text-muted-foreground">{owner.email}</p>
						{owner.phone ? (
							<p className="text-muted-foreground">{owner.phone}</p>
						) : null}
						{owner.location ? (
							<p className="text-muted-foreground">{owner.location}</p>
						) : null}
					</div>
				</div>

				<div className="mt-8 rounded-lg bg-muted/40 p-4">
					<p className="font-semibold text-sm">Gửi đến</p>
					<p>{client?.name ?? "—"}</p>
					{client?.companyName ? <p>{client.companyName}</p> : null}
					<p className="text-muted-foreground">{client?.email ?? "—"}</p>
					{client?.phone ? (
						<p className="text-muted-foreground">{client.phone}</p>
					) : null}
					{client?.location ? (
						<p className="text-muted-foreground">{client.location}</p>
					) : null}
				</div>

				<div className="mt-8 space-y-3">
					<div className="flex items-center justify-between rounded-lg border p-4">
						<div>
							<p className="font-medium text-sm">{invoice.title}</p>
							<p className="text-muted-foreground text-xs">
								Dự án: {project.name} · {formatDate(invoice.date)} ·{" "}
								{invoice.method}
							</p>
						</div>
						<p className="font-semibold text-sm">
							{formatCurrency(invoice.amount)}
						</p>
					</div>
					<div className="flex items-center justify-between text-sm">
						<p className="text-muted-foreground">Tạm tính (Subtotal)</p>
						<p>{formatCurrency(invoice.amount)}</p>
					</div>
					<div className="flex items-center justify-between text-sm">
						<p className="text-muted-foreground">Thuế</p>
						<p>{formatCurrency(invoice.tax)}</p>
					</div>
					<div className="flex items-center justify-between border-t pt-3">
						<p className="font-semibold">Tổng cộng (Total)</p>
						<p className="font-bold text-lg">{formatCurrency(total)}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
