import Image from "next/image";

export function ProjectBanner({
	name,
	bannerImage,
	gradient,
}: {
	name: string;
	bannerImage: string | null;
	gradient: string | null;
}) {
	if (bannerImage) {
		return (
			<Image
				alt={name}
				className="h-40 w-full object-cover sm:h-52"
				height={240}
				src={bannerImage}
				width={1200}
			/>
		);
	}

	return (
		<div
			className={`h-40 w-full sm:h-52 ${
				gradient ??
				"bg-gradient-to-r from-primary/20 via-chart-4/20 to-primary/10"
			}`}
		/>
	);
}
