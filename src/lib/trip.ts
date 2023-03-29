export interface trip {
    trip_id: string,
    route: string,
    destination: string,
    type?: number,
    provider?: string,
    dates?: days,
    stops: trip_stop[],
    type_it?: string,
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

interface trip_stop {
    id: string,
    arrival: string,
}