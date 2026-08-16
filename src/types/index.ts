import type { Payment, Project, ProjectComment, User } from "@prisma/client";

export type ClientProps = Pick<
	User,
	| "id"
	| "name"
	| "email"
	| "image"
	| "userLogo"
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
	| "gradient"
	| "startDate"
	| "endDate"
	| "budget"
	| "status"
	| "createdAt"
> & {
	client?: Pick<User, "id" | "name" | "email" | "image" | "companyName"> | null;
};

export type PaymentProps = Pick<
	Payment,
	| "id"
	| "title"
	| "amount"
	| "tax"
	| "date"
	| "method"
	| "invoiceNumber"
	| "projectId"
	| "userId"
	| "clientId"
	| "createdAt"
>;

export type ProjectCommentProps = Pick<
	ProjectComment,
	"id" | "text" | "createdAt" | "projectId" | "authorId"
> & {
	author?: Pick<User, "id" | "name" | "image"> | null;
};

export type UserRole = "ADMIN" | "CLIENT" | "MEMBER";
export type ProjectStatus = "ONGOING" | "COMPLETED";
