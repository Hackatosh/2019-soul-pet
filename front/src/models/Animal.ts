import { PetEvent } from "./PetEvent";

export interface Animal {
	id: number;
	userId: number;
	specieId: number;
	birthdate: Date;
	name: string;
	events?: PetEvent[];
}
