import React, { useState } from 'react';
import { useParams, Link, useRouteMatch  } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { Marker } from '@react-google-maps/api';

import { Trip as TripData } from "app/account/AppData";
import EditableLabel from 'common/EditableLabel';
import Map from 'GoogleMaps/Map';
import Canyons from './canyons/Canyons';
import Pictures from './Pictures';

import "./Trip.css";

interface TripProps {
    trips: TripData[];
    update: (trip: TripData) => void;
    remove: (trip: TripData) => void;
    match: any;
};
interface TripParams {
    tripId: string;
}
const Trip: React.FC<TripProps> = ({ trips, update, remove }) => {

    let { tripId } = useParams<TripParams>();
    const trip = trips.filter(x => x.name === tripId)[0];
    
    const pageMatch = useRouteMatch(`/trips/${trip.name}`);

    const [isChangingLocation, setIsChangingLocation] = useState(false);
    const [markerPosition, setMarkerPosition] = useState(trip.location);

    const confirmChangeLocation = () => {
        setIsChangingLocation(false);
        const newLocation = { lat: markerPosition.lat, lng: markerPosition.lng };
        update({...trip, location: newLocation})
    }

    const cancelChangeLocation = () => {
        setIsChangingLocation(false);
        setMarkerPosition(trip.location);
    }

    return (
        <>
            {!pageMatch?.isExact && <Link to={`/trips/${trip.name}`}>Back to trip "{trip.name}"</Link>}
            
            <div className="trip-wrapper">
                <div className="trip-details">
                    {pageMatch?.isExact && (
                        <>
                            <span className="title">
                                {trip.name}&nbsp;<FontAwesomeIcon icon={faTrash} size="xs" onClick={() => remove(trip)} className="clickable" />
                            </span>
                            <EditableLabel label="Start" value={trip.start} updateValue={value => update({...trip, start: value})} />
                            <EditableLabel label="End" value={trip.end} updateValue={value => update({...trip, end: value})} />

                            Location: {trip.location.lat.toFixed(4)}, {trip.location.lng.toFixed(4)} {!isChangingLocation && <button onClick={() => setIsChangingLocation(true)}>Change</button>} <br />
                            { isChangingLocation &&
                                <>
                                    New location: {markerPosition.lat.toFixed(4)}, {markerPosition.lng.toFixed(4)}
                                    <button onClick={() => confirmChangeLocation()}>Confirm</button>
                                    <button onClick={() => cancelChangeLocation()}>Cancel</button>
                                </>
                            }
                        </>
                    )}

                    <Canyons trip={trip} update={update} />
                </div>
                
                {pageMatch?.isExact && (
                    <div className="trip-map">
                        <Map startLocation={trip.location}>
                            <Marker position={markerPosition} options={{draggable:isChangingLocation}} onDragEnd={e => setMarkerPosition(e.latLng.toJSON())} />
                        </Map>
                    </div>
                )}
            </div>
            
            {pageMatch?.isExact && (
                <Pictures trip={trip} update={update} />
            )}
        </>
    );
}

export default Trip;