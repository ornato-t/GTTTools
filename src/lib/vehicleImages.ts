const vehicles = [
    {
        idL: 1,
        idH: 23,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/01E-23E/16E-01-800.jpg",
        credits: "Matteo Spina",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        modifier: "_E",
        type: 'bus'
    }, {
        idL: 30,
        idH: 49,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/30E-49E/41E-02-800.jpg",
        credits: "Alessandro Laronga",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        modifier: "_E",
        type: 'bus'
    }, {
        idL: 50,
        idH: 56,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/50E-57E/53E-02-800.jpg",
        credits: "Fabrizio Moscatelli",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        modifier: "_E",
        type: 'bus'
    }, {
        idL: 85,
        idH: 89,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/85-89/87-01-800.jpg",
        credits: "Chandu Belletti",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        type: 'bus'
    }, {
        idL: 2300,
        idH: 2334,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/2300-2334/2311-01-800.jpg",
        credits: "Christian Bizzi",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        type: 'bus'
    }, {
        idL: 2335,
        idH: 2349,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/2335-2349/2341-01-800.jpg",
        credits: "Fabrizio Moscatelli",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        type: 'bus'
    }, {
        idL: 2400,
        idH: 2447,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/2400-2439/2403-02-800.jpg",
        credits: "Lorenzo Libertazzi",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        type: 'bus'
    }, {
        idL: 2700,
        idH: 2787,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/2700-2787/2732-01-800.jpg",
        credits: "Alberto Viscardi",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        type: 'bus'
    }, {
        idL: 3000,
        idH: 3099,
        url: "/vehicles/3010.webp",
        credits: "torino_tmt",
        link: "https://www.instagram.com/torino_tmt",
        siteName: "Instagram",
        type: 'bus'
    }, {
        idL: 3300,
        idH: 3380,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/3300-3380/3363-02-800.jpg",
        credits: "Fabrizio Moscatelli",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        type: 'bus'
    }, {
        idL: 3400,
        idH: 3440,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/3400-3439/3401-01-800.jpg",
        credits: "Fabio Colbatello",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        type: 'bus'
    }, {
        idL: 9000,
        idH: 9099,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/9000-9099/9007-01-800.jpg",
        credits: "Lorenzo Libertazzi",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        type: 'bus'
    }, {
        idL: 1150,
        idH: 1168,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/1150-1168/1163-03-800.jpg",
        credits: "Andrea Antonello",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        type: 'bus'
    }, {
        idL: 790,
        idH: 797,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/790-797/796-01-800.jpg",
        credits: "Fabrizio Moscatelli",
        link: "http://www.tplitalia.it/GTT/GTT-Autosnodati.php",
        siteName: "tplitalia.it",
        type: 'autosnodato'
    }, {
        idL: 800,
        idH: 874,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/800-874/814-02-800.jpg",
        credits: "Fabrizio Moscatelli",
        link: "http://www.tplitalia.it/GTT/GTT-Autosnodati.php",
        siteName: "tplitalia.it",
        type: 'autosnodato'
    }, {
        idL: 930,
        idH: 989,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/930-989/947-06-800.jpg",
        credits: "Fabrizio Moscatelli",
        link: "http://www.tplitalia.it/GTT/GTT-Autosnodati.php",
        siteName: "tplitalia.it",
        type: 'autosnodato'
    }, {
        idL: 990,
        idH: 1014,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/990-1014/1001-01-800.jpg",
        credits: "Alessio Pedretti",
        link: "http://www.tplitalia.it/GTT/GTT-Autosnodati.php",
        siteName: "tplitalia.it",
        type: 'autosnodato'
    }, {
        idL: 1020,
        idH: 1089,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/1020-1089/1044-01-800.jpg",
        credits: "Alberto Viscardi",
        link: "http://www.tplitalia.it/GTT/GTT-Autosnodati.php",
        siteName: "tplitalia.it",
        type: 'autosnodato'
    }, {
        idL: 1280,
        idH: 1306,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/1280-1306/1303-01-800.jpg",
        credits: "Alessio Pedretti",
        link: "http://www.tplitalia.it/GTT/GTT-Autosnodati.php",
        siteName: "tplitalia.it",
        type: 'autosnodato'
    }, {
        idL: 1310,
        idH: 1313,
        url: "https://www.tplitalia.it/GTT/AutosnodUrbSub/1310-1313/1310-02-800.jpg",
        credits: "Alessandro Flora",
        link: "http://www.tplitalia.it/GTT/GTT-Autosnodati.php",
        siteName: "tplitalia.it",
        type: 'autosnodato'
    }, {
        idL: 1350,
        idH: 1396,
        url: "http://www.tplitalia.it/GTT/AutosnodUrbSub/1350-1383/1362-02-800.jpg",
        credits: "Lorenzo Libertazzi",
        link: "http://www.tplitalia.it/GTT/GTT-Autosnodati.php",
        siteName: "tplitalia.it",
        type: 'autosnodato'
    }, {
        idL: 9000,
        idH: 9119,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/9000-9099/9023-03-800.jpg",
        credits: "Samuele Furia",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        type: 'bus'
    }, {
        idL: 9200,
        idH: 9261,
        url: "http://www.tplitalia.it/GTT/AutobusUrbSub/9200-9261/9206-03-800.jpg",
        credits: "Lorenzo Libertazzi",
        link: "http://www.tplitalia.it/GTT/GTT-Autobus.php",
        siteName: "tplitalia.it",
        type: 'bus'
    }, {
        idL: 9300,
        idH: 9318,
        url: "https://www.tplitalia.it/GTT/AutosnodUrbSub/9300-9318/9304-01-800.jpg",
        credits: "Giacomo Paz Cruz",
        link: "http://www.tplitalia.it/GTT/GTT-Autosnodati.php",
        siteName: "tplitalia.it",
        type: 'autosnodato'
    }, {
        idL: 2800,
        idH: 2800,
        url: "https://www.tramditorino.it/gallery/tram/2800TUMB.jpg",
        info: "https://www.tramditorino.it/prototipo_2800.htm",
        credits: "Tram di Torino",
        link: "https://www.tramditorino.it/prototipo_2800.htm",
        siteName: "tramditorino.it",
        type: 'tram'
    }, {
        idL: 2801,
        idH: 2902,
        url: "/vehicles/2859.webp",
        info: "https://www.tramditorino.it/tram_serie_2800.htm",
        credits: "torino_tmt",
        link: "https://www.instagram.com/torino_tmt",
        siteName: "Instagram",
        type: 'tram'
    }, {
        idL: 5000,
        idH: 5053,
        url: "/vehicles/5010.webp",
        info: "https://www.tramditorino.it/tram_serie_5000.htm",
        credits: "torino_tmt",
        link: "https://www.instagram.com/torino_tmt",
        siteName: "Instagram",
        type: 'tram'
    }, {
        idL: 6000,
        idH: 6005,
        url: "/vehicles/6001.webp",
        info: "https://www.tramditorino.it/tram_serie_6000.htm",
        credits: "torino_tmt",
        link: "https://www.instagram.com/torino_tmt",
        siteName: "Instagram",
        type: 'tram'
    }, {
        idL: 6006,
        idH: 6054,
        url: "/vehicles/6040.webp",
        info: "https://www.tramditorino.it/tram_serie_6000.htm",
        credits: "torino_tmt",
        link: "https://www.instagram.com/torino_tmt",
        siteName: "Instagram",
        type: 'tram'
    }, {
        idL: 8000,
        idH: 8100,
        url: "https://tramditorino.it/gallery/tram/8001xviiidic.jpg",
        info: "https://www.tramditorino.it/tram_serie_8000.htm",
        credits: "Tram di Torino",
        link: "https://www.tramditorino.it/tram_serie_8000.htm",
        siteName: "tramditorino.it",
        type: 'tram'
    },
] satisfies vehicleInternal[];

