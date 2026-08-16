import { notFound, redirect } from "next/navigation";

import { ProjectDetail } from "@/components/projects/project-detail";
import { getSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export default async function ProjectViewPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const session = await getSession();
	if (!session?.user?.id) {
		redirect(`/sign-in?returnUrl=${encodeURIComponent(`/project/${slug}`)}`);
	}

	const project = await prisma.project.findFirst({
		include: {
			client: {
				select: {
					companyName: true,
					email: true,
					id: true,
					image: true,
					location: true,
					name: true,
					phone: true,
				},
			},
			comments: {
				include: {
					author: {
						select: { id: true, image: true, name: true },
					},
				},
				orderBy: { createdAt: "desc" },
			},
			payments: { orderBy: { date: "desc" } },
		},
		where: {
			OR: [{ clientId: session.user.id }, { userId: session.user.id }],
			slug,
		},
	});

	if (!project) {
		notFound();
	}

	return (
		<ProjectDetail
			isOwner={project.userId === session.user.id}
			project={project}
		/>
	);
}
