import { httpClient } from '../helpers';
import { ListMarkerData, MarkerData } from '../models';


/**
 * This is used to retrieve the services given a location and a radius.
 */
export class GetServicesServices{
    /**
     * Retrieves a list of services for a specific type. It queries the `/places`
     * back API.
     * @param lat latitude of the user
     * @param lon longitude of the user
     * @param radius radius around which to find services
     * @param placeType type of service to look for
     * @returns listMarkerData list of markers with details such as position
     * or address (string) about found services
     */
    static async get(lat: number, lon: number, radius: number, placeType: string): Promise<ListMarkerData>{
      var listMarkerData: ListMarkerData = [];
      return httpClient.get<any>('/places/search?lat='+ lat +'&long='+ lon +'&radius='+ radius +'&placeType='+ placeType, true).then(venues => {
          listMarkerData = venues.map((venue :any) => {
            let marker: MarkerData = {
              key: venue.id,
              info: venue.name + (venue.location.address ? (', ' + venue.location.address): '') ,
              position: [venue.location.lat, venue.location.lng],
              serviceType: placeType
            };
            return marker;
          })
          return listMarkerData;
      }, () => {
          return Promise.reject('Aucun services trouvés');
      });
    }
}
