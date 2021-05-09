import React, { useState } from 'react';
import OnedriveBrowser from 'Onedrive/OnedriveBrowser';
import OnedriveFolder from 'Onedrive/OnedriveFolder';
import OnedriveLogin from 'Onedrive/OnedriveLogin';
import { Trip } from 'app/account/AppData';

interface PicturesProps {
    trip: Trip;
    update: (trip: Trip) => void;
}

const Pictures: React.FC<PicturesProps> = ({ trip, update }) => {
    const [isChangingPath, setIsChangingPath] = useState(false);
    const [editPath, setEditPath] = useState(trip.picturePath);

    const updatePath = () => {
        update({...trip, picturePath: editPath});
        setIsChangingPath(false);
    }

    const cancelEditPath = () => {
        setEditPath(trip.picturePath);
        setIsChangingPath(false);
    }

    return (
        <>
            <span className="title-2">Pictures</span>
            Path: { trip.picturePath }
            {!isChangingPath && <button onClick={() => setIsChangingPath(true)}>Update</button>}<br />

            {isChangingPath && (
                <>
                    New path: {editPath}
                    <button onClick={() => updatePath()}>Confirm</button>
                    <button onClick={() => cancelEditPath()}>Cancel</button>
                    <OnedriveLogin />
                    <OnedriveBrowser updateSelectedFolder={setEditPath} />
                </>
            )}

            {!isChangingPath &&
                <OnedriveFolder folder={trip.picturePath} />}
        </>
    );
}

export default Pictures;