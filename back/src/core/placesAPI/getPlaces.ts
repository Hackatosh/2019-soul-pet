import {env} from "../../config/env";

const request = require('request-promise-native');

/***
 * This array contains the different place type that can be queried from the Places API.
 ***/

const placeTypeToCategoryId: { [index: string]: string } = {
    'vet': '4d954af4a243a5684765b473',
    'park': '4bf58dd8d48988d163941735',
    'groom': '5032897c91d4c4b30a586d69',
};

/***
 * Create the string that will be used in the currentVersion field for the Places API.
 ***/

const getCurrentVersion = function (): string {
    return (new Date()).toISOString().replace(/-/g, '').split('T')[0];
};

/***
 * Input : user position with latitude and longitude, radius in meters (ex: 10000 for 10km), placeType ('vet', 'park' or 'groom')
 * Output : An array of results obtained from the Venues Search API, wrapped in a Promise (see fields in doc)
 * Doc : https://developer.foursquare.com/docs/api/venues/search
 ***/

async function searchPlaces(lat: number, long: number, radius: number, placeType: string, addDetails: boolean = false): Promise<Array<any>> {
    let currentVersion = getCurrentVersion();
    let results = await request({
        url: 'https://api.foursquare.com/v2/venues/search',
        method: 'GET',
        json: true,
        qs: {
            client_id: env.PLACES_API_ID,
            client_secret: env.PLACES_API_SECRET,
            categoryId: placeTypeToCategoryId[placeType],
            ll: lat.toString() + ',' + long.toString(),
            v: currentVersion,
            radius: radius.toString(),
        }
    });
    const venues = results.response.venues;
    if (addDetails) {
        await addDetailsToEachVenue(venues);
    }
    return venues;
}

/***
 * This function enriches the results from the Search API results using the Details API.
 ***/

async function addDetailsToEachVenue(venues: any): Promise<Array<any>> {
    const addDetailsToVenue = async function (venue: any) {
        venue["details"] = await detailsPlace(venue.id);
    };
    await Promise.all(venues.map(addDetailsToVenue));
    return venues;
}

/***
 * Input : id of place (given by search API)
 * Output : Venues Details API result with type Promise (see fields in doc)
 * Doc : https://developer.foursquare.com/docs/api/venues/details
 ***/

function detailsPlace(placeId: string): Promise<any> {
    let currentVersion = getCurrentVersion();
    return request({
        url: "https://api.foursquare.com/v2/venues/" + placeId,
        method: 'GET',
        json: true,
        qs: {
            client_id: env.PLACES_API_ID,
            client_secret: env.PLACES_API_SECRET,
            v: currentVersion,
        }
    });
}

export {searchPlaces};