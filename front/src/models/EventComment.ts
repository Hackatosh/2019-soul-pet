import { User } from "./User";

export interface EventComment {
	id: number;
	userId: number;
	eventId: number;
	text: string;
	createdAt: Date;
	user?: User;
}
