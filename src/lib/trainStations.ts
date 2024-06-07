const stations = [
    {
        name: 'Porta Nuova',
        code_vt: 'S00219',
        code_fr: 830000219,
        id: 0,
    }, {
    //     name: 'Dora',
    //     code_vt: 'S00224',
    //     code_fr: 0,
    //     id: 7,
    // }, {
    //     name: 'Dora GTT',
    //     code_vt: '',
    //     code_fr: 830082332,
    //     id: 8
    // }, {
    //     name: 'Madonna di Campagna',
    //     code_vt: '',
    //     code_fr: 830000083,
    //     id: 9
    // }, {
        name: 'Lingotto',
        code_vt: 'S00452',
        code_fr: 830000452,
        id: 2,
    }, {
        name: 'Porta Susa',
        code_vt: 'S00035',
        code_fr: 830000222,
        id: 1,
    }, {
        name: 'Rebaudengo Fossata',
        code_vt: 'S00060',
        code_fr: 830000060,
        id: 3,
    }, {
        name: 'San Paolo',
        code_vt: 'S00223',
        code_fr: 0,
        id: 6,
    }, {
        name: 'Stura',
        code_vt: 'S00228',
        code_fr: 830000228,
        id: 4,
    }, {
        name: 'Grosseto',
        code_vt: '',
        code_fr: 830000097,
        id: 5,
    },
] satisfies station[];

interface station {
    name: string,
    code_vt: string,    //ID for the "viaggiatreno" API
    code_fr: number,    //ID for the "lefrecce" API
    id: number,         //Internal use only
}

export function getByName(str: string) {
    return stations.find(el => {
        if (el.name.toLowerCase() === str.toLowerCase()) return el;
    }) || null;
}

export function getByCode(id: number) {
    return stations.find(el => {
        if (el.id === id) return el;
    }) || null;
}