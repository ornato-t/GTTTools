import type { stop } from "$lib/stop";
import type { tripDB } from "$lib/tripDB";
import type { RequestHandler } from "@sveltejs/kit";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import type { Collection } from "mongodb";

export const GET: RequestHandler = async ({ params, locals }) => {
    const { trips }: { trips: Collection<tripDB> } = locals;

    return new Response(JSON.stringify(await pollStop(params.stop as string, trips)));
}

//Fetch all info regarding departing vehicles from a stop (by number)
async function pollStop(stop: string, db: Collection<tripDB>) {
    const url = 'http://percorsieorari.gtt.to.it/das_gtfsrt/trip_update.aspx';

    //Fetch and parse feed
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    const trips = db.find({"stops.id": Number.parseInt(stop)});

    return null;
}

//Returns a date object from a string formatted as HH:mm
function dateFromHourStr(str: string) {
    return new Date(str);
}

//Renames bus substituting trams, called "X navetta" to "XN", as shown on the bus themselves
function parseBusN(bus: string) {
    if (!bus.includes('navetta')) return bus;

    return bus.replace(' navetta', 'N');
}