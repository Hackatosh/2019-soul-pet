import React from 'react';
import peche from '../resources/events/peche.jpg';
import rencontre from '../resources/events/rencontre.jpg';
import randonnee from '../resources/events/randonnee.jpg';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

class Events extends React.Component<RouteComponentProps, {}> {
  render() {
    return (
      <div className="container">
        <div className="row mb-5">
          <div className="col-sm-6 offset-sm-3">
            <h1 className="text-center display-4">Voici les evenements</h1>
          </div>
        </div>
        <div className="row row-cols-2 row-cols-md-3 justify-content-center">
          <div className="col mb-4">
            <div className="card">
              <img src={peche} className="card-img-top" alt="Peche" />
              <div className="card-body">
                <h5 className="card-title">Peche à la ligne</h5>
                <p className="card-text">Pour pecher les poissons de vos amis. <br />Attrapez les tous !</p>
                <Link to="/evenement/1" className="btn btn-primary">Détails</Link>
              </div>
            </div>
          </div>
          <div className="col mb-4">
            <div className="card">
              <img src={rencontre} className="card-img-top" alt="Peche" />
              <div className="card-body">
                <h5 className="card-title">Rencontre amicale</h5>
                <p className="card-text">Ramenez votre animal de compagnie pour
                un moment de détente et rencontrer plein de nouveaux amis</p>
                <Link to="/evenement/1" className="btn btn-primary">Détails</Link>
              </div>
            </div>
          </div>
          <div className="col mb-4">
            <div className="card">
              <img src={randonnee} className="card-img-top" alt="Peche" />
              <div className="card-body">
                <h5 className="card-title">Promenade en forêt</h5>
                <p className="card-text">Ramenez votre animal de compagnie et
                vos chaussures de sport, nous allons randonner dans la vallée
                de Gif-sur-Yvette !</p>
                <Link to="/evenement/1" className="btn btn-primary">Détails</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
  export { Events };

class Evenement extends React.Component<RouteComponentProps, {}> {
  render() {
    return (
          <div className="col mb-4">
            <div className="card">
              <img src={peche} className="card-img-top" alt="Peche" />
              <div className="card-body">
                <h5 className="card-title">Peche à la ligne</h5>
                <p className="card-text">Pour pecher les poissons de vos amis. <br />Attrapez les tous !</p>
                <Link to="/evenement/1" className="btn btn-primary">Détails</Link>
              </div>
            </div>
          </div>
    )
  }
}
  export { Evenement };
