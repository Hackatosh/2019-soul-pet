/**
 * This is used to retrieve the position of the user.
 */
export class GeolocationService {
    private static coordinates: Coordinates | undefined = undefined;
    private static watchId: number = 0;

    private static async getCurrentPositionWrapper(): Promise<Coordinates> {
        return new Promise((resolve: any, reject: any) => {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        resolve(position.coords);
                    },
                    () => reject("Erreur lors de la géolocalisation")
                );
            }
        )
    }

	/**
	 * Retrieves the coordinates of the user.
	 * @param startWatching whether to start watching the user as well
	 * @see GeolocationService.startWatchingGeoloc about use of the ‘watch mode’
	 */
    public static async getCoordinates(startWatching: boolean = false): Promise<Coordinates> {
		// If we do not want to start watching, or are already watching, and we already
		// have the coordinates, we send them as-is.
        if (this.coordinates !== undefined && (!startWatching || this.watchId !== 0)) {
            return this.coordinates;
        } else {
            if ("geolocation" in navigator) {
                try {
					this.coordinates = await this.getCurrentPositionWrapper();
                    if (startWatching) {
                        this.startWatchingGeoloc();
                    }
                    return this.coordinates;
                } catch (e) {
                    return await Promise.reject(e);
                }
            } else {
                return Promise.reject('La géolocalisation n\'est pas disponible sur ce navigateur');
            }
        }
    }

	/**
	 * Begins watching the position of the user, regularly updating the coordinates,
	 * which can then be retrieved with getCoordinates.
	 * Do not forget to call stopWatchinGeoloc when you dismount your component.
	 * @see GeolocationService.stopWatchinGeoloc
	 */
    public static startWatchingGeoloc(): void {
        if (this.watchId === 0) {
            const cb_success = (position: Position) => {
                this.coordinates = position.coords;
            };
            const cb_error = () => {
                this.stopWatchingGeoloc();
            };
            const geo_options: PositionOptions = {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            };
            this.watchId = navigator.geolocation.watchPosition(cb_success, cb_error, geo_options);
        }
    }

	/**
	 * Stops watching the position of the user.
	 */
    public static stopWatchingGeoloc(): void {
        if (this.watchId !== 0) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = 0;
        }
    }
}
