import { httpClient } from "../helpers";
import { Picture } from "../models";

export class PictureService {
	/**
	 * Gets a picture given a filename.
	 * @param repository the repository where the picture should be (i.e. ‘animals’,
	 * ‘events’…)
	 * @param filename the name of the picture to retrieve
	 * @returns The image as a string
	 */
	static async loadPictureContent(repository: string, picture: Picture): Promise<Picture> {
		return httpClient.get<Blob>(`/pictures/${repository}/?filename=${picture.filename}`, true).then(b => {
			picture.content = URL.createObjectURL(b);
			return picture;
		}, () => Promise.reject('Erreur lors de la récupération de l’image'));
	}
}
