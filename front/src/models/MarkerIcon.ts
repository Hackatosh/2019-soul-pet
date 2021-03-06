import L from 'leaflet';
import imageVet from '../resources/icons/001-maps-and-flags-1.png';
import imagePark from '../resources/icons/002-maps-and-flags-2.png';
import imageGroom from '../resources/icons/003-maps-and-flags-3.png';
import shadow from '../resources/icons/shadow.png';

const iconPark = L.icon({
  iconUrl: imagePark,
  shadowUrl: shadow,
  iconSize:     [38, 40],
  shadowSize:   [50, 64],
  iconAnchor:   [22, 40],
  shadowAnchor: [20, 62],
  popupAnchor:  [-3, -40]
});

const iconVet = L.icon({
  iconUrl: imageVet,
  shadowUrl: shadow,
  iconSize:     [38, 40],
  shadowSize:   [50, 64],
  iconAnchor:   [22, 40],
  shadowAnchor: [20, 62],
  popupAnchor:  [-3, -40]

});

const iconGroom = L.icon({
  shadowUrl: shadow,
  iconUrl: imageGroom,
  iconSize:     [38, 40],
  shadowSize:   [50, 64],
  iconAnchor:   [22, 40],
  shadowAnchor: [20, 62],
  popupAnchor:  [-3, -40]
});


export { iconPark, iconGroom, iconVet, imageVet, imagePark, imageGroom };
