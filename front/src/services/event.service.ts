import {PetEvent} from "../models";
import {httpClient} from "../helpers";

export class EventService {
    static async get(id: number): Promise<PetEvent> {
        return httpClient.get<PetEvent>(`/events/${id}`, true).catch(() => Promise.reject('Erreur lors de la récupération de l\'event'));
    }
}