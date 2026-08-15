import { notFound } from "next/navigation";

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
		notFound();
	}

	const project = await prisma.project.findFirst({
		include: {
			client: {
				select: {
					companyName: true,
					email: true,
					id: true,
					image: true,
					name: true,
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
		},
		where: { slug, userId: session.user.id },
	});

	if (!project) {
		notFound();
	}

	return <ProjectDetail project={project} />;
}
