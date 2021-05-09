import React from 'react';
import { Route, Link, useHistory, Switch } from "react-router-dom";

import { AppData, Trip as TripData } from "app/account/AppData";

import NewTrip from "./NewTrip";
import Trip from "./Trip";

interface TripsProps {
    data: AppData,
    updateData: (data: AppData) => void
};
const Trips: React.FC<TripsProps> = ({ data, updateData }) => {
    const history = useHistory();
    const trips = data.trips;

    const updateTrips = (trips: TripData[]) => {
        updateData({ ...data, trips: trips });
    }

    const createTrip = (name: string) => {
        updateTrips([...trips, new TripData(name)]);
        history.push(`/trips/${name}`);
    };

    const cancelCreateTrip = () => {
        history.push('/trips');
    }

    const updateTrip = (trip: TripData) => {
        updateTrips(trips.map(x => x.name === trip.name ? trip : x));
    }

    const removeTrip = (trip: TripData) => {
        updateTrips(trips.filter(x => x.name !== trip.name));
        history.push('/trips');
    }

    return (
        <div>
            <Route exact path="/trips" render={() => (
                <>
                    <span className="title">Trips</span>
                    <ul>
                        {trips.map(trip => (
                            <li key={trip.name}><Link to={`/trips/${trip.name}`}>{trip.name}</Link></li>
                        ))}
                    </ul>
                    {trips.length === 0 && <div>You do not have any active trips.</div>}
                    <Link to="/trips/new">+ Plan a new trip</Link>
                </>
            )} />

            <Switch>
                <Route path="/trips/new" render={props => (<NewTrip {...props} create={createTrip} cancel={cancelCreateTrip} />)} />
                <Route path="/trips/:tripId" render={props => (<Trip {...props} trips={trips} update={updateTrip} remove={removeTrip} />)} />
            </Switch>
        </div>
    );
}

export default Trips;