const vehiclesSup = [   //Vehicles on the Superga-Sassi special route, these IDs start with the letter D, eg. D1
    {
        idL: 1,
        idH: 1,
        url: "/vehicles/D1.webp",
        info: "https://www.tramditorino.it/superga_D1.htm",
        credits: "torino_tmt",
        link: "https://www.instagram.com/torino_tmt",
        siteName: "Instagram",
        modifier: "D_",
        type: 'tram a cremagliera'
    }, {
        idL: 2,
        idH: 3,
        url: "/vehicles/D3.webp",
        info: "https://www.tramditorino.it/superga_D2-D3.htm",
        credits: "torino_tmt",
        link: "https://www.instagram.com/torino_tmt",
        siteName: "Instagram",
        modifier: "D_",
        type: 'tram a cremagliera'
    }, {
        idL: 11,
        idH: 12,
        url: "https://www.tramditorino.it/gallery/tram/D12sassi.jpg",
        info: "https://www.tramditorino.it/superga_D11-D14.htm",
        credits: "Tram di Torino",
        link: "https://www.tramditorino.it/superga_D11-D14.htm",
        siteName: "tramditorino.it",
        modifier: "D_",
        type: 'tram a cremagliera'
    }, {
        idL: 13,
        idH: 14,
        url: "https://www.tramditorino.it/gallery/tram/D14.jpg",
        info: "https://www.tramditorino.it/superga_D11-D14.htm",
        credits: "Tram di Torino",
        link: "https://www.tramditorino.it/superga_D11-D14.htm",
        siteName: "tramditorino.it",
        modifier: "D_",
        type: 'tram a cremagliera'
    }
] satisfies vehicleInternal[];

