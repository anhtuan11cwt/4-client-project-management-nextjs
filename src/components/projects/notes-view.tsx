"use client";

import { generateHTML } from "@tiptap/html";
import { type JSONContent, StarterKit, UpdatedImage } from "novel";
import { createElement, useMemo } from "react";

export function NotesView({ notes }: { notes: string | null }) {
	const html = useMemo(() => {
		if (!notes) return "";
		try {
			return generateHTML(JSON.parse(notes) as JSONContent, [
				StarterKit,
				UpdatedImage,
			]);
		} catch {
			return "";
		}
	}, [notes]);

	if (!html) {
		return <p className="text-muted-foreground text-sm">Chưa có ghi chú.</p>;
	}

	return createElement("div", {
		className: "prose prose-sm max-w-none",
		// biome-ignore lint/security/noDangerouslySetInnerHtml: HTML sinh từ JSON TipTap của chính chủ dự án.
		dangerouslySetInnerHTML: { __html: html },
	});
}
