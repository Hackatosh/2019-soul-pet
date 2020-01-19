import { httpClient } from '../helpers';
import { ListMarkerData, MarkerData } from '../models';



export class GetServicesServices{
    static async get(lat: number, lon: number, radius: number, placeType: string): Promise<any>{
      var listMarkerData: ListMarkerData = []
      return httpClient.get<any>('/places/search?lat='+ lat +'&long='+ lon +'&radius='+ radius +'&placeType='+ placeType, true).then(response => {
          //console.log(response)
          listMarkerData = response.response.venues.map((venue :any) => {
            let marker: MarkerData = {
              key: venue.id,
              info: venue.name + (venue.location.address ? (', ' + venue.location.address): '') ,
              position: [venue.location.lat, venue.location.lng],
              serviceType: placeType
            };
            return marker;
          })
          console.log(listMarkerData);
          return listMarkerData;
      }, () => {
          return Promise.reject('Aucun services trouvés');
      });
    }
}
