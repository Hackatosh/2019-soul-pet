import { PetEvent } from "./PetEvent";
import { Specie } from "./Specie";
import { Picture } from "./Picture";

export interface Animal {
	id?: number;
	userId: number;
    specieId: number;
    specie?: Specie;
	birthdate: Date;
	name: string;
    events?: PetEvent[];
    animalPictures?: Picture[];
}
