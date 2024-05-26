import type { stopDB } from "./stopDB";

//Represents a vehicle: either a bus or a tram. As provided by the GTT site
export interface vehicleWeb {
    id: number,
    tipo: string,
    disabili: boolean,
    lat: number,
    lon: number,
    direzione: number,
    aggiornamento: string,
    occupazione: number
};

//Represents a vehicle: either a bus or a tram. Prettified for use in app
export interface vehicle {
    id: number,
    vehicleType?: string,
    lat: number,
    lon: number,
    updated: Date,
    direction: number,
    // full: number
    // closest: string
};

export interface vehicleSearched extends vehicle {
    trip_id: string //GTFS trip the vehicle is in service on
    db: dbData  //Data fetched from the trips and stops database collections
}

interface dbData {
    destination: string,
    shape: number[][],
    stops: stopDB[],
    route: { code: { internal: string, displayed: string }, name: string }
}

export interface vehicleMap {
    route: string,
    routeID: string,
    vehicles: vehicle[],
    colour: string,
}
