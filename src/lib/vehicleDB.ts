export type vehicleDB = vehicleBase | vehicleTram | vehicleTramCrem | vehicleMetro;

//Base interface for info-less vehicles
interface vehicleBase {
    id: {
        low: number,
        high: number,
    },
    image: {
        url: string,
        credits: string,
        creditsLink: string,
        creditsPlatform: string
    },
    modifier: "E" | null,
    info: null,
    type: number
}

//"Tram", they always have an info attached
interface vehicleTram {
    id: {
        low: number,
        high: number,
    },
    image: {
        url: string,
        credits: string,
        creditsLink: string,
        creditsPlatform: string
    },
    type: 0,
    modifier: null,
    info: string
}

//"Tram a cremagliera", they always have an info attached
interface vehicleTramCrem {
    id: {
        low: number,
        high: number,
    },
    image: {
        url: string,
        credits: string,
        creditsLink: string,
        creditsPlatform: string
    },
    type: 7,
    modifier: "D",
    info: string
}

//"Metro", they always have an info attached
interface vehicleMetro {
    id: {
        low: null,
        high: null,
    },
    image: {
        url: string,
        credits: string,
        creditsLink: string,
        creditsPlatform: string
    },
    type: 1,
    modifier: null,
    info: string
}
