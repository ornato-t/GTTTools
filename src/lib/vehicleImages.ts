const vehicles = [
    {
        idL: 1,
        idH: 23,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/01E-23E/16E-01-800.jpg",
        credits: "Matteo Spina via http://www.tplitalia.it",
        modifier: "_E"
    }, {
        idL: 30,
        idH: 49,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/30E-49E/41E-02-800.jpg",
        credits: "Alessandro Laronga via http://www.tplitalia.it",
        modifier: "_E"
    }, {
        idL: 50,
        idH: 56,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/50E-57E/53E-02-800.jpg",
        credits: "Fabrizio Moscatelli via http://www.tplitalia.it",
        modifier: "_E"
    }, {
        idL: 85,
        idH: 89,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/85-89/87-01-800.jpg",
        credits: "Chandu Belletti via http://www.tplitalia.it"
    }, {
        idL: 2300,
        idH: 2334,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/2300-2334/2311-01-800.jpg",
        credits: "Christian Bizzi via http://www.tplitalia.it"
    }, {
        idL: 2335,
        idH: 2349,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/2335-2349/2341-01-800.jpg",
        credits: "Fabrizio Moscatelli via http://www.tplitalia.it"
    }, {
        idL: 2400,
        idH: 2447,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/2400-2439/2403-02-800.jpg",
        credits: "Lorenzo Libertazzi via http://www.tplitalia.it"
    }, {
        idL: 2700,
        idH: 2787,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/2700-2787/2732-01-800.jpg",
        credits: "Alberto Viscardi via http://www.tplitalia.it"
    }, {
        idL: 3000,
        idH: 3099,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/3000-3099/3023-01-800.jpg",
        credits: "Nomen via http://www.tplitalia.it"
    }, {
        idL: 3300,
        idH: 3380,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/3300-3380/3363-02-800.jpg",
        credits: "Fabrizio Moscatelli via http://www.tplitalia.it"
    }, {
        idL: 3400,
        idH: 3440,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/3400-3439/3401-01-800.jpg",
        credits: "Fabio Colbatello via http://www.tplitalia.it"
    }, {
        idL: 9000,
        idH: 9099,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/9000-9099/9007-01-800.jpg",
        credits: "Lorenzo Libertazzi via http://www.tplitalia.it"
    }, {
        idL: 1150,
        idH: 1168,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/1150-1168/1163-03-800.jpg",
        credits: "Andrea Antonello via http://www.tplitalia.it"
    }, {
        idL: 790,
        idH: 797,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/790-797/796-01-800.jpg",
        credits: "Fabrizio Moscatelli via http://www.tplitalia.it"
    }, {
        idL: 800,
        idH: 874,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/800-874/814-02-800.jpg",
        credits: "Fabrizio Moscatelli via http://www.tplitalia.it"
    }, {
        idL: 930,
        idH: 989,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/930-989/966-03-800.jpg",
        credits: "Alberto Schilirò via http://www.tplitalia.it"
    }, {
        idL: 990,
        idH: 1014,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/990-1014/1001-01-800.jpg",
        credits: "Alessio Pedretti via http://www.tplitalia.it"
    }, {
        idL: 1020,
        idH: 1089,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/1020-1089/1044-01-800.jpg",
        credits: "Alberto Viscardi via http://www.tplitalia.it"
    }, {
        idL: 1280,
        idH: 1306,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/1280-1306/1303-01-800.jpg",
        credits: "Alessio Pedretti via http://www.tplitalia.it"
    }, {
        idL: 1350,
        idH: 1396,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/1350-1383/1362-02-800.jpg",
        credits: "Lorenzo Libertazzi via http://www.tplitalia.it"
    }, {
        idL: 2801,
        idH: 2902,
        url: "http://www.tplitalia.it/GTT/TramUrbani/2858-2902/2896-01-800.jpg",
        info: "https://www.tramditorino.it/tram_serie_2800.htm",
        credits: "Alberto Viscardi via http://www.tplitalia.it"
    }, {
        idL: 5000,
        idH: 5053,
        url: "http://www.tplitalia.it/GTT/TramUrbani/5000-5053/5039-01-800.jpg",
        info: "https://www.tramditorino.it/tram_serie_5000.htm",
        credits: "Christian Bizzi via http://www.tplitalia.it"
    }, {
        idL: 6000,
        idH: 6005,
        url: "http://www.tplitalia.it/GTT/TramUrbani/6000-6005/6003-02-800.jpg",
        info: "https://www.tramditorino.it/tram_serie_6000.htm",
        credits: "Nomen via http://www.tplitalia.it"
    }, {
        idL: 6006,
        idH: 6054,
        url: "http://www.tplitalia.it/GTT/TramUrbani/6006-6054/6006-01-800.jpg",
        info: "https://www.tramditorino.it/tram_serie_6000.htm",
        credits: "Christian Bizzi via http://www.tplitalia.it"
    }, {
        idL: 8000,
        idH: 8100,
        url: "https://www.tramditorino.it/img/tram8000.jpg",
        info: "https://www.tramditorino.it/tram_serie_8000.htm",
        credits: "Tram di Torino via https://www.tramditorino.it"
    },
]satisfies vehicle[];

