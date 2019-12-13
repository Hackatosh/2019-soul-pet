const request = require('request-promise-native');

/*** fields needed to call the API ***/
const clientId = "OMUJAQFCEKPCCDPHKQW21VUWVJ1YEBGHN0R0RQRQZWJRRNL3";
const clientSecret = "XQ1BKCP2ARAXAQ4M3AQ0P51CJ5DOVLLVYYINOJWXBXQYEVTZ";
const veterinarianCategoryId = "4d954af4a243a5684765b473";
let currentVersion = (new Date()).toISOString().replace(/-/g, '').split('T')[0]


/*** input : user position with latitude and longitude, radius in meters (ex: 10000 for 10km)
 * output : Venues Search API result with type Promise (see fields in doc)
 * doc : https://developer.foursquare.com/docs/api/venues/search ***/
function searchVeterinarian(lat: number, long: number, radius: number) : Promise<any>{
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

/*** input : id of veterinarian (given by search API)
 * output : Venues Details API result with type Promise (see fields in doc)
 * doc : https://developer.foursquare.com/docs/api/venues/details ***/
function detailsVeterinarian(veterinarianId: string) : Promise<any>{
  return request({
    url: "https://api.foursquare.com/v2/venues/" + veterinarianId,
    method: 'GET',
    json: true,
    qs: {
      client_id: clientId,
      client_secret: clientSecret,
      v: currentVersion
    }
  });
}

/*** Merge Search API results with Details API to get more information on each veterinarian (WIP) ***/
async function addDetailsToEachVenue(result: any){
  await Promise.all(result.response.venues.map((venue: any) => detailsVeterinarian(venue.id).then(
      (details: any) => venue["details"] = details
  )));
  return result;
}

/*** Print results ***/
function testPrint(result: any) {
  console.log(result.response.venues);
}

const testPromise = searchVeterinarian(45.676,4.82115, 10000).then(testPrint);