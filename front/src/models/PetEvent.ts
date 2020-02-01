import {User} from "./User";
import {Specie} from "./Specie";
import { Animal } from "./Animal";
import { EventComment } from "./EventComment";
import { Picture } from "./Picture";

export interface PetEvent {
	id: number;
	name: string;
	beginDate: Date;
	endDate: Date;
	description: string;
	userId?: number;
	user?: User;
	location?: string;
	authorizedSpecies?: Array<Specie>;
	specieIds?: Array<number>;
	attendees?: Animal[];
	eventComments?: EventComment[];
	eventPictures?: Picture[];
}
