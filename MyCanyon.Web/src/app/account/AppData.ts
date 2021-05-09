export class Trip {
    constructor(name: string) {
        this.name = name;
        this.location =  { lat: 42.50, lng: 0.12 };
    }

    name: string;
    location: google.maps.LatLngLiteral;
    start: string = '';
    end: string = '';
    canyons: TripCanyon[] = [];
    picturePath: string = '';
}

export class TripCanyon {
    constructor(name: string) {
        this.name = name;
    }

    name: string;
    canyonId: string = '';
    date: string = '';
    picturePath: string = '';
}

export interface AppData {
    trips: Trip[];
}

const AppDataKey = "MyCanyonData";
export const loadData = () => {
    const data = JSON.parse(window.localStorage.getItem(AppDataKey) || "{}") as AppData;
    if (!data.trips)
        data.trips = [];
    
    for (let trip of data.trips.filter(x => !x.canyons)) {
        trip.canyons = []
    }
    
    return data;
}

export const saveData = (data: AppData) => window.localStorage.setItem(AppDataKey, JSON.stringify(data));