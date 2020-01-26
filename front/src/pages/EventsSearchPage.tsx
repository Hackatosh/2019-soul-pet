import React from 'react';
import {EventCard} from '../components/EventCard';
import {RouteComponentProps} from 'react-router';
import Pagination from 'react-bootstrap/Pagination'
import {Animal, PetEvent} from '../models';
import {Button} from "react-bootstrap";
import {EventForm} from "../components/EventForm";
import {AnimalService, AuthenticationService} from "../services";
import {EventService} from "../services/event.service";

interface EventsSearchPageState {
    showEventForm: boolean;
    error: string;
    events: PetEvent[];
}

export class EventsSearchPage extends React.Component<RouteComponentProps, EventsSearchPageState> {

    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {showEventForm: false, error: '', events: []};
    }

    componentDidMount() {
        EventService.getAll().then((events: PetEvent[]) => this.setState({ events: events })).catch(() => this.setState({ error: 'Erreur lors de la récupération des évènements' }));
    }

    private showEventForm(state: boolean) {
        this.setState({showEventForm: state});
    }

    render() {
        /***
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
         ***/
        return (
            <div className="container">
                {this.state.error !== '' &&
                <div className="row mb-5">
                    <div className="col-sm-6 offset-sm-3"><div className="alert alert-danger">{this.state.error}</div></div>
                </div>}
                <div className="row row-cols-1 row-cols-md-3 justify-content-center">
                    <div className="col mb-4">
                        <p className="text-center"><Button variant="success" onClick={() => this.showEventForm(true)}>Créer
                            un évènement</Button></p>
                    </div>
                </div>
                {this.state.events.length === 0 &&
                <div className="row mb-5">
                    <div className="col-sm-6 offset-sm-3"><div className="alert alert-primary">Aucun évènement trouvé...</div></div>
                </div>}
                <div className="row row-cols-2 row-cols-md-3 justify-content-center">
                    {this.state.events.map(event => <EventCard key={event.id} event={event}/>)}
                </div>
                <EventForm show={this.state.showEventForm} onHide={() => this.showEventForm(false)}
                           onSuccess={(event: PetEvent) => this.setState({events: [event].concat(this.state.events)})}/>
            </div>

        )
    }
}
