import React from 'react';
import {EventCard} from './EventCard';
import peche from '../resources/events/peche.jpg';
import rencontre from '../resources/events/rencontre.jpg';
import randonnee from '../resources/events/randonnee.jpg';
import { RouteComponentProps } from 'react-router';
import Pagination from 'react-bootstrap/Pagination'
import PageItem from 'react-bootstrap/PageItem'
import { PetEvent } from '../models/PetEvent';

export class EventList extends React.Component<RouteComponentProps, {}> {

  render() {

      let active = 2;
      let items = [];
      for (let number = 1; number <= 5; number++) {
        items.push(
          <Pagination.Item key={number} active={number === active}>
            {number}
          </Pagination.Item>,
        );
      }

      const paginationBasic = (
        <div>
          <Pagination>{items}</Pagination>
        </div>
      );
      const event:PetEvent = {id:1,title:"Mon event",description:"Ca alors quel evenement hors du commun",organisateur:"Moi meme",begin_date:new Date(),end_date:new Date()}

      let numberEvent = [];
      for (let number = 1; number <= 5; number++) {
        numberEvent.push(
          <EventCard event={event}/>
        );
      }

      const liste = (
        <div>
          {numberEvent.map(number => number)}
        </div>
      );

    return (
      <div className="container">
        <div className="row mb-5">
          <div className="col-sm-6 offset-sm-3">
            <h1 className="text-center display-4">Voici les events</h1>
          </div>
        </div>
        <div className="row row-cols-2 row-cols-md-3 justify-content-center">
          <EventCard event={event}/>
          <EventCard event={event}/>
          <EventCard event={event}/>
        </div>
        {paginationBasic}
      </div>

    )
  }
}
