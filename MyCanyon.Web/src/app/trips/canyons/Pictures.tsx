import React, { useState } from 'react';
import OnedriveBrowser from 'Onedrive/OnedriveBrowser';
import OnedriveFolder from 'Onedrive/OnedriveFolder';
import OnedriveLogin from 'Onedrive/OnedriveLogin';
import { TripCanyon } from 'app/account/AppData';

interface PicturesProps {
    canyon: TripCanyon;
    update: (canyon: TripCanyon) => void;
}

const Pictures: React.FC<PicturesProps> = ({ canyon, update }) => {
    const [isChangingPath, setIsChangingPath] = useState(false);
    const [editPath, setEditPath] = useState(canyon.picturePath);

    const updatePath = () => {
        update({...canyon, picturePath: editPath});
        setIsChangingPath(false);
    }

    const cancelEditPath = () => {
        setEditPath(canyon.picturePath);
        setIsChangingPath(false);
    }

    return (
        <>
            <span className="title-2">Pictures</span>
            Path: { canyon.picturePath }
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
                <OnedriveFolder folder={canyon.picturePath} />}
        </>
    );
}

export default Pictures;