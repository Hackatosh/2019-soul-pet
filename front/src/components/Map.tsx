import React from 'react';
<<<<<<< HEAD
=======

>>>>>>> f1587b352736d06d675e5418eac3df1e9f418634
const { Map: LeafletMap, TileLayer, Marker, Popup } = require('react-leaflet');

interface SServicesMap{
  toDisplay: Array<string>;
  radius: number;
}

interface PServicesMap{
  lat: number;
  lon: number;
  zoom: number;
  size: string;
  markers: Array<MarkerData>;
}

const serviceTypeList = [
  {type:"vet",
  name: "Vétérinaires"},
  {type:"park",
  name: "Parcs"},
  {type:"groom",
  name : "Toiletteurs"}
]

interface MarkerData{
  key:string;
  position: Array<number>;
  info: string;
  serviceType: string;
}


class ServicesMap extends React.Component<PServicesMap, SServicesMap> {
  constructor(props: PServicesMap){
    super(props);
    const toDisplay = serviceTypeList.map(el => (el.type))

    this.state= {toDisplay: toDisplay,
                 radius: 5000}
  }

  updateRadius = (event:any) => {
    this.setState({radius: event.target.value *1000})
  }

  handleChange = (event : any) => {
    const newDisplay = this.state.toDisplay.filter(el => el !== event.target.value)
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
              {this.props.markers.map(el => {
				if (this.state.toDisplay.includes(el.serviceType))
					return (
						<Marker key={el.key} position={el.position}>
							<Popup>
								{el.info}
							</Popup>
						</Marker>
					);
				return null;
				}
			)}

          </LeafletMap>
        </div>
        <div className="services_displayed">
          <input type="range" min="1" max="100" name="distance" onChange={this.updateRadius}/>
          <label>Rayon de recherche : {this.state.radius/1000}</label>
          <form>
          <ul>
          {serviceTypeList.map(serviceType => (
            <li><input type="checkbox" value={serviceType.type} id={serviceType.type} defaultChecked={this.state.toDisplay.includes(serviceType.type)} onChange={this.handleChange}/>
        <label>{serviceType.name}</label></li>
          ))}
          </ul>
          </form>
        </div>
      </div>
    );
  }
}


export { ServicesMap };
