import { httpClient } from "../helpers";
import { Picture, Directory } from "../models";

export class PictureService {
	/**
	 * Gets a picture given a filename.
	 * @param directory the repository where the picture should be (i.e. ‘animals’,
	 * ‘events’…)
	 * @param picture the picture whose content we want to load
	 * @returns The picture with its content loaded
	 */
	static async loadPictureContent(directory: Directory, picture: Picture): Promise<Picture> {
		return httpClient.get<Blob>(`/pictures/${directory}/?filename=${picture.filename}`, true).then(b => {
			picture.content = URL.createObjectURL(b);
			return picture;
		}, () => Promise.reject('Erreur lors de la récupération de l’image'));
	}

	/**
	 * Retrieves the pictures of an object.
	 * @param id the ID of the object
	 * @param directory the directory associated with the object
	 * @returns an array of Picture
	 */
	static async getPictures(id: number, directory: Directory): Promise<Picture[]> {
		return httpClient.get<Picture[]>(`/pictures/${directory}/${id}`, true).catch(() => Promise.reject('Erreur lors de la récupération des images'));
	}

	/**
	 * Posts a picture associated with an object.
	 * @param id the ID of the object
	 * @param directory the directory associated with the object
	 * @param picture the picture to post, as a blob
	 * @returns the Picture object
	 */
	static async postPicture(id: number, directory: Directory, picture: Blob): Promise<Picture> {
		const form = new FormData();
		form.append('picture', picture);
		return httpClient.post<Picture>(`/pictures/${directory}/${id}`, form, true).catch(() => Promise.reject('Erreur lors de l’envoi de l’image'));
	}

	/**
	 * Deletes a picture.
	 * @param picture the picture to delete
	 * @param directory the directory of the picture
	 */
	static async deletePicture(picture: Picture, directory: Directory) {
		return httpClient.delete(`/pictures/${directory}/?filename=${picture.filename}`, true).catch(() => Promise.reject('Erreur lors de la suppression de l’image'));
	}
}
