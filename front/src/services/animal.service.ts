import { Animal, Specie } from "../models";
import { httpClient } from "../helpers";

export class AnimalService {
    private static species: Specie[] | undefined = undefined;
    
    private static revive(a: Animal): Animal {
		a.birthdate = new Date(a.birthdate);
		return a;
    }

    static async getSpecies(): Promise<Specie[]> {
        if (this.species === undefined)
            this.species = await httpClient.get<Specie[]>('/animals/species/', true).catch(() => Promise.reject('Erreur lors de la récupération des espèces'));
        if (this.species === undefined || this.species.length === 0)
            return Promise.reject('Erreur lors de la récupération des espèces');
        else
            return Promise.resolve(this.species);
    }

	/**
	 * Retrieves all the animals of the user.
	 * @returns an array containing the animals of the user
	 */
	static async getAll(userId: number): Promise<Animal[]> {
		return httpClient.get<Animal[]>(`/animals/?userId=${userId}`, true).then(animals => animals.map(AnimalService.revive)).catch(() => Promise.reject('Erreur lors de la récupération des animaux'));
	}

	/**
	 * Retrieves an animal of the user.
	 * @param id the ID of the animal
	 * @returns the animal requested
	 */
	static async get(id: number): Promise<Animal> {
		return httpClient.get<Animal>(`/animals/${id}`, true).then(AnimalService.revive).catch(() => Promise.reject('Erreur lors de la récupération de l’animal'));
	}

	/**
	 * Adds an animal to the user account.
	 * @param animal the animal to add
	 * @returns the animal saved into the database
	 */
	static async add(animal: Animal): Promise<Animal> {
		return httpClient.post<Animal>('/animals/', animal, true).then(AnimalService.revive).catch(() => Promise.reject(`Erreur lors de l’enregistrement de ${animal.name}`));
	}

	/**
	 * Updates an existing animal.
	 * @param animal the new animal with updated values
	 * @returns the animal saved into the database
	 */
	static async update(animal: Animal): Promise<Animal> {
		return httpClient.put<Animal>(`/animals/${animal.id}`, animal, true).then(AnimalService.revive).catch(() => Promise.reject(`Erreur lors de la mise à jour de ${animal.name}`));
	}

	/**
	 * Deletes an animal from the database.
	 * @param id the id of the animal to delete
	 * @returns null
	 */
	static async delete(id: number): Promise<null> {
		return httpClient.delete(`/animals/${id}`, true).then(() => null).catch(() => Promise.reject(`Erreur lors de la suppression de l’animal d’identifiant ${id}`));
	}
}
