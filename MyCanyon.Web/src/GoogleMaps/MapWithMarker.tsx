/// <reference types="googlemaps" />
import React, { useState } from 'react'
import { Marker } from '@react-google-maps/api';

import Map from './Map';

interface MapWithMarkerProps {
    canMoveMarker?: boolean;
    markerLocation: google.maps.LatLngLiteral;
    updateMarkedLocation: (location: google.maps.LatLngLiteral) => void;
}
const MapWithMarker: React.FC<MapWithMarkerProps> = ({ canMoveMarker, markerLocation, updateMarkedLocation }) => {

    const [markerPosition, setMarkerPosition] = useState(markerLocation);

    return (
        <div>
            <Map>
                <Marker position={markerPosition} options={{draggable:canMoveMarker}} onDragEnd={e => setMarkerPosition(e.latLng.toJSON())} />
            </Map>
            Lat: {markerPosition.lat} Lng: {markerPosition.lng}<br />
            <button onClick={() => updateMarkedLocation(markerPosition)}>Bevestigen</button>
        </div>
    );
};

export default MapWithMarker;