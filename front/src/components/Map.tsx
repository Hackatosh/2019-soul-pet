import React from 'react';
import { PServicesMap, SServicesMap, ListMarkerData } from '../models';
import { GetServicesServices, GeolocationService } from '../services';
import { iconVet, iconPark, iconGroom, imageVet, imagePark, imageGroom } from '../models';
import { Form } from 'react-bootstrap';
const { Map: LeafletMap, TileLayer, Marker, Popup } = require('react-leaflet');

/**
 * All the services type which can be displayed on the map and some bound properties
 */
const serviceTypeList = [
  	{
	  type:"vet",
		name: "Vétérinaires",
		icon: iconVet,
		color: 'danger',
		imagePath: imageVet
	},
  	{
		type:"park",
		name: "Parcs",
		icon: iconPark,
		color: 'success',
		imagePath: imagePark
	},
  	{
		type:"groom",
		name : "Toiletteurs",
		icon: iconGroom,
		color: 'info',
		imagePath: imageGroom
	}
];

/**
 * For Star Wars fans (and initial debugging). Only appears for the unlucky users.
 */
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
];

/**
 * A component which is used to display a map with the services queried by the user.
 * The information displayed are updated depending on the interactions with the user.
 */
class ServicesMap extends React.Component<PServicesMap, SServicesMap> {
	constructor(props: PServicesMap){
		super(props);
		const toDisplay = serviceTypeList.map(el => (el.type));
		this.state= {
			notice: '',
			userPosition: {
        lat: this.props.lat,
        lon: this.props.lon
      },
			toDisplay: toDisplay,
			radius: 5000,
			markers: [],
			isQuerying: false,
		};

		this.createMarker = this.createMarker.bind(this);
		this.geolocate = this.geolocate.bind(this);
	}
  /**
   * when component is done being mounted, tries to locate the user and
   * loads the services nearby with default parameters
   */
	async componentDidMount() {
		await this.geolocate();
		await this.queryAPIServices();
	}

	async componentDidUpdate(prevProps:Readonly<PServicesMap>, prevState:Readonly<SServicesMap>, snapshot?:any) {
		const isDifferent = (this.state.userPosition.lat !== prevState.userPosition.lat) || (this.state.userPosition.lon !== prevState.userPosition.lon) || (this.state.radius !== prevState.radius);
		if(!this.state.isQuerying && isDifferent){
			await this.queryAPIServices();
		}
	}

	private updateRadius = (event: any) => {
		this.setState({radius: event.target.value *1000})
	};

	private handleChange = (event: any) => {
		const newDisplay = this.state.toDisplay.filter(el => el !== event.target.value);
		if (!newDisplay.includes(event.target.value) && event.target.checked)
			newDisplay.push(event.target.value);
		this.setState({toDisplay : newDisplay});
	};

  /**
   * Queries the back API `places` which returns the nearby services given in
   * list `serviceTypeList`. This updates the state of the component.
   */

	private queryAPIServices = async () => {
		if(!this.state.isQuerying){
			this.setState({isQuerying:true});
			let markersAllTypes: ListMarkerData = [];
			try {
				for (let i = 0; i < serviceTypeList.length; i++) {
					const markers = await GetServicesServices.get(this.state.userPosition.lat,
						this.state.userPosition.lon, this.state.radius, serviceTypeList[i].type);
					markersAllTypes = markersAllTypes.concat(markers);
				}
				this.setState({isQuerying: false, markers: ((markersAllTypes===[]) ? easterEggMarkers : markersAllTypes)});
			} catch(error) {
				this.setState({isQuerying: false, markers: easterEggMarkers});
			}
		}
	};

	private async geolocate():Promise<void> {
		try {
			const c = await GeolocationService.getCoordinates();
			this.setState({ notice: '', userPosition: {lat:c.latitude, lon:c.longitude}});
		} catch(e){
			this.setState({ notice: 'Impossible de récupérer votre position' });
		}
	}

	private createMarker(service: any): JSX.Element | null {
		const icon = (serviceTypeList.filter(serviceType => (serviceType.type === service.serviceType)))[0].icon;
		if (this.state.toDisplay.includes(service.serviceType))
			return (
				<Marker key={service.key} position={service.position} icon={icon}>
					<Popup>{service.info}</Popup>
				</Marker>
			);
		return null;
	}
  /**
   * Displays a map using Leaflet map, switches for each services, range input
   * for the radius and markers on the map for each services displayed.
   */
	render() {
		return(
			<div className="container">
				<div className="row">
					<div className="col-10 offset-1 col-md-6" style={{ minHeight: '60vh' }}>
						<LeafletMap key={String(this.state.userPosition.lat)+String(this.state.userPosition.lon)} center={this.state.userPosition} zoom={this.props.zoom} style={{height: '100%', width: '100%'}}>
							<TileLayer
								attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
								url="https://cartodb-basemaps-1.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
							/>
							<Marker position={[this.state.userPosition.lat, this.state.userPosition.lon]}>
								<Popup>Vous êtes ici !</Popup>
							</Marker>
							{this.state.markers.map(this.createMarker)}
						</LeafletMap>
					</div>
					<div className="col-10 offset-1 col-md-4 offset-md-0">
						{this.state.notice !== '' && <div className="alert alert-info" style={{ width: '300px' }}>{this.state.notice}</div>}
						<Form>
							<Form.Group>
								<Form.Label>Localisation&nbsp;:</Form.Label>
								<button type="button" className="btn btn-success btn-lg" style={{ width: '300px' }} onClick={this.geolocate}>Me localiser</button>
							</Form.Group>
							<Form.Group>
								<Form.Label>Services disponibles&nbsp;:</Form.Label>
								<ul className="list-group">
									{serviceTypeList.map(serviceType => (
										<li className="list-group-item d-flex justify-content-between align-items-center" key={serviceType.type}>
											<Form.Check type="switch" id={serviceType.type} label={serviceType.name}
											onChange={this.handleChange} value={serviceType.type}
											checked={this.state.toDisplay.includes(serviceType.type)} />
											<img alt ="" src={serviceType.imagePath} style={{width: "20px"}}></img>
										</li>
									))}
								</ul>
							</Form.Group>
							<Form.Group>
								<Form.Label>Rayon&nbsp;:</Form.Label>
								<ul className="list-group">
									<li className="list-group-item d-flex justify-content-between align-items-center">
										<input type="range" name="distance" onChange={this.updateRadius} min="1" max="50"
										className="custom-range" value={this.state.radius / 1000} style={{ width: '75%' }}
										onMouseUp={this.queryAPIServices} />
										<span className="badge badge-info badge-pill">{this.state.radius / 1000}&nbsp;km</span>
									</li>
								</ul>
							</Form.Group>
						</Form>
					</div>
				</div>
			</div>
		);
  	}
}

export { ServicesMap };
