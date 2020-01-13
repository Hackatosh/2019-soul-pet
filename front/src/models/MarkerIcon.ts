import L from 'leaflet';
import imageVet from '../resources/icons/001-maps-and-flags-1.png';
import imagePark from '../resources/icons/002-maps-and-flags-2.png';
import imageGroom from '../resources/icons/003-maps-and-flags-3.png';


const iconPark = L.icon({
  iconUrl: imagePark,
  iconSize: [26, 40],
  shadowSize:   [50, 64], // size of the shadow
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowAnchor: [4, 62],  // the same for the shadow
});

const iconVet = L.icon({
  iconUrl: imageVet,
  iconSize: [26, 40],
  shadowSize:   [50, 64], // size of the shadow
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowAnchor: [4, 62],  // the same for the shadow
});

const iconGroom = L.icon({
  iconUrl: imageGroom,
  iconSize: [26, 40],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});


export { iconPark, iconGroom, iconVet };
