export interface stopDB{
    code?: number,
    name: string,
    description?: string,
    city: string,
    coordinates: coordinates,
    train?: boolean
    metro?: boolean
}

interface coordinates {
    lat: number,
    lon: number
}