const specialTram = [   //Green trams of the 2800 series
    {
        idL: 2807,
        idH: 2807,
        url: "/vehicles/2848.webp",
        info: "https://www.tramditorino.it/tram_serie_2800.htm",
        credits: "torino_tmt",
        link: "https://www.instagram.com/torino_tmt",
        siteName: "Instagram",
        type: 'tram'
    }, {
        idL: 2815,
        idH: 2815,
        url: "/vehicles/2848.webp",
        info: "https://www.tramditorino.it/tram_serie_2800.htm",
        credits: "torino_tmt",
        link: "https://www.instagram.com/torino_tmt",
        siteName: "Instagram",
        type: 'tram'
    }, {
        idL: 2848,
        idH: 2848,
        url: "/vehicles/2848.webp",
        info: "https://www.tramditorino.it/tram_serie_2800.htm",
        credits: "torino_tmt",
        link: "https://www.instagram.com/torino_tmt",
        siteName: "Instagram",
        type: 'tram'
    }, {
        idL: 2852,
        idH: 2852,
        url: "/vehicles/2848.webp",
        info: "https://www.tramditorino.it/tram_serie_2800.htm",
        credits: "torino_tmt",
        link: "https://www.instagram.com/torino_tmt",
        siteName: "Instagram",
        type: 'tram'
    }, {
        idL: 2855,
        idH: 2855,
        url: "/vehicles/2848.webp",
        info: "https://www.tramditorino.it/tram_serie_2800.htm",
        credits: "torino_tmt",
        link: "https://www.instagram.com/torino_tmt",
        siteName: "Instagram",
        type: 'tram'
    }
] satisfies vehicleInternal[];

const vehicleMetro = {  //The (at the moment unique) metro line
    idL: NaN,
    idH: NaN,
    url: "https://www.alstom.com/sites/alstom.com/files/styles/large_media_cover/public/2022/02/04/Torino_Metropolis.png?h=c291ccd9&itok=D9O1H_Bs",
    info: "https://www.tramditorino.it/metro_stazioni.htm",
    credits: "Alstom",
    link: "https://www.alstom.com/it/alstom-italia",
    siteName: "alstom.com",
    type: 'metropolitana'
} satisfies vehicleInternal;

//Return the matching image from a vehicle ID
export function getVehicle(id: string): vehicle | null {
    const supRegex = /D([0-9]{1,2})/i;    //Match any vehicle in service on the Superga-Sassi special route

    if (id.toLowerCase() === 'metro') {
        return {
            code: 1,
            url: vehicleMetro.url,
            info: vehicleMetro.info,
            credits: vehicleMetro.credits,
            link: vehicleMetro.link,
            siteName: vehicleMetro.siteName,
            type: vehicleMetro.type
        }
    } else if (supRegex.test(id)) {  //Superga-Sassi
        const match = id.match(supRegex) ?? [];
        const num = Number.parseInt(match[1]);

        for (const vc of vehiclesSup) {
            if (num >= vc.idL && num <= vc.idH) {
                return {
                    code: num,
                    url: vc.url,
                    info: vc.info,
                    credits: vc.credits,
                    link: vc.link,
                    siteName: vc.siteName,
                    modifier: vc.modifier,
                    type: vc.type
                } satisfies vehicle;
            }
        }
    } else {    //Bus, articulated bus or tram
        const num = Number.parseInt(id);
        const green = [2807, 2815, 2848, 2852, 2855];
        if (green.includes(num)) {   //Green tram
            for (const vc of specialTram) {
                if (num >= vc.idL && num <= vc.idH) {
                    return {
                        code: num,
                        url: vc.url,
                        info: vc.info,
                        credits: vc.credits,
                        link: vc.link,
                        siteName: vc.siteName,
                        type: vc.type
                    } satisfies vehicle;
                }
            }
        } else {    //Default case, regular route
            for (const vc of vehicles) {
                if (num >= vc.idL && num <= vc.idH) {
                    if (vc.info !== undefined) {
                        return {
                            code: num,
                            url: vc.url,
                            info: vc.info,
                            credits: vc.credits,
                            modifier: vc.modifier,
                            link: vc.link,
                            siteName: vc.siteName,
                            type: vc.type
                        } satisfies vehicle;
                    } else {
                        return {
                            code: num,
                            url: vc.url,
                            credits: vc.credits,
                            modifier: vc.modifier,
                            link: vc.link,
                            siteName: vc.siteName,
                            type: vc.type
                        } satisfies vehicle;
                    }
                }
            }
        }
    }

    return null;
}

interface vehicleBase {
    modifier?: string,      //Additional characters composing the vehicleID
    url: string,            //URL to image
    info?: string,          //Infos are only available for trams, thanks to www.tramditorino.it
    credits: string,        //Credits to the photographer
    link: string            //Link to the photographer's site/profile
    siteName: string        //Name of the photographer's site
    type: string            //Type of vehicle
}

interface vehicleInternal extends vehicleBase {
    idL: number,            //Lower bound of the ID range
    idH: number,            //Upper bound of the ID range
}

interface vehicle extends vehicleBase {
    code: number,           //Code of the matched vehicle (int) - not necessarily what was searched
}

