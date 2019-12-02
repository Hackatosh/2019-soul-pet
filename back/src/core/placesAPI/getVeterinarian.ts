const request = require('request');
const clientId = "OMUJAQFCEKPCCDPHKQW21VUWVJ1YEBGHN0R0RQRQZWJRRNL3";
const clientSecret = "XQ1BKCP2ARAXAQ4M3AQ0P51CJ5DOVLLVYYINOJWXBXQYEVTZ";
let currentVersion = (new Date()).toISOString().replace(/-/g, '').split('T')[0]

function getNearestVeterinarian(long: string, lat: string, radius: string){
  request({
    url: 'https://api.foursquare.com/v2/venues/search',
    method: 'GET',
    qs: {
      client_id: clientId,
      client_secret: clientSecret,
      ll: long+','+lat,
      v: currentVersion,
      radius: radius,
      query: "veterinaire",
      limit: 10
    }
  }, function(err: any, res: any, body: any) {
    if (err) {
      console.error(err);
    } else {
      console.log(typeof body);
    }
  });
}

getNearestVeterinarian("45.676", "4.82115", "5000")
