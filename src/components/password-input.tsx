"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = React.ComponentProps<typeof Input>;

export function PasswordInput({
	className,
	disabled,
	...props
}: PasswordInputProps) {
	const [visible, setVisible] = useState(false);

	return (
		<div className="relative">
			<Input
				className={cn("pr-10", className)}
				disabled={disabled}
				type={visible ? "text" : "password"}
				{...props}
			/>
			<Button
				aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
				className={cn(
					"absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground",
					disabled && "pointer-events-none opacity-50 hover:bg-transparent",
				)}
				disabled={disabled}
				onClick={() => setVisible((value) => !value)}
				size="icon-sm"
				tabIndex={-1}
				type="button"
				variant="ghost"
			>
				{visible ? <Eye /> : <EyeOff />}
			</Button>
		</div>
	);
}
