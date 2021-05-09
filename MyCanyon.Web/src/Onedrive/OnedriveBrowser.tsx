import { AccountInfo } from "@azure/msal-common";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Drive, DriveItem } from "@microsoft/microsoft-graph-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";

import "./OnedriveBrowser.css";

class DriveItemData {
    constructor(driveItem: DriveItem) {
        this.id = driveItem.id;
        this.name = driveItem.name || undefined;
        this.isFolder = !!driveItem.folder;
        this.isFile = !!driveItem.file;
        this.children = driveItem.children ? driveItem.children.map(x => new DriveItemData(x)) : [];
        this.areChildrenLoaded = !!driveItem.children;
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

    children: DriveItemData[];
    areChildrenLoaded: boolean;

    isExpanded: boolean = false;
    isSelected: boolean = false;
    link?: string;
    thumbnailLink?: string;
}

interface DriveItemComponentProps {
    driveItem: DriveItemData;
    expandItem: (item: DriveItemData) => void;
}
const DriveItemComponent : React.FC<DriveItemComponentProps> = ({ driveItem, expandItem }) => {
    if (driveItem.isFolder) {
        return (
            <li>
                <span onClick={() => expandItem(driveItem)} className="clickable" style={{fontWeight: driveItem.isSelected ? 'bold' : 'inherit'}}>
                    <FontAwesomeIcon icon={faFolder} /> {driveItem.name}
                </span>
                {driveItem.children && driveItem.isExpanded &&
                    <ul>
                        {driveItem.children.filter(x => x.isFolder).map(item => (
                            <DriveItemComponent key={item.id} driveItem={item} expandItem={expandItem} />
                        ))}
                    </ul> 
                }
            </li>
        );
    }

    return (
        <li key={driveItem.id}>{driveItem.name}</li>
    );
}

interface OnedriveBrowserProps {
    updateSelectedFolder?: (folder: string) => void;
}
const OnedriveBrowser : React.FC<OnedriveBrowserProps> = ({ updateSelectedFolder }) =>  {
    const isAuthenticated = useIsAuthenticated();
    const { instance, accounts } = useMsal();
    const [isLoading, setIsLoading] = useState(false);
    const [driveId, setDriveId] = useState('');
    const [drive, setDrive] = useState<DriveItemData | undefined>(undefined);
    const [folder, setFolder] = useState<DriveItemData | undefined>(undefined);
    const [showPopup, setShowPopup] = useState(false);
    const [popupItem, setPopupItem] = useState<DriveItemData | undefined>(undefined);
    
    if (!isAuthenticated) {
        return (<div>Log in to view onedrive</div>)
    }
    
    async function callMsGraph<T>(uri: string) {
        const tokenResponse = await instance.acquireTokenSilent({
            scopes: ["User.Read", "Files.Read"],
            account: accounts[0] as AccountInfo
        });

        const headers = new Headers();
        headers.append("Authorization", `Bearer ${tokenResponse.accessToken}`);
    
        const response = await fetch('https://graph.microsoft.com/v1.0/' + uri, { method: "GET", headers: headers });
        return (await response.json()).value as T;
    }

    const getDriveId = async () => {
        if (driveId)
            return driveId;
        
        const drives = await callMsGraph<Drive[]>('drives');
        if (!drives)
            return undefined;
        
        setDriveId(drives[0].id!);
        return drives[0].id;
    }

    const fetchDriveContent = async () => {
        setIsLoading(true);
        const driveId = await getDriveId();
        if (!driveId)
            return;
        
        const items = await callMsGraph<DriveItem[]>(`drives/${driveId}/root/children`);
        if (!items)
            return;
        
        setIsLoading(false);
        const drive = new DriveItemData({
            id: driveId,
            name: 'root',
            children: items,
            folder: {}
        });
        drive.isExpanded = true;
        setDrive(drive);
    }

    const updateChildInTree = (node: DriveItemData, item?: DriveItemData) : DriveItemData => {
        if (!item)
            return node;

        if (node.id === item.id)
            return item;

        return {
            ...node,
            children: node.children?.map(x => updateChildInTree(x, item))
        }
    }

    const getChildren = async (item: DriveItemData) => {
        if (item.areChildrenLoaded)
            return item.children;
        
        const items = await callMsGraph<DriveItem[]>(`drives/${driveId}/items/${item.id}/children?$expand=thumbnails`) || [];
        return (items?.map(x => new DriveItemData(x))) || [];
    }

    const expandItem = async (item: DriveItemData) => {
        if (!drive)
            return;
        
        const updatedFolder = folder && {...folder, isSelected: false };

        const updatedItem: DriveItemData = {
            ...item,
            isExpanded: !item.isExpanded,
            isSelected: true,
            areChildrenLoaded: true,
            children: await getChildren(item)
        };
        const driveWithNewFolder = updateChildInTree(drive, updatedFolder);
        const driveWithUpdatedItem = updateChildInTree(driveWithNewFolder, updatedItem);
        
        setDrive(driveWithUpdatedItem);
        setFolder(updatedItem);
        updateSelectedFolder && updateSelectedFolder(updatedItem.path || '')
    }

    const showImage = (item: DriveItemData) => {
        setShowPopup(true);
        setPopupItem(item);
    }

    if (!drive && !isLoading)
        fetchDriveContent();

    return (
        <>
            {!drive && !isLoading &&
                <p>
                    <button onClick={fetchDriveContent}>Fetch drive content</button>
                </p>
            }
            {isLoading && <p>OneDrive inladen...</p>}
            {drive &&
                <>
                    <div className="sidebar-container">
                        <aside className="sidebar">
                            <div className="folder-structure">
                                <ul>           
                                    <DriveItemComponent key={drive.id} driveItem={drive} expandItem={expandItem} />
                                </ul>
                            </div>
                        </aside>
                        <main className="main">
                            <div className="cards">
                                {folder?.children?.filter(item => item.isFile).map(item => (
                                    <div key={item.id}>
                                        <p>{<img src={item.thumbnailLink} width={150} alt={item.name} onClick={() => showImage(item) } className="clickable" />}</p>
                                        <p>{item.name}</p>
                                    </div>
                                ))} 
                            </div>
                        </main>
                    </div>
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