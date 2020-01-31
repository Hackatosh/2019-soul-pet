import { Animal, Specie, Picture } from "../models";
import { httpClient } from "../helpers";
import { EventService } from "./event.service";

export class AnimalService {
	private static species: Specie[] | undefined = undefined;
	
	/**
	 * Restores properties of an animal to **instances** rather than mere types.
	 * @param a the animal to ‘revive’
	 * @returns the ‘revived’ animal
	 */
	public static async revive(a: Animal): Promise<Animal> {
		a.birthdate = new Date(a.birthdate);
		if (a.events !== undefined)
			a.events = await Promise.all(a.events.map(EventService.revive));
		return a;
	}

	/**
	 * Retrieves the existing species.
	 * @returns an array of species
	 */
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
		return httpClient.get<Animal[]>(`/animals/?userId=${userId}`, true).then(animals => Promise.all(animals.map(async a => await this.revive(a)))).catch(() => Promise.reject('Erreur lors de la récupération des animaux'));
	}

	/**
	 * Retrieves an animal of the user.
	 * @param id the ID of the animal
	 * @returns the animal requested
	 */
	static async getSingle(id: number): Promise<Animal> {
		return httpClient.get<Animal>(`/animals/${id}`, true).then(AnimalService.revive).catch(() => Promise.reject('Erreur lors de la récupération de l’animal'));
	}
	
	/**
	 * Retrieves the pictures of an animal.
	 * @param id the ID of the animal
	 * @returns an array of Picture
	 */
	static async getPictures(id: number): Promise<Picture[]> {
		return httpClient.get<Picture[]>(`/pictures/animals/${id}`, true).catch(() => Promise.reject('Erreur lors de la récupération des images'));
	}

	/**
	 * Posts a picture associated with an animal.
	 * @param id the ID of the animal
	 * @param picture the picture to post, as a blob
	 * @returns the Picture object
	 */
	static async postPicture(id: number, picture: Blob): Promise<Picture> {
		const form = new FormData();
		form.append('picture', picture);
		return httpClient.post<Picture>(`/pictures/animals/${id}`, form, true).catch(() => Promise.reject('Erreur lors de l’envoi de l’image'));
	}

	/**
	 * Deletes a picture.
	 * @param picture the picture to delete
	 */
	static async deletePicture(picture: Picture) {
		return httpClient.delete(`/pictures/animals/?filename=${picture.filename}`, true).catch(() => Promise.reject('Erreur lors de la suppression de l’image'));
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
