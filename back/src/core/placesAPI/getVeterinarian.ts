const request_promise = require('request-promise-native');

const clientId = "OMUJAQFCEKPCCDPHKQW21VUWVJ1YEBGHN0R0RQRQZWJRRNL3";
const clientSecret = "XQ1BKCP2ARAXAQ4M3AQ0P51CJ5DOVLLVYYINOJWXBXQYEVTZ";
const veterinarianCategoryId = "4d954af4a243a5684765b473";
let currentVersion = (new Date()).toISOString().replace(/-/g, '').split('T')[0]

function searchVeterinarian(pos: string, radius: string){
  return request_promise({
    url: 'https://api.foursquare.com/v2/venues/search',
    method: 'GET',
    json: true,
    qs: {
      client_id: clientId,
      client_secret: clientSecret,
      categoryId: veterinarianCategoryId,
      ll: pos,
      v: currentVersion,
      radius: radius
    }
  });
}

function detailsVeterinarian(veterinarianId: string){
  return request_promise({
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

async function addDetailsToEachVenue(result: any) { //WIP
  await Promise.all(result.response.venues.map((venue: any) => detailsVeterinarian(venue.id).then(
      (details: any) => venue["details"] = details
  )));
  return result;
}

function testPrint(result: any) {
  console.log(result.response.venues);
}

const promise = searchVeterinarian("45.676,4.82115", "10000");

