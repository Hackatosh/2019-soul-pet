

getUserLocation = function () {

    let pos = {
        lat: '',
        lon: '',
        status: ''
    }

    function success(position) {

        pos.lat = position.coords.latitude;
        pos.lon = position.coords.longitude;
        return pos
    }

    function error() {
        pos.status = 'Unable to retrieve your location';
    }

    if (!navigator.geolocation) {
        pos.status = 'Geolocation is not supported by your browser';
    } else {
        pos.status = 'Locating…';
        await navigator.geolocation.getCurrentPosition(success, error);
    }
    return pos; // not returns anything at first
}

export default { getUserLocation };
