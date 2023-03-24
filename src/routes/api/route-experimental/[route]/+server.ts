import type { vehicle } from "$lib/vehicle";
import type { RequestHandler } from "@sveltejs/kit";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

export const GET: RequestHandler = async ({ params }) => {
    return new Response(JSON.stringify(await pollRoute(params.route as string)));
}

async function pollRoute(route: string) {
    const url = 'http://percorsieorari.gtt.to.it/das_gtfsrt/vehicle_position.aspx';

    //Fetch and parse feed
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    //Array of routes matching the queried one
    const routes = feed.entity.filter(element => element.vehicle?.trip?.routeId == route);

    return routes.map(doc => {
        const idNum = Number.parseInt(doc.vehicle?.vehicle?.label as string);
        return {
            id: idNum,
            vehicleType: vehicleName(idNum),
            lat: doc.vehicle?.position?.latitude as number,
            lon: doc.vehicle?.position?.longitude as number,
            updated: updatedDate(doc.vehicle?.timestamp as number | null | undefined),
            // full: doc.vehicle?.occupancyStatus as number,
            // direction: doc.vehicle?.position?.bearing as number | null,
        } satisfies vehicle;
    })
}

//Returns the full word "Bus" or "Tram"
function vehicleName(initial: number | null | undefined) {
    if (initial == null) return 'Sconosciuto';

    if ((initial >= 2800 && initial < 2900) || initial >= 5000) return 'Tram';
    else return 'Bus';
}

//Converts a timestamp to a date object
function updatedDate(date: number | null | undefined) {
    if (date == null) return new Date();
    return new Date(date * 1000 as number);
}
