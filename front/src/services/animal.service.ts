import { Animal } from "../models";
import { httpClient } from "../helpers";

export class AnimalService {
	/**
	 * Retrieves all the animals of the user.
	 * In case of an error, returns an empty array.
	 * @returns an array containing the animals of the user
	 */
	static async getAll(userId: number): Promise<Animal[]> {
		return httpClient.get<Animal[]>(`/animals/?userId=${userId}`, true).catch(() => []);
	}

	/**
	 * Retrieves an animal of the user.
	 * @param id the ID of the animal
	 * @returns the animal requested
	 */
	static async get(id: number): Promise<Animal> {
		return httpClient.get<Animal>(`/animals/${id}`, true).catch(() => Promise.reject('Erreur lors de la récupération de l’animal'));
	}

	/**
	 * Adds an animal to the user account.
	 * @param animal the animal to add
	 * @returns the animal saved into the database
	 */
	static async add(animal: Animal): Promise<Animal> {
		return httpClient.post<Animal>('/animals/', true, JSON.stringify(animal)).catch(() => Promise.reject(`Erreur lors de l’enregistrement de ${animal.name}`));
	}

	/**
	 * Updates an existing animal.
	 * @param animal the new animal with updated values
	 * @returns the animal saved into the database
	 */
	static async update(animal: Animal): Promise<Animal> {
		return httpClient.put<Animal>('/animals/', true, JSON.stringify(animal)).catch(() => Promise.reject(`Erreur lors de la mise à jour de ${animal.name}`));
	}

	/**
	 * Deletes an animal from the database.
	 * @param id the id of the animal to delete
	 * @returns null
	 */
	static async delete(id: number): Promise<null> {
		const a = await this.get(id).catch(() => Promise.reject('Animal introuvable'));
		return httpClient.delete(`/animals/${id}`, true).then(() => null).catch(() => Promise.reject(`Erreur lors de la suppression de ${a.name}`));
	}
}
