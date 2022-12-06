export interface stopDB{
    code: number,
    name: string,
    description: string,
    // city: string,
    coordinates: coordinates
}

interface coordinates {
    lat: number,
    lon: number
}