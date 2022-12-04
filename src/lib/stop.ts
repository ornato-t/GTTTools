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
    line: string,
    lineID: string,
    direction: string,
    realTime: Date[],
    programmed: Date[]
}
