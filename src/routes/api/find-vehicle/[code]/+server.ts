import type { vehicleSearched } from "$lib/vehicle";
import type { RequestHandler } from "@sveltejs/kit";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";

export const GET: RequestHandler = async ({ params }) => {
    return new Response(JSON.stringify(await searchVehicle(params.code as string)));
}

//Poll the GTFS-RT feed looking for the queried vehicle
async function searchVehicle(id: string) {
    const url = 'http://percorsieorari.gtt.to.it/das_gtfsrt/vehicle_position.aspx';

    //Fetch and parse feed
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    for (const doc of feed.entity) {
        const vehicleId = doc.vehicle?.vehicle?.label;
        if (vehicleId === id) {
            const idNum = Number.parseInt(id);
            return {
                id: idNum,
                route: cleanRouteName(doc.vehicle?.trip?.routeId as string),
                lat: doc.vehicle?.position?.latitude as number,
                lon: doc.vehicle?.position?.longitude as number,
                updated: updatedDate(doc.vehicle?.timestamp as number | null | undefined),
                direction: doc.vehicle?.position?.bearing as number,
                trip_id: doc.vehicle?.trip?.tripId as string
            } satisfies vehicleSearched;
        }

    }

    return null;
}

//Converts a timestamp to a date object
function updatedDate(date: number | null | undefined) {
    if (date == null) return new Date();
    return new Date(date * 1000 as number);
}

//Drop the last character "U" from the route name
function cleanRouteName(route: string) {
    return route.substring(0, route.length - 1);
}