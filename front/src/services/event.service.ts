import {Animal, PetEvent} from "../models";
import {httpClient} from "../helpers";

export class EventService {

    private static revive(e: PetEvent): PetEvent {
        e.beginDate = new Date(e.beginDate);
        e.endDate = new Date(e.endDate);
        return e;
    }

    static async get(id: number): Promise<PetEvent> {
        return httpClient.get<PetEvent>(`/events/${id}`, true).then(this.revive).catch(() => Promise.reject('Erreur lors de la récupération de l\'event'));
    }
}