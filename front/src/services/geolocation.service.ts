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

    public static async getCoordinates(startWatching: boolean = false): Promise<Coordinates> {
        if (this.coordinates !== undefined) {
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
                    console.log(e);
                    return await Promise.reject(e);
                }
            } else {
                return Promise.reject('La géolocalisation n\'est pas disponible sur ce navigateur');
            }
        }
    }

    public static startWatchingGeoloc(): void {
        if (this.watchId === 0) {
            const cb_success = (position: Position) => {
                this.coordinates = position.coords;
                console.log("New coordinates obtained : ");
                console.log(this.coordinates);
            };
            const cb_error = () => {
                console.log("Problem when retrieving the geolocation, stopping watching the position...");
                this.stopWatchingGeoloc();
            };
            const geo_options: PositionOptions = {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            };
            console.log("Starting Geolocation service...");
            this.watchId = navigator.geolocation.watchPosition(cb_success, cb_error, geo_options);
        }
    }

    public static stopWatchingGeoloc(): void {
        if (this.watchId !== 0) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = 0;
        }
    }

}