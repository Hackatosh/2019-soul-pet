import React from 'react';
import { authenticationService } from '../services';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import { history, randomBackground } from '../helpers';
import { ServicesMap } from '../components';

/*
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


class ServicesPage extends React.Component<RouteComponentProps, {}> {
  constructor(props: RouteComponentProps){
    super(props);


  }


  render(){
    const state: State = {
        lat: 48.864716,
        lon: 2.349014,
        zoom : 10,
        size : "400px",
        markers: [
          {
            key: "marker1",
            position: [48.86471, 2.349014],
            info:"General Kenobi"
          },
          {
            key: "marker2",
            position: [48.864714, 2.349016],
            info:"You are a bold one"
          }
        ]
      };


    return (
			<div className="container">
				<div className="row mb-5">
					<div className="col-sm-6 offset-sm-3">
						<h1 className="text-center display-4">Bonjour {authenticationService.currentUserValue.username}&nbsp;!</h1>
          <ServicesMap state = {state}/>
        </div>
      </div>
      </div>
    );
  }
}




export { ServicesPage };
