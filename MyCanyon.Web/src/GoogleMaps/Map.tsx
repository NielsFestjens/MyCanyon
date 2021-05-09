import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import React, { useState } from 'react';

interface MapProps {
    width?: number;
    height?: number;
    startLocation?: google.maps.LatLngLiteral;
    children?: React.ReactNode;
}
const Map: React.FC<MapProps> = (props) => {
    const { isLoaded } = useJsApiLoader({ googleMapsApiKey: 'AIzaSyBZXYbd3HQsXC_TJYN5HnyxBKsJQbp2m_U' });

    const [initialCenter] = useState(props.startLocation);
    const width = props.width || 400;
    const height = props.height || 400;

    if (!isLoaded)
        return <></>;

    return (
        <div>
            <GoogleMap mapContainerStyle={{ width: width + 'px', height: height + 'px' }} center={props.startLocation} zoom={10}>
            {
                props.children
            }
            </GoogleMap>
        </div>
    );
};

export default Map;