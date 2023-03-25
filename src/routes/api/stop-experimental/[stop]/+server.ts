import type { stop } from "$lib/stop";
import type { trip } from "$lib/trip";
import type { RequestHandler } from "@sveltejs/kit";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import type { Collection, Long } from "mongodb";

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

    const returned = new Array<stop>;   //Array of returned stop objects
    const addedRoutes = new Array<string>;  //Temporary array

    /*
        Match trips and entities, return the ones related to the desired stop.
        This is hardly readable, but better for complexity. We have hundred of trips so it's relevant 
    */

    for (const entity of feed.entity) { //Loop through entities (feed entries)
        for (const trip of tripsDB) {   //Loop through trips (db entries)
            if (entity.id === trip.trip_id) {   //Match trips and entities
                if (addedRoutes.includes(trip.route)) { // Is this entity already present in the returned ones?
                    for (const el of returned) {    //If true, find the matching one and push the passage time
                        if (el.route === trip.route) {
                            el.pass.push(getDate(entity.tripUpdate?.timestamp as Long | null | undefined));
                            break;
                        }
                    }
                } else {    //If false, create a new returned object
                    addedRoutes.push(trip.route);
                    returned.push({
                        route: trip.route,
                        routeID: trip.route,
                        direction: trip.destination,
                        pass: [getDate(entity.tripUpdate?.timestamp as Long | null | undefined)],
                        realTime: true,
                    })
                }
                break;
            }
        }
    }

    //Unfortunately the dates (passage times) aren't sorted in the feed, so we have to sort them manually
    for (const el of returned) {
        el.pass.sort((a: Date, b: Date) => {
            if (a < b) return -1;
            if (a < b) return 1;
            return 0;
        })
    }


    //Lastly, sort by route names
    returned.sort((a: stop, b: stop) => {
        if (a.routeID < b.routeID) return -1;
        if (a.routeID < b.routeID) return 1;
        return 0;
    })

    return returned;
}

//Returns a date object from a string formatted as HH:mm
function getDate(d: Long | null | undefined) {
    console.log('Date:', d);
    if (d == null) return new Date();
    return new Date(d.low * 1000);
}

