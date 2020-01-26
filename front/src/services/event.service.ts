import {PetEvent} from "../models";
import {httpClient} from "../helpers";

export class EventService {
    private static revive(e: PetEvent): PetEvent {
        e.beginDate = new Date(e.beginDate);
        e.endDate = new Date(e.endDate);
        return e;
    }

    /**
     * Retrieves all the events.
     * @returns an array containing the events
     */
    static async getAll(): Promise<PetEvent[]> {
        return httpClient.get<PetEvent[]>(`/events/search`, true).then(events => events.map(EventService.revive)).catch(() => Promise.reject('Erreur lors de la récupération des évènements'));
    }

    /**
     * Retrieves an event.
     * @param id the ID of the event
     * @returns the event requested
     */
    static async get(id: number): Promise<PetEvent> {
        return httpClient.get<PetEvent>(`/events/${id}`, true).then(this.revive).catch(() => Promise.reject('Erreur lors de la récupération de l\'évènement'));
    }

    /**
     * Adds an event.
     * @param event the event to add
     * @returns the event saved into the database
     */
    static async add(event:PetEvent): Promise<PetEvent> {
        event.specieIds = event.authorizedSpecies !== undefined ? event.authorizedSpecies.map(specie => specie.id) : [];
        return httpClient.post<PetEvent>('/events/', event, true).then(EventService.revive).catch(() => Promise.reject(`Erreur lors de la création de l'évènement : ${event.name}`));
    }

    /**
     * Updates an existing event.
     * @param event the new event with updated values
     * @returns the event saved into the database
     */
    static async update(event:PetEvent): Promise<PetEvent> {
        event.specieIds = event.authorizedSpecies !== undefined ? event.authorizedSpecies.map(specie => specie.id) : [];
        return httpClient.put<PetEvent>(`/events/${event.id}`, event, true).then(EventService.revive).catch(() => Promise.reject(`Erreur lors de la mise à jour de l'évènement d'identifiant ${event.id}`));
    }

    /**
     * Deletes an event from the database.
     * @param id the id of the event to delete
     * @returns null
     */
    static async delete(id: number): Promise<null> {
        return httpClient.delete(`/events/${id}`, true).then(() => null).catch(() => Promise.reject(`Erreur lors de la suppression de l'évènement d'identifiant ${id}`));
    }
}
