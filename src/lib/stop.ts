//Represents a vehicle stopping by a stop. As provided by the GTT site
export interface stopWeb {
    Linea: string,
    LineaAlias: string,
    PassaggiRT: string[],
    Passaggi: string,
    Direzione: string,
    DirezioneBreve: string,
    Bacino: string,
    Regol: string,
    Avviso: boolean,
    PassaggiPR: string[]
};

//Represents a vehicle stopping by a stop. Prettified for use in app
export interface stop {
    route: string,
    routeID: string,
    direction: string,
    pass: passage[],
}

export interface passage {
    time: Date,
    realTime: boolean,
}