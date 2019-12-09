import React from 'react';
import { Link } from 'react-router-dom';
import { authenticationService } from '../services';
import { history } from '../helpers';


const { Map: LeafletMap, TileLayer, Marker, Popup } = require('react-leaflet');


type State = {
  lat: number,
  lon: number,
  zoom: number
}
type size = string;

class ServicesMap extends React.Component<{}, State, size> {
  state = {
    lat: 48.864716,
    lon: 2.349014,
    zoom : 10
  }

  size = "400px"

  render(){
    const position=[this.state.lat, this.state.lon];
    return(
      <LeafletMap center={position} zoom={this.state.zoom} style={{height: this.size}}>
        <TileLayer
                 attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               />
        <Marker position={position}>
          <Popup>
           A Pretty Popup!
          </Popup>
        </Marker>
      </LeafletMap>
    );
  }
}


export { ServicesMap };
