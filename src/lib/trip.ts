export interface trip {
    trip_id: string,
    route: string,
    destination: string,
    type?: number,
    provider?: string,
    dates?: days,
    stops: trip_stop[],
    type_it?: string,
    shape: shape[]
}

interface days {
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
    sunday: boolean,
}

export interface trip_stop {
    id: number,
    arrival: string,
    sequence: number,
}

export interface shape {
    lat: number,
    lon: number,
}