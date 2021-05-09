import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import { TripCanyon } from 'app/account/AppData';
import EditableLabel from 'common/EditableLabel';
import Autocomplete from 'common/Autocomplete';
import Pictures from './Pictures';
import Map from 'GoogleMaps/Map';
import { Marker } from '@react-google-maps/api';

import './Canyon.css';

import canyonsLight from "DesecenteCanyon/canyons-light.json";

interface CanyonInfo {
    Id: string;
    Name: string;
    Coord: number[];
    Points: CanyonPointInfo[];
    Score?: number | null;
    Alti: string;
    Diff: string;
    Length: string;
    Max: string;
    Quotation: string;
    Rope: string;
    Navette: string;
}

interface CanyonPointInfo {
    Type: string;
    Coord: string[];
}

const canyonInfos: CanyonInfo[] = canyonsLight;

interface CanyonChooserProps {
    updateChosenCanyon: (canyon: CanyonInfo) => void;
}

const CanyonChooser: React.FC<CanyonChooserProps> = ({ updateChosenCanyon }) => {
    return (
        <Autocomplete suggestions={canyonInfos} mapName={x => x.Name} mapKey={x => x.Id} updateChosenValue={x => updateChosenCanyon(x)} />
    );
}

interface CanyonProps {
    canyons: TripCanyon[];
    update: (trip: TripCanyon) => void
    remove: (trip: TripCanyon) => void
}
interface CanyonParams {
    tripCanyonId: string
}

const Canyon: React.FC<CanyonProps> = ({ canyons, update, remove }) => {
    let { tripCanyonId } = useParams<CanyonParams>();
    
    const findCanyon = (id: string) => {
        return canyonInfos.filter(x => x.Id === id)[0];
    }

    const canyon = canyons.filter(x => x.name === tripCanyonId)[0];
    const [canyonInfo, setCanyonInfo] = useState(findCanyon(canyon.canyonId));

    const updateCanyonId = (chosenCanyon: CanyonInfo) => {
        update({...canyon, canyonId: chosenCanyon.Id});
        setCanyonInfo(findCanyon(canyon.canyonId));
    }

    return (
        <>
            <div className="trip-canyon-wrapper">
                <div className="trip-canyon-details">
                    <span className="title">
                        {canyon.name}&nbsp;<FontAwesomeIcon icon={faTrash} size="xs" onClick={e => remove(canyon)} className="clickable" />
                    </span>
                    
                    <EditableLabel label="Start" value={canyon.date} updateValue={value => update({...canyon, date: value})} />

                    <CanyonChooser updateChosenCanyon={updateCanyonId} /><br />
                    
                    { canyonInfo && <>{canyonInfo.Name}: {canyonInfo.Quotation}, {canyonInfo.Rope}, {canyonInfo.Score}</> }
                </div>
                <div className="trip=canyon-map">
                    { canyonInfo && 
                        <Map startLocation={{lat: canyonInfo.Coord[0], lng: canyonInfo.Coord[1]}}>
                            <Marker position={{lat: canyonInfo.Coord[0], lng: canyonInfo.Coord[1]}} />
                        </Map>
                    }
                </div>
            </div>
            
            <Pictures canyon={canyon} update={update} />
        </>
    );
};

export default Canyon;