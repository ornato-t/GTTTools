import type { stop } from "$lib/stop";
import type { trip } from "$lib/trip";
import type { RequestHandler } from "@sveltejs/kit";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import type { Collection } from "mongodb";

export const GET: RequestHandler = async ({ params, locals }) => {
    const { trips }: { trips: Collection<trip> } = locals;

    return new Response(JSON.stringify(await pollStop(params.stop as string, trips)));
}

//Fetch all info regarding departing vehicles from a stop (by number)
async function pollStop(stop: string, db: Collection<trip>) {
    const url = 'http://percorsieorari.gtt.to.it/das_gtfsrt/trip_update.aspx';

    const tripsDB = await db.find({ "stops.id": Number.parseInt(stop) }).project({ _id: 0, trip_id: 1, route: 1, provider: 1, dates: 1, type_it: 1 }).toArray() as trip[];

    //Fetch and parse feed
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    const returned = new Array<stop>;
    const addedRoutes = new Array<string>;
    for (const entity of feed.entity) {
        for (const trip of tripsDB) {
            if (entity.id === trip.trip_id) {

                if (trip.route in addedRoutes) {
                    returned.forEach(el => { if (el.route === trip.route) el.pass.push(getDate(entity.tripUpdate?.timestamp as number | null | undefined)) })
                } else {
                    returned.push({
                        direction: trip.destination,
                        pass: [getDate(entity.tripUpdate?.timestamp as number | null | undefined)],
                        realTime: true,
                        route: trip.route,
                        routeID: trip.route,
                    })
                }

                break;
            }
        }
    }


    return returned;
}

//Returns a date object from a string formatted as HH:mm
function getDate(d: number | null | undefined) {
    if (d == null) return new Date();
    return new Date(d);
}
