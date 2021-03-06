import {PetEvent} from "../models";
import {httpClient} from "../helpers";
import { AnimalService } from "./animal.service";

export class EventService {
	/**
	 * Restores properties of an event to **instances** rather than mere types.
	 * @param e the event to ‘revive’
	 * @returns the ‘revived’ event
	 */
    public static async revive(e: PetEvent): Promise<PetEvent> {
        e.beginDate = new Date(e.beginDate);
		e.endDate = new Date(e.endDate);
		e.eventComments = e.eventComments === undefined ? undefined : e.eventComments.map(e => {
			e.createdAt = new Date(e.createdAt);
			return e;
		});
		if (e.authorizedSpecies !== undefined && e.specieIds === undefined)
			e.specieIds = e.authorizedSpecies.map(s => s.id);
		if (e.authorizedSpecies === undefined && e.specieIds !== undefined)
			e.authorizedSpecies = (await AnimalService.getSpecies()).filter(s => e.specieIds?.includes(s.id));
		if (e.attendees !== undefined)
			e.attendees = await Promise.all(e.attendees.map(AnimalService.revive));
        return e;
    }

    /**
     * Retrieves all the events.
     * @returns an array containing the events
     */
    static async getAll(): Promise<PetEvent[]> {
        return this.search();
    }

    /**
     * Retrieves an event.
     * @param id the ID of the event
     * @returns the event requested
     */
    static async get(id: number): Promise<PetEvent> {
        return httpClient.get<PetEvent>(`/events/${id}`, true).then(EventService.revive).catch(() => Promise.reject('Erreur lors de la récupération de l\'évènement'));
    }

    /**
     * Adds an event.
     * @param event the event to add
     * @returns the event saved into the database
     */
    static async add(event:PetEvent): Promise<PetEvent> {
        return httpClient.post<PetEvent>('/events/', event, true).then(EventService.revive).catch(() => Promise.reject(`Erreur lors de la création de l'évènement : ${event.name}`));
    }

    /**
     * Updates an existing event.
     * @param event the new event with updated values
     * @returns the event saved into the database
     */
    static async update(event:PetEvent): Promise<PetEvent> {
		event.authorizedSpecies = undefined;
        return httpClient.put<PetEvent>(`/events/${event.id}`, event, true).then(EventService.revive).catch(() => Promise.reject(`Erreur lors de la mise à jour de l'évènement d'identifiant ${event.id}`));
    }

    /**
     * Deletes an event from the database.
     * @param id the ID of the event to delete
     * @returns null
     */
    static async delete(id: number): Promise<null> {
        return httpClient.delete(`/events/${id}`, true).then(() => null).catch(() => Promise.reject(`Erreur lors de la suppression de l'évènement d'identifiant ${id}`));
	}
	
	/**
	 * Adds an animal as an attendee to an event.
	 * @param eventId the ID of the event
	 * @param animalId the ID of the animal
	 * @returns null
	 */
	static async addAnimal(eventId: number, animalId: number): Promise<null> {
		return httpClient.post<{animalId: number}>(`/events/${eventId}/animals`, { animalId: animalId }, true).then(() => null).catch(() => Promise.reject('Erreur lors de l’inscription de l’animal'));
	}

	/**
	 * Removes an animal from an event.
	 * @param eventId the ID of the event
	 * @param animalId the ID of the animal
	 * @returns null
	 */
	static async removeAnimal(eventId: number, animalId: number): Promise<null> {
		return httpClient.delete(`/events/${eventId}/animals/${animalId}`, true).catch(() => Promise.reject('Erreur lors de la désinscription de l’animal'));
    }
    
    /**
     * Performs an event search.
     * @param keywords a string of keywords to find in the title or the description
     * @param beginDate the date after which the event can begin
     * @param endDate the date before which the event should end
     * @returns a list of events
     */
    static async search(keywords?: string, beginDate?: Date, endDate?: Date): Promise<PetEvent[]> {
        let query = keywords === undefined && beginDate === undefined && endDate === undefined ? '' : '?';
        if (keywords !== undefined)
            query += `&keywords=${keywords}`;
        if (beginDate !== undefined)
            query += `&beginDate=${beginDate.toISOString()}`;
        if (endDate !== undefined)
            query += `&endDate=${endDate.toISOString()}`;
        return httpClient.get<PetEvent[]>(`/events/search${query}`, true).then(events => Promise.all(events.map(async e => await this.revive(e)))).catch(() => Promise.reject('Erreur lors de la recherche d’événements'));
    }
}
