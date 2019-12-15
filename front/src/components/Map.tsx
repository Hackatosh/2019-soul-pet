import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { authenticationService } from '../services';
import { history } from '../helpers';


const { Map: LeafletMap, TileLayer, Marker, Popup } = require('react-leaflet');


type Position = [number, number]

type Details = any /*{|
  content: string,
  position: Position,
|}*/

type MarkerData = any //{| ...Details, key: string |}


type State = {
  lat: number,
  lon: number,
  zoom: number,
  size: string
  markers: Array<MarkerData>
}

class ServicesMap extends React.Component {
  constructor(props: RouteComponentProps, state: State){
    super(props);
    state = {
      lat: 48.864716,
      lon: 2.349014,
      zoom : 10,
      size : "400px",
      markers: [
        {
          key: "marker1",
          position: [48.86471, 2.349014],
          info:"Hello there"
        },
        {
          key: "marker2",
          position: [48.86, 2.349016],
          info:"General Kenobi"
        }
      ]
    };
  }




  render(){
    const position=[this.state.lat, this.state.lon];
    console.log(this.props);
    return(
      <LeafletMap center={position} zoom={this.props.state.zoom} style={{height: this.props.state.size}}>
        <TileLayer
                 attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               />
          {this.props.state.markers.map(el => (

              <Marker position={el.position}>
                <Popup>
                 {el.info}
                </Popup>
              </Marker>
          ))}

      </LeafletMap>
    );
  }
}


export { ServicesMap };
