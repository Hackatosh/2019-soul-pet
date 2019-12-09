import React from 'react';
import peche from '../resources/events/peche.jpg';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

class Events extends React.Component<RouteComponentProps, {}> {
  render() {
    return (
      <div className="col mb-4">
        <div className="card">
          <img src={peche} className="card-img-top" alt="Peche" />
          <div className="card-body">
            <h5 className="card-title">Peche à la ligne</h5>
            <p className="card-text">Venez on va bien rigoler</p>
            <Link to="/animal/7" className="btn btn-primary">Détails</Link>
          </div>
        </div>
      </div>
    )
  }
}
  export { Events };
