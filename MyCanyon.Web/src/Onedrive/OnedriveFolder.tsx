import { AccountInfo } from "@azure/msal-common";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { DriveItem } from "@microsoft/microsoft-graph-types";
import { useState } from "react";

import { callMsGraph } from "./Onedrive"

import "./OnedriveBrowser.css";

class DriveItemData {
    constructor(driveItem: DriveItem) {
        this.id = driveItem.id;
        this.name = driveItem.name || undefined;
        this.isFolder = !!driveItem.folder;
        this.isFile = !!driveItem.file;
        const thumbnailSet = driveItem.thumbnails && driveItem.thumbnails[0];
        this.link = (driveItem as any)["@microsoft.graph.downloadUrl"];
        this.thumbnailLink = thumbnailSet?.medium?.url || undefined;
        this.path = `${driveItem.parentReference?.path}/${driveItem.name}`;
    }

    id?: string;
    name?: string;
    path?: string;
    isFolder: boolean;
    isFile: boolean;

    link?: string;
    thumbnailLink?: string;
}

interface OnedriveBrowserProps {
    folder: string;
}
const OnedriveBrowser : React.FC<OnedriveBrowserProps> = ({ folder }) =>  {
    const isAuthenticated = useIsAuthenticated();
    const { instance, accounts } = useMsal();
    const [isLoading, setIsLoading] = useState(false);
    const [pictures, setPictures] = useState<DriveItemData[] | undefined>(undefined);
    const [showPopup, setShowPopup] = useState(false);
    const [popupItem, setPopupItem] = useState<DriveItemData | undefined>(undefined);
    
    if (!isAuthenticated) {
        return (<div>Log in to view onedrive</div>)
    }

    const fetchDriveContent = async () => {
        setIsLoading(true);
        
        const items = await callMsGraph<DriveItem[]>(instance, accounts[0] as AccountInfo, `${folder}:/children?$expand=thumbnails`);
        if (!items)
            return;
        
        setIsLoading(false);
        setPictures(items.map(x => new DriveItemData(x)));
    }

    const showImage = (item: DriveItemData) => {
        setShowPopup(true);
        setPopupItem(item);
    }

    if (!pictures && !isLoading && folder)
        fetchDriveContent();

    return (
        <>
            {isLoading && <p>OneDrive inladen...</p>}
            {pictures &&
                <>
                <main className="main">
                    <div className="cards">
                        {pictures?.filter(item => item.isFile).map(item => (
                            <div key={item.id}>
                                <p>{<img src={item.thumbnailLink} width={150} alt={item.name} onClick={() => showImage(item) } className="clickable" />}</p>
                                <p>{item.name}</p>
                            </div>
                        ))} 
                    </div>
                </main>
                    {showPopup &&
                        <div className="popup-container" onClick={() => setShowPopup(false)}>
                            <button className="close">X</button>
                            {popupItem &&
                                <img src={popupItem.link} alt={popupItem.name} style={{maxWidth:"95%", maxHeight:"95%"}} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} />
                            }
                        </div>
                    }
                </>
            }
        </>
    );
}

export default OnedriveBrowser;