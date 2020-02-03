import React from 'react';
import {RouteComponentProps} from 'react-router';
import {PetEvent} from '../models';
import {Button} from "react-bootstrap";
import {history} from '../helpers';
import { EventForm, EventCard } from '../components';
import { EventService } from '../services';

interface EventsSearchPageState {
    showEventForm: boolean;
    error: string;
    events: PetEvent[];
}

/***
 * Component which displays the list of the current events.
 * It also allows to show a form to add an event.
 ***/

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
        return (
            <div className="container">
                {this.state.error !== '' &&
                <div className="row mb-5">
                    <div className="col-sm-6 offset-sm-3"><div className="alert alert-danger">{this.state.error}</div></div>
                </div>}
                <div className="row row-cols-1 row-cols-md-3 justify-content-center">
                    <div className="col mb-4">
                        <p className="text-center"><Button variant="success" onClick={() => this.showEventForm(true)}>Créer
                            un événement</Button></p>
                    </div>
                </div>
                {this.state.events.length === 0 &&
                <div className="row mb-5">
                    <div className="col-sm-6 offset-sm-3"><div className="alert alert-primary">Aucun événement trouvé…</div></div>
                </div>}
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 justify-content-center">
                    {this.state.events.map(event => <div className="col mb-4" key={event.id}><EventCard event={event}/></div>)}
                </div>
                <EventForm show={this.state.showEventForm} onHide={() => this.showEventForm(false)}
                           onSuccess={(event: PetEvent) => history.push(`/events/${event.id}`)}/>
            </div>

        )
    }
}
