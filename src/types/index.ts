import type { Project, ProjectComment, User } from "@prisma/client";

export type ClientProps = Pick<
	User,
	| "id"
	| "name"
	| "email"
	| "image"
	| "phone"
	| "location"
	| "companyName"
	| "companyDescription"
	| "role"
	| "createdAt"
>;

export type ProjectProps = Pick<
	Project,
	| "id"
	| "name"
	| "slug"
	| "description"
	| "notes"
	| "thumbnail"
	| "bannerImage"
	| "startDate"
	| "endDate"
	| "budget"
	| "status"
	| "createdAt"
> & {
	client?: Pick<User, "id" | "name" | "email" | "image" | "companyName"> | null;
};

export type ProjectCommentProps = Pick<
	ProjectComment,
	"id" | "text" | "createdAt" | "projectId" | "authorId"
> & {
	author?: Pick<User, "id" | "name" | "image"> | null;
};

export type UserRole = "ADMIN" | "CLIENT" | "MEMBER";
export type ProjectStatus = "ONGOING" | "COMPLETED";
