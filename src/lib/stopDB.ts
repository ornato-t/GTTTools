export interface stopDB{
    code?: number,
    name: string,
    description?: string,
    city: string,
    coordinates: number[],
    train?: boolean,
    trainCode?: number,
    metro?: boolean,
}

// interface coordinates {
//     lat: number,
//     lon: number
// }