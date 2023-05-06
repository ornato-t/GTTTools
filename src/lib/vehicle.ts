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
    route: string,  //Route on which the vehicle is in service
    trip_id: string //GTFS trip the vehicle is in service on
}

export interface vehicleMap {
    route: string,
    routeID: string,
    vehicles: vehicle[],
    colour: string,
}

export function encodeRoute(code: string) {
    if(code.includes('/')){
        const num = Number.parseInt(code);

        return `${num}%2F`;
    }
    return code;
}