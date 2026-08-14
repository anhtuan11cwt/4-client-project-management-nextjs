import { ComingSoon } from "@/components/coming-soon";

export default function AccountSettingsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Cài đặt tài khoản</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Quản lý thông tin cá nhân và bảo mật tài khoản.
				</p>
			</div>
			<ComingSoon title="Cài đặt tài khoản" />
		</div>
	);
}
