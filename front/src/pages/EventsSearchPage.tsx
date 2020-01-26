import React from 'react';
import {EventCard} from '../components/EventCard';
import {RouteComponentProps} from 'react-router';
import Pagination from 'react-bootstrap/Pagination'
import {PetEvent} from '../models';
import {Button} from "react-bootstrap";
import {EventForm} from "../components/EventForm";

interface EventsSearchPageState {
    showEventForm: boolean;
    error: string;
    events: PetEvent[];
}

export class EventsSearchPage extends React.Component<RouteComponentProps, EventsSearchPageState> {

    constructor(props: RouteComponentProps) {
        super(props);
        const event1: PetEvent = {
            id: 10,
            name: "Ballade sur la plage",
            description: "wif",
            userId: 1,
            beginDate: new Date(),
            endDate: new Date()
        };
        const event2: PetEvent = {
            id: 11,
            name: "Sortie toiletteur",
            description: "wouf",
            userId: 1,
            beginDate: new Date(),
            endDate: new Date()
        };
        this.state = {showEventForm: false, error: '', events: [event1, event2]};
    }

    private showEventForm(state: boolean) {
        this.setState({showEventForm: state});
    }

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
        return (
            <div className="container">
                <div className="row row-cols-1 row-cols-md-3 justify-content-center">
                    <div className="col mb-4">
                        <p className="text-center"><Button variant="success" onClick={() => this.showEventForm(true)}>Créer
                            un évènement</Button></p>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-sm-6 offset-sm-3">
                        <h1 className="text-center display-4">Voici les events</h1>
                    </div>
                </div>
                <div className="row row-cols-2 row-cols-md-3 justify-content-center">
                    {this.state.events.map(event => <EventCard key={event.id} event={event}/>)}
                </div>
                {paginationBasic}
                <EventForm show={this.state.showEventForm} onHide={() => this.showEventForm(false)}
                           onSuccess={(event: PetEvent) => this.setState({events: [event].concat(this.state.events)})}/>
            </div>

        )
    }
}
