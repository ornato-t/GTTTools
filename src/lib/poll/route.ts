import type { vehicle, vehicleWeb } from "$lib/vehicle";
import { error } from "@sveltejs/kit";
import { DateTime } from "luxon"
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

export async function poll(codeIn: string) {
    const code = parseRouteCode(codeIn);

    try {
        const gtfsRes = await pollGTFS(code);
        if (gtfsRes.length === 0) throw new Error();
        return gtfsRes;
    } catch (_) {
        try {
            return await pollRoute(code);
        } catch (_) {
            throw error(503, 'GTT API offline');
        }
    }
}

//Converts a GTTTools code to a GTT one. They are mostly the same, only different in a few cases
function parseRouteCode(codeIn: string): string {
    const starRegex = /STAR (\d)/;
    const star = codeIn.match(starRegex);

    const barRegex = /(\d+)\//;
    const bar = codeIn.match(barRegex);

    if (star) return `ST${star[1]}`;
    if (bar) return `${bar[1]}B`;

    return codeIn;
}

//Polls a route on the GTT website API endpoint
async function pollRoute(route: string) {
    const url = `https://www.gtt.to.it/cms/components/com_gtt/views/percorsi/tmpl/proxydaslinea.php?serviceName=GetVeicoliPerLineaJson&linea=${route}`;
    const options = {
        method: 'GET',
        headers: {
            Referer: `https://www.gtt.to.it/cms/percorari/urbano`,
            mode: 'no-cors' as RequestMode,
        }
    };

    const response = await fetch(url, options);
    const vehiclesWeb: vehicleWeb[] | null = await response.json();
    if (vehiclesWeb === null) return [];

    const vehicles = new Array<vehicle>;

    for (const vehicle of vehiclesWeb) {
        vehicles.push({
            id: vehicle.id,
            vehicleType: vehicleName(vehicle.tipo),
            lat: vehicle.lat,
            lon: vehicle.lon,
            updated: updatedDate(vehicle.aggiornamento),
            direction: vehicle.direzione,
        });
    }

    return vehicles;

    //Returns the full word "Bus" or "Tram"
    function vehicleName(initial: string) {
        if (initial === 'B') return 'Bus';
        if (initial === 'T') return 'Tram';
        return initial;
    }

    //Converts a date string in the format "DD/MM/YYYY HH:mm" to a date object
    function updatedDate(dateStr: string) {
        const res = DateTime.fromFormat(dateStr, 'D H:mm', { locale: 'it', zone: 'Europe/Rome' });

        return res.toJSDate();
    }

}

//Polls a route on the GTFS API endpoint
async function pollGTFS(route: string) {
    const url = 'https://percorsieorari.gtt.to.it/das_gtfsrt/vehicle_position.aspx';

    //Fetch and parse feed
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    const returned = new Array<vehicle>;    //Array of routes matching the queried one
    for (const doc of feed.entity) {
        if (doc.vehicle?.trip?.routeId === route + 'U') {
            const idNum = Number.parseInt(doc.vehicle?.vehicle?.label as string);

            returned.push({
                id: idNum,
                vehicleType: vehicleName(idNum),
                lat: doc.vehicle?.position?.latitude as number,
                lon: doc.vehicle?.position?.longitude as number,
                updated: updatedDate(doc.vehicle?.timestamp as number | null | undefined),
                direction: doc.vehicle?.position?.bearing as number,
                // full: doc.vehicle?.occupancyStatus as number,
            });
        }
    }

    return returned;

    //Returns the full word "Bus" or "Tram"
    function vehicleName(initial: number | null | undefined) {
        if (initial == null) return 'Sconosciuto';

        if ((initial >= 2800 && initial < 2900) || (initial >= 5000 && initial < 9000)) return 'Tram';
        else return 'Bus';
    }

    //Converts a timestamp to a date object
    function updatedDate(date: number | null | undefined) {
        if (date == null) return new Date();
        return new Date(date * 1000 as number);
    }
}