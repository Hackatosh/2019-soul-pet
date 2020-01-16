export interface PetEvent {
	id: number;
	name: string;
	beginDate: Date;
	endDate: Date;
	userId?: number;
	location?: string;
	description: string;
}
