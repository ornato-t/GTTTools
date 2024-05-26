//Represents a vehicle stopping by a stop. Prettified for use in app
export interface stop {
    route: {
        internal: string;
        displayed: string;
    }
    direction: string;
    pass: {
        time: Date;
        realTime: boolean;
        full: boolean;
        wheelchair: boolean;
    }[];
}
