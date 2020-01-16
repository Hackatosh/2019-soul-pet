import React from 'react';
import { PServicesMap, SServicesMap, ListMarkerData } from '../models';
import { GetServicesServices } from '../services';
import { iconVet, iconPark, iconGroom } from '../models';
//import { getUserLocation } from '../helpers';
const { Map: LeafletMap, TileLayer, Marker, Popup } = require('react-leaflet');


const serviceTypeList = [
  {type:"vet",
  name: "Vétérinaires",
  icon: iconVet},
  {type:"park",
  name: "Parcs",
  icon: iconPark},
  {type:"groom",
  name : "Toiletteurs",
  icon: iconGroom}
]
const easterEggMarkers = [
               {
                 key: "marker1",
                 position: [48.86471, 2.349014],
                 info:"Dr Obiwan Kenobi, 18b rue Tiquetonne",
                 serviceType: "vet"
               },
               {
                 key: "marker2",
                 position: [48.865, 2.338],
                 info:"Parc Grasswalker",
                 serviceType: "park"
               },
               {
                 key: "marker3",
                 position: [48.86, 2.36],
                 info:"Chewbacca's style, 3 rue des Quatre Fils",
                 serviceType: "groom"
               },
               {
                 key: "marker4",
                 position: [48.862, 2.33],
                 info:"Parc Highground",
                 serviceType: "park"
               },
             ]


class ServicesMap extends React.Component<PServicesMap, SServicesMap> {
  constructor(props: PServicesMap){
    super(props);
    const toDisplay = serviceTypeList.map(el => (el.type))


    this.state= {userPosition: [this.props.lat, this.props.lon],
                 toDisplay: toDisplay,
                 radius: 5000,
                 markers: []
               }
  }

  async componentDidMount(){
    this.queryAPIServices({});
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

  queryAPIServices = async (event : any) => {
    let markersAllTypes: ListMarkerData = []
    try{
      for (let i = 0; i < serviceTypeList.length; i++) {
        const markers = await GetServicesServices.get_services(this.props.lat,
          this.props.lon, this.state.radius, serviceTypeList[i].type);
          markersAllTypes = markersAllTypes.concat(markers)
        }
        this.setState({markers: ((markersAllTypes===[]) ? easterEggMarkers : markersAllTypes)})

      } catch(error){
        this.setState({markers: easterEggMarkers});
      }


  }


  render(){


    return(
      <div className="ServicesMap">
        <div className="container_leaflet">
          <LeafletMap center={this.state.userPosition} zoom={this.props.zoom} style={{height: this.props.size, width: this.props.size}}>
            <TileLayer
                     attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   />
            <Marker position={this.state.userPosition} >
              <Popup>
                Vous êtes ici !
              </Popup>
            </Marker>
        {this.state.markers.map(el => {
        const icon = (serviceTypeList.filter(serviceType => (serviceType.type === el.serviceType)))[0].icon
				if (this.state.toDisplay.includes(el.serviceType))
					return (
						<Marker key={el.key} position={el.position} icon={icon}>
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
          <button className="btn btn-primary btn-block" onClick={this.queryAPIServices}>Recherche</button>
        </div>
      </div>
    );
  }
}


export { ServicesMap };
