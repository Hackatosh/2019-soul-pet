import { PetEvent } from "./PetEvent";

export interface Animal {
	id: number;
	userId: number;
	specieId: number;
	birthDate: Date;
	name: string;
	events?: PetEvent[];
}
