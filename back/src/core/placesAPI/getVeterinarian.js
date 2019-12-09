var request = require('request');
var request_promise = require('request-promise-native');
var util = require('util');
var request_ = util.promisify(request);
var clientId = "OMUJAQFCEKPCCDPHKQW21VUWVJ1YEBGHN0R0RQRQZWJRRNL3";
var clientSecret = "XQ1BKCP2ARAXAQ4M3AQ0P51CJ5DOVLLVYYINOJWXBXQYEVTZ";
var veterinarianCategoryId = "4d954af4a243a5684765b473";
var currentVersion = (new Date()).toISOString().replace(/-/g, '').split('T')[0];
function getNearestVeterinarian(pos, radius) {
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
function testPrint(result) {
    console.log(result.response.venues);
}
var promise = getNearestVeterinarian("45.676,4.82115", "10000").then(testPrint);
