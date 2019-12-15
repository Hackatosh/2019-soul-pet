import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { authenticationService } from '../services';
import { history } from '../helpers';


const { Map: LeafletMap, TileLayer, Marker, Popup } = require('react-leaflet');

interface SServicesMap{
  toDisplay: Array<string>;
}

interface PServicesMap{
  lat: number;
  lon: number;
  zoom: number;
  size: string;
  markers: Array<MarkerData>;
}


interface MarkerData{
  key:string;
  position: Array<number>;
  info: string;
  serviceType: string;
}


class ServicesMap extends React.Component<PServicesMap, SServicesMap> {
  constructor(props: PServicesMap){
    super(props);
    this.state= {toDisplay: ["vets", "parcs", "toiletteurs"]}
  }


  render(){


    const position=[this.props.lat, this.props.lon];
    console.log(this.props);
    console.log(this.state);
    let display = this.state.toDisplay;
    return(
      <div className="ServicesMap">
      <LeafletMap center={position} zoom={this.props.zoom} style={{height: this.props.size}}>
        <TileLayer
                 attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               />
          {this.props.markers.map(el => {if (this.state.toDisplay.includes(el.serviceType))
            return(
                <Marker key={el.key} position={el.position}>
                  <Popup>
                   {el.info}
                  </Popup>
                </Marker>
          )})}

      </LeafletMap>
      <form>
      <input type="checkbox" value="vets" id="vets"/>
      <label>Vétérinaires</label>
      <input type="checkbox" value="toiletteurs" id="toiletteurs"/>
      <label>Toiletteurs</label>
      <input type="checkbox" value="parcs" id="parcs"/>
      <label>Parcs</label>
      </form>
      </div>
    );
  }
}


export { ServicesMap };
