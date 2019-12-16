import React from 'react';
import peche from '../resources/events/peche.jpg';
import rencontre from '../resources/events/rencontre.jpg';
import randonnee from '../resources/events/randonnee.jpg';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

export class EventList extends React.Component<RouteComponentProps, {}> {
  render() {
    return (
      <div className="container">
        <div className="row mb-5">
          <div className="col-sm-6 offset-sm-3">
            <h1 className="text-center display-4">Voici les events</h1>
          </div>
        </div>
        <div className="row row-cols-2 row-cols-md-3 justify-content-center">
          <div className="col mb-4">
            <div className="card">
              <img src={peche} className="card-img-top" alt="Peche" />
              <div className="card-body">
                <h5 className="card-title">Peche à la ligne</h5>
                <h6 className="card-title">Date de l'event</h6>
                <p className="card-text">Pour pecher les poissons de vos amis. <br />Attrapez les tous !</p>
                <h6 className="card-title">Organisé par</h6>
                <Link to="/events/1" className="btn btn-primary">Détails</Link>
              </div>
            </div>
          </div>
          <div className="col mb-4">
            <div className="card">
              <img src={rencontre} className="card-img-top" alt="Peche" />
              <div className="card-body">
                <h5 className="card-title">Titre</h5>
                <h6 className="card-title">Date de l'event</h6>
                <p className="card-text">Description de l' en 2 lignes</p>
                <h6 className="card-title">Organisé par</h6>
                <Link to="/events/1" className="btn btn-primary">Détails</Link>
              </div>
            </div>
          </div>
          <div className="col mb-4">
            <div className="card">
              <img src={randonnee} className="card-img-top" alt="Peche" />
              <div className="card-body">
                <h5 className="card-title">Promenade en forêt</h5>
                <h6 className="card-title">Date de l'event</h6>
                <p className="card-text">Ramenez votre animal de compagnie et
                vos chaussures de sport</p>
                <h6 className="card-title">Organisé par</h6>
                <Link to="/events/1" className="btn btn-primary">Détails</Link>
              </div>
            </div>
          </div>
          <div className="col mb-4">
            <div className="card">
              <img src={rencontre} className="card-img-top" alt="Peche" />
              <div className="card-body">
                <h5 className="card-title">Titre</h5>
                <h6 className="card-title">Date de l'events</h6>
                <p className="card-text">Description de l' en 2 lignes</p>
                <h6 className="card-title">Organisé par</h6>
                <Link to="/events/1" className="btn btn-primary">Détails</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
