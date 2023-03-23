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
    const routes = feed.entity.filter(element => element.tripUpdate?.trip.routeId == route);

    return routes.map(doc => {
        return {
            id: Number.parseInt(doc.vehicle?.vehicle?.label as string),
            vehicleType: vehicleName(doc.vehicle?.vehicle?.label) as string,
            lat: doc.vehicle?.position?.latitude as number,
            lon: doc.vehicle?.position?.longitude as number,
            updated: updatedDate(doc.vehicle?.timestamp as number | null | undefined),
            full: doc.vehicle?.occupancyStatus as number,
            direction: doc.vehicle?.position?.bearing as number | null,
        } satisfies vehicle;
    })

    //Fetch GTFSRT endpoint
    //Array.filter only elements with ROUTE - TODO: send code in matching format, es: '10U'
    //No DB query should be necessary
    //Consider (test speed) when adding db query for each vehicle on route matching direction_id and trip_id on trips (or trips_full), it returns the headsign
    //Actually I don't even need to do that. It's either 1 or 0. I won't know what those numbers will mean but I can diferentiate between the two

    //NOTE: sometimes the GTFS API goes down. Keep other API as fallback
}

//Returns the full word "Bus" or "Tram"
//TODO: add function matching ID with type of vehicle
function vehicleName(initial: string | null | undefined) {
    return initial;
    if (initial == null) return 'Sconosciuto';

    if (initial === 'B') return 'Bus';
    if (initial === 'T') return 'Tram';
}

//Converts a timestamp to a date object
function updatedDate(date: number | null | undefined) {
    if (date == null) return new Date();
    return new Date(date as number);
}
