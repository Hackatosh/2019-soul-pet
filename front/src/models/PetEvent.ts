import {User} from "./User";

export interface PetEvent {
	id: number;
	name: string;
	beginDate: Date;
	endDate: Date;
	userId?: number;
	user?: User;
	location?: string;
	description: string;
}
