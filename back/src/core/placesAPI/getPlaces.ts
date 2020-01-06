import {env} from "../../config/env";

const request = require('request-promise-native');

/*** fields needed to call the API ***/

const clientId = env.PLACES_API_ID;
const clientSecret = env.PLACES_API_SECRET;
const placeTypeToCategoryId: { [index: string]: string } = {
    'vet': '4d954af4a243a5684765b473',
    'park': '4bf58dd8d48988d163941735',
    'groom': '5032897c91d4c4b30a586d69',
};

const getCurrentVersion = function (): string {
    return (new Date()).toISOString().replace(/-/g, '').split('T')[0];
};

/*** input : user position with latitude and longitude, radius in meters (ex: 10000 for 10km), placeType ('vet', 'park' or 'groom')
 * output : Venues Search API result with type Promise (see fields in doc)
 * doc : https://developer.foursquare.com/docs/api/venues/search ***/

async function searchPlaces(lat: number, long: number, radius: number, placeType: string, addDetails: boolean = false): Promise<any> {
    let currentVersion = getCurrentVersion();
    let results = await request({
        url: 'https://api.foursquare.com/v2/venues/search',
        method: 'GET',
        json: true,
        qs: {
            client_id: clientId,
            client_secret: clientSecret,
            categoryId: placeTypeToCategoryId[placeType],
            ll: lat.toString() + ',' + long.toString(),
            v: currentVersion,
            radius: radius.toString()
        }
    });
    if (addDetails) {
      await addDetailsToEachVenue(results);
    }
    return results;
}

/*** Merge Search API results with Details API to get more information on each place (WIP) ***/

async function addDetailsToEachVenue(results: any):Promise<any> {
  await Promise.all(results.response.venues.map(async function (venue: any) {
        venue["details"] = await detailsPlace(venue.id);
      }
  ));
  return results
}

/*** input : id of place (given by search API)
 * output : Venues Details API result with type Promise (see fields in doc)
 * doc : https://developer.foursquare.com/docs/api/venues/details ***/

function detailsPlace(placeId: string): Promise<any> {
    let currentVersion = getCurrentVersion();
    return request({
        url: "https://api.foursquare.com/v2/venues/" + placeId,
        method: 'GET',
        json: true,
        qs: {
            client_id: clientId,
            client_secret: clientSecret,
            v: currentVersion
        }
    });
}

export {searchPlaces};