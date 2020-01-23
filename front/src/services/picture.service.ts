import { httpClient } from "../helpers";

export class PictureService {
    /**
     * Gets a picture given a filename.
     * @param repository the repository where the picture should be (i.e. ‘animals’,
     * ‘events’…)
     * @param filename the name of the picture to retrieve
     * @returns The image as a string
     */
    static async get(repository: string, filename: string): Promise<string> {
        return httpClient.get<Blob>(`/pictures/${repository}/?filename=${filename}`, true).then(b => URL.createObjectURL(b), () => Promise.reject('Erreur lors de la récupération de l’image'));
    }
}
