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

  handleChange = (event : any) => {
    const newDisplay = this.state.toDisplay.filter(el => {
      if (el !== event.target.value)
        return el;
    })
    if (!newDisplay.includes(event.target.value) && event.target.checked)
      newDisplay.push(event.target.value);
    this.setState({toDisplay : newDisplay});
  }

  render(){


    const position=[this.props.lat, this.props.lon];
    return(
      <div className="ServicesMap">
        <div className="container_leaflet">
          <LeafletMap center={position} zoom={this.props.zoom} style={{height: this.props.size, width: this.props.size}}>
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
        </div>
        <div className="services_displayed">
          <form>
          <ul>
            <li><input type="checkbox" value="vets" id="vets" defaultChecked={this.state.toDisplay.includes("vets")} onChange={this.handleChange}/>
        <label>Vétérinaires</label></li>
            <li><input type="checkbox" value="toiletteurs" id="toiletteurs" defaultChecked={this.state.toDisplay.includes("toiletteurs")} onChange={this.handleChange}/>
        <label>Toiletteurs</label></li>
            <li><input type="checkbox" value="parcs" id="parcs" defaultChecked={this.state.toDisplay.includes("parcs")} onChange={this.handleChange}/>
        <label>Parcs</label></li>
          </ul>
          </form>
        </div>
      </div>
    );
  }
}


export { ServicesMap };
