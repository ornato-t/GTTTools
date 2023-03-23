import type { vehicle, vehicleWeb } from "$lib/vehicle";
import type { RequestHandler } from "@sveltejs/kit";
import { DateTime } from "luxon"

export const GET: RequestHandler = async ({ params }) => {
    return new Response(JSON.stringify(await pollRoute(params.route as string)));
}

async function pollRoute(route: string) {
    const url = `https://www.gtt.to.it/cms/components/com_gtt/views/percorsi/tmpl/proxydaslinea.php?serviceName=GetVeicoliPerLineaJson&linea=${route}`;
    const options = {
        method: 'GET',
        headers: {
            Referer: `https://www.gtt.to.it/cms/percorari/urbano`,
            mode: 'no-cors' as RequestMode
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
            full: vehicle.occupazione === 1 ? true : false

            //Rejected: they make the loading too slow
            // direction: await closestStopCode(vehicle.direzione, db),
            // closest: await closestStopGPS(vehicle.lat, vehicle.lon, db)
        });
    }

    return vehicles;
}

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

// async function closestStopGPS(lat: number, lon: number, db: Collection<stopDB>) {
//     const query = { coordinates: { $nearSphere: { $geometry: { type: 'point', coordinates: [lon, lat] } } } }
//     const projection = { _id: 0, coordinates: 0, city: 0 }

//     const res = await db.findOne(query, { projection }) as stopDB;

//     return res.name;
// }

// async function closestStopCode(code: number, db: Collection<stopDB>) {
//     const query = { code: code };
//     const projection = { _id: 0, coordinates: 0, city: 0 }

//     const res = await db.findOne(query, { projection }) as stopDB;
//     if(res != null) return res.name
//     return null;
// }