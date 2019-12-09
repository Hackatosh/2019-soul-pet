var request = require('request');
var clientId = "OMUJAQFCEKPCCDPHKQW21VUWVJ1YEBGHN0R0RQRQZWJRRNL3";
var clientSecret = "XQ1BKCP2ARAXAQ4M3AQ0P51CJ5DOVLLVYYINOJWXBXQYEVTZ";
var currentVersion = (new Date()).toISOString().replace(/-/g, '').split('T')[0];
function getNearestVeterinarian(long, lat, radius) {
    request({
        url: 'https://api.foursquare.com/v2/venues/search',
        method: 'GET',
        json: true,
        qs: {
            client_id: clientId,
            client_secret: clientSecret,
            ll: long + ',' + lat,
            v: currentVersion,
            radius: radius,
            query: "veterinaire",
            limit: 10
        }
    }, function (err, res, body) {
        if (err) {
            console.error(err);
        }
        else {
            return body.response.venues[0].id;
        }
    });
}
var result = getNearestVeterinarian("45.676", "4.82115", "5000");
console.log(result);
