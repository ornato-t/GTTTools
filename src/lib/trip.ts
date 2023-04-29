export interface trip {
    trip_id: string,
    route: string,
    destination: string,
    type: number,
    provider: string,
    direction: number,
    dates: days,
    shape: number[][]
    stops: trip_stop[],
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
    code: number,
    sequence: number,
}
