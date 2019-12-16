import React from 'react';
import peche from '../resources/events/peche.jpg';
import { RouteComponentProps } from 'react-router';

export class EventDetails extends React.Component<RouteComponentProps, {}> {
  render() {
    return (
          <div className="col mb-4">
            <div className="card">
              <img src={peche} className="card-img-top" alt="Peche" />
              <div className="card-body">
                <h5 className="card-title">Peche à la ligne</h5>
                <p className="card-text">Pour pecher les poissons de vos amis. <br />Attrapez les tous !</p>
              </div>
            </div>
          </div>
    )
  }
}
