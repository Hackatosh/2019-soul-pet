import React from 'react';
import {RouteComponentProps} from 'react-router';
import {PetEvent} from '../models';
import {Button} from "react-bootstrap";
import {history} from '../helpers';
import { EventForm, EventCard } from '../components';
import { EventService } from '../services';
import { Formik } from 'formik';

interface EventsSearchPageState {
    showEventForm: boolean;
    notice: string;
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
        this.state = {showEventForm: false, error: '', notice: '', events: []};
    }

    componentDidMount() {
        EventService.getAll().then((events: PetEvent[]) => {
            if (events.length === 0)
                this.setState({ notice: 'Aucun événement trouvé…'});
            else
                this.setState({ notice: '', events: events });
        }).catch(() => this.setState({ error: 'Erreur lors de la récupération des évènements' }));
    }

    private showEventForm(state: boolean) {
        this.setState({showEventForm: state});
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-3">
                    <Formik onSubmit={values => {
                            EventService.search(values.keywords !== '' ? values.keywords : undefined,
                                                values.beginDate !== '' ? new Date(values.beginDate) : undefined,
                                                values.endDate !== '' ? new Date(values.endDate) : undefined).then(events => {
                                if (events.length === 0)
                                    this.setState({ notice: 'Aucun événement ne correspond à votre recherche', events: [] });
                                else
                                    this.setState({ notice: '', events: events });
                            }).catch(e => this.setState({ error: e }));
                        }}
                        initialValues={{keywords: '', beginDate: '', endDate: ''}}>
                        {props => {
                            return (
                                <form onSubmit={props.handleSubmit}>
                                    <h3 className="mb-2">Filtres</h3>
                                    <div className="input-group mb-1">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Mots-clefs</span>
                                        </div>
                                        <input type="text" className="form-control" placeholder="…" name="keywords" onChange={props.handleChange} value={props.values.keywords} />
                                    </div>
                                    <div className="input-group mb-1">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Début</span>
                                        </div>
                                        <input type="date" className="form-control" name="beginDate" onChange={props.handleChange} value={props.values.beginDate} />
                                    </div>
                                    <div className="input-group mb-1">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Fin</span>
                                        </div>
                                        <input type="date" className="form-control" name="endDate" onChange={props.handleChange} value={props.values.endDate} />
                                    </div>
                                    <button type="submit" className="btn btn-info btn-block">Rechercher</button>
                                </form>
                            );
                        }}
                    </Formik>
                    </div>
                    <div className="col-9">
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
                        {this.state.notice !== '' &&
                        <div className="row mb-5">
                            <div className="col-sm-6 offset-sm-3"><div className="alert alert-primary">{this.state.notice}</div></div>
                        </div>}
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 justify-content-center">
                            {this.state.events.map(event => <div className="col mb-4" key={event.id}><EventCard event={event}/></div>)}
                        </div>
                    </div>
                </div>
                <EventForm show={this.state.showEventForm} onHide={() => this.showEventForm(false)}
                           onSuccess={(event: PetEvent) => history.push(`/events/${event.id}`)}/>
            </div>

        )
    }
}
