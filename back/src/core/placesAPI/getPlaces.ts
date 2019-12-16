const request = require('request-promise-native');

/*** fields needed to call the API ***/
const clientId = "OMUJAQFCEKPCCDPHKQW21VUWVJ1YEBGHN0R0RQRQZWJRRNL3";
const clientSecret = "XQ1BKCP2ARAXAQ4M3AQ0P51CJ5DOVLLVYYINOJWXBXQYEVTZ";
const veterinarianCategoryId = "4d954af4a243a5684765b473";
let currentVersion = (new Date()).toISOString().replace(/-/g, '').split('T')[0]


/*** input : user position with latitude and longitude, radius in meters (ex: 10000 for 10km), placeType ('vets', 'park' or 'groom')
 * output : Venues Search API result with type Promise (see fields in doc)
 * doc : https://developer.foursquare.com/docs/api/venues/search ***/
function searchPlaces(lat: number, long: number, radius: number, placeType: string) : Promise<any>{
  return request({
    url: 'https://api.foursquare.com/v2/venues/search',
    method: 'GET',
    json: true,
    qs: {
      client_id: clientId,
      client_secret: clientSecret,
      categoryId: veterinarianCategoryId,
      ll: lat.toString() + ',' + long.toString(),
      v: currentVersion,
      radius: radius.toString()
    }
  });
}

/*** input : id of place (given by search API)
 * output : Venues Details API result with type Promise (see fields in doc)
 * doc : https://developer.foursquare.com/docs/api/venues/details ***/
function detailsPlace(placeId: string) : Promise<any>{
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

/*** Merge Search API results with Details API to get more information on each place (WIP) ***/
async function addDetailsToEachVenue(result: any){
  await Promise.all(result.response.venues.map((venue: any) => detailsPlace(venue.id).then(
      (details: any) => venue["details"] = details
  )));
  return result;
}

/*** Print results ***/
function testPrint(result: any) {
  console.log(result.response.venues);
}

export {searchPlaces};