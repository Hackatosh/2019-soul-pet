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
}
