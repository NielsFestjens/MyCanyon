import React from 'react';
import { Link, Route, useHistory, useRouteMatch  } from "react-router-dom";

import { Trip as TripData, TripCanyon } from "app/account/AppData";
import NewCanyon from './NewCanyon';
import Canyon from './Canyon';

interface CanyonsProps {
    trip: TripData;
    update: (trip: TripData) => void;
}

const Canyons: React.FC<CanyonsProps> = ({ trip, update }) => {
    const history = useHistory();
    
    const pageMatch = useRouteMatch(`/trips/${trip.name}`);

    const updateCanyons = (canyons: TripCanyon[]) => {
        update({ ...trip, canyons: canyons.sort((x, y) => x.date.localeCompare(y.date) || x.name.localeCompare(y.name)) });
    }

    const createCanyon = (name: string) => {
        updateCanyons([...trip.canyons, new TripCanyon(name)]);
        history.push(`/trips/${trip.name}/canyons/${name}`);
    }

    const cancelCreateCanyon = () => {
        history.push(`/trips/${trip.name}`);
    }

    const updateCanyon = (canyon: TripCanyon) => {
        updateCanyons(trip.canyons.map(x => x.name === canyon.name ? canyon : x));
    }

    const removeCanyon = (canyon: TripCanyon) => {
        updateCanyons(trip.canyons.filter(x => x.name !== canyon.name));
        history.push(`/trips/${trip.name}`);
    }

    return (
        <>
            {pageMatch?.isExact &&
                <>
                    <span className="title-2">Canyons</span>
                    <ul>
                        {trip.canyons.map(canyon => (
                            <li key={canyon.name}><Link to={`/trips/${trip.name}/canyons/${canyon.name}`}>{canyon.name} ({canyon.date})</Link></li>
                        ))}
                    </ul>
                    {trip.canyons.length === 0 && <div>You haven't yet registered any canyon on this trip.</div>}
                    <Link to={`/trips/${trip.name}/canyons-new`}>+ Add a new canyon</Link>
                </>
            }

            <Route path={`/trips/${trip.name}/canyons-new`} render={props => (<NewCanyon {...props} create={createCanyon} cancel={cancelCreateCanyon} />)} />
            <Route path={`/trips/${trip.name}/canyons/:tripCanyonId`} render={props => (<Canyon {...props} canyons={trip.canyons} update={updateCanyon} remove={removeCanyon} />)} />
        </>
    );
}

export default Canyons;