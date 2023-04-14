export interface strike {
    mode: string,
    dateEnd: Date,
    sector: string,
    scope: string,
    province: string,
    unions: string,
    category: string,
    dateSubmission: Date,
}


export interface strikesFeed {
    items: strikeFeed[],
    image: feedImage,
    title: string,
    description: string,
    pubDate: string,    //Date in the format: 'Wed, 12 Apr 2023 19:57:33 +0000'
    generator: string,
    link: string,
}

export interface strikeInfoFeed {
    modalità: string,
    "Data fine": string,
    Settore: string,
    Rilevanza: string,
    Regione: string,
    Provincia: string,
    Sindacati: string,
    "Categoria interessata": string,
    "Data proclamazione": string,
    "Data ricezione": string,
}

interface strikeFeed {
    title: string,
    link: string,
    pubDate: string,
    content: string,
    contentSnippet: string,
    guid: string,
    isoDate: string //pubDate in ISO format, easier for parsing but not too useful
}

interface feedImage {
    link: string,
    url: string,
    title: string
}