const vehiclesSup = [   //Vehicles on the Superga-Sassi special route, these IDs start with the letter D, eg. D1
    {
        idL: 1,
        idH: 1,
        url: "https://www.tramditorino.it/gallery/tram/D1-sassi2.jpg",
        info: "https://www.tramditorino.it/superga_D1.htm",
        credits: "Tram di Torino via https://www.tramditorino.it",
        modifier: "D_"
    }, {
        idL: 2,
        idH: 3,
        url: "https://www.tramditorino.it/gallery/tram/D2-binario2.jpg",
        info: "https://www.tramditorino.it/superga_D2-D3.htm",
        credits: "Tram di Torino via https://www.tramditorino.it",
        modifier: "D_"
    }, {
        idL: 11,
        idH: 12,
        url: "https://www.tramditorino.it/gallery/tram/D12sassi.jpg",
        info: "https://www.tramditorino.it/superga_D11-D14.htm",
        credits: "Tram di Torino via https://www.tramditorino.it",
        modifier: "D_"
    }, {
        idL: 13,
        idH: 14,
        url: "https://www.tramditorino.it/gallery/tram/D14.jpg",
        info: "https://www.tramditorino.it/superga_D11-D14.htm",
        credits: "Tram di Torino via https://www.tramditorino.it",
        modifier: "D_"
    }
]satisfies vehicle[];

const vehicleMetro = {  //The (at the moment unique) metro line
    idL: NaN,
    idH: NaN,
    url: "https://www.alstom.com/sites/alstom.com/files/styles/large_media_cover/public/2022/02/04/Torino_Metropolis.png?h=c291ccd9&itok=D9O1H_Bs",
    info: "https://www.tramditorino.it/metro_stazioni.htm",
    credits: "Alstom",
} satisfies vehicle;

//Return the matching image from a vehicle ID
export function getVehicle(id: string): vehicleType | null {
    const supRegex = /D([0-9]{1,2})/i;    //Match any vehicle in service on the Superga-Sassi special route

    if (id.toLowerCase() === 'metro') {
        return {
            code: 1,
            url: vehicleMetro.url,
            info: vehicleMetro.info,
            credits: vehicleMetro.credits ?? '',
        }
    }
    else if (supRegex.test(id)) {  //Superga-Sassi
        const match = id.match(supRegex) ?? [];
        const num = Number.parseInt(match[1]);

        for (const vc of vehiclesSup) {
            if (num >= vc.idL && num <= vc.idH) {
                return {
                    code: num,
                    url: vc.url,
                    info: vc.info,
                    credits: vc.credits ?? '',
                    modifier: vc.modifier
                } satisfies vehicleType;
            }
        }
    } else {    //Regular route
        const num = Number.parseInt(id);
        for (const vc of vehicles) {
            if (num >= vc.idL && num <= vc.idH) {
                if (vc.info !== undefined) {
                    return {
                        code: num,
                        url: vc.url,
                        info: vc.info,
                        credits: vc.credits ?? '',
                        modifier: vc.modifier
                    } satisfies vehicleType;
                } else {
                    return {
                        code: num,
                        url: vc.url,
                        credits: vc.credits ?? '',
                        modifier: vc.modifier
                    } satisfies vehicleType;
                }
            }
        }
    }

    return null;
}

interface vehicle {
    idL: number,
    idH: number,
    modifier?: string,
    url: string,
    info?: string,   //Infos are only available for trams, thanks to www.tramditorino.it
    credits?: string
}

interface vehicleType {
    code: number,       //Code of the matched vehicle (int) - not necessarily what was searched
    modifier?: string,  //Additional characters composing the vehicle ID
    url: string,        //URL to image
    info?: string       //URL to info - only available for trams
    credits: string     //Credits to the photographer
}
