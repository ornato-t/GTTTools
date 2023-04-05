export interface station {
    id: number,
    category: string,
    destination: string,
    platform: platform,
    delay: number,
}

export interface platform {
    id: string,
    confirmed: boolean,
}

export interface trip {
    id: number,
    category: string,
    destination: string,
    origin: string,
    departure: Date,
    name: string,
}

//Represents a train in the "viaggiatreno" API
//Commented fields are null, zero or empty strings
export interface vt_train {
    numeroTreno: number,
    categoria: string,
    categoriaDescrizione: string,
    // origine: null,
    codOrigine: string,
    destinazione: string,
    // codDestinazione: null,
    // origineEstera: null,
    // destinazioneEstera: null,
    // oraPartenzaEstera: null,
    // oraArrivoEstera: null,
    // tratta: number,
    // regione: number,
    // origineZero: null,
    // destinazioneZero: null,
    // orarioPartenzaZero: null,
    // orarioArrivoZero: null,
    circolante: true,
    codiceCliente: number,
    // binarioEffettivoArrivoCodice: null,
    // binarioEffettivoArrivoDescrizione: null,
    // binarioEffettivoArrivoTipo: null,
    // binarioProgrammatoArrivoCodice: null,
    // binarioProgrammatoArrivoDescrizione: null,
    binarioEffettivoPartenzaCodice: string,
    binarioEffettivoPartenzaDescrizione: string,
    binarioEffettivoPartenzaTipo: string,
    // binarioProgrammatoPartenzaCodice: null,
    binarioProgrammatoPartenzaDescrizione: string,
    // subTitle: null,
    // esisteCorsaZero: null,
    // orientamento: null,
    inStazione: true,
    haCambiNumero: false,
    nonPartito: false,
    // provvedimento: number,
    riprogrammazione: string,
    orarioPartenza: number,
    // orarioArrivo: null,
    // stazionePartenza: null,
    // stazioneArrivo: null,
    // statoTreno: null,
    // corrispondenze: null,
    // servizi: null,
    ritardo: number,
    tipoProdotto: string,
    compOrarioPartenzaZeroEffettivo: string,
    // compOrarioArrivoZeroEffettivo: null,
    compOrarioPartenzaZero: string,
    // compOrarioArrivoZero: null,
    // compOrarioArrivo: null,
    compOrarioPartenza: string,
    compNumeroTreno: string,
    // compOrientamento: string[],
    compTipologiaTreno: string,
    // compClassRitardoTxt: string,
    compClassRitardoLine: string,
    // compImgRitardo2: string,
    compImgRitardo: string,
    compRitardo: string[],
    compRitardoAndamento: string[],
    compInStazionePartenza: string[],
    compInStazioneArrivo: string[],
    // compOrarioEffettivoArrivo: null,
    // compDurata: string,
    compImgCambiNumerazione: string,
    // materiale_label: null,
    dataPartenzaTreno: number
}

//Represents a list of solutions in the "lefrecce" API
export interface solutions {
    searchId: string;
    cartId: string;
    // highlightedMessages: any[];
    solutions: SolutionElement[];
    // minimumPrices:       any[];
}

interface SolutionElement {
    solution: solutionItem;
    // grids:                    any[];
    // customizes:               any[];
    // stopList:                 any[];
    messages: Array<Message | null>;
    nextDaySolution: boolean;
    tooltip: Tooltip;
    canShowSeatMap: boolean;
    notAllOfferGroupStandard: boolean;
    silenceArea: boolean;
    fastPurchase: boolean;
}

interface Message {
    imageId: null;
    message: string;
    status: string;
}

interface solutionItem {
    _type: string;
    id: string;
    origin: string;
    destination: string;
    departureTime: Date;
    arrivalTime: Date;
    duration: string;
    status: string;
    trains: Train[];
    price: null;
    // discounts:     any[];
    nodes: Node[];
}

interface Node {
    id: string;
    origin: string;
    destination: string;
    departureTime: Date;
    arrivalTime: Date;
    train: Train;
}

interface Train {
    description: string;
    trainCategory: string;
    acronym: string;
    denomination: string;
    name: string;
    logoId: string;
    urban: boolean;
}

interface Tooltip {
    // nodeServices:          any[];
    loyaltyPoints: number;
    regionalLoyaltyPoints: number;
}
