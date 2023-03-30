import type { stop } from "$lib/stop";
// import type { stopDB } from "$lib/stopDB";
import type { trip, trip_stop } from "$lib/trip";
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

    const tripsDB = await db.find({ "stops.id": stop }).project({ _id: 0 }).toArray() as trip[];

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
                            const time = matchStop(entity.tripUpdate?.stopTimeUpdate as stopTimeGTFS[], trip.stops, stop);
                            if (time === null) break;

                            el.pass.push(getDate(time));
                            break;
                        }
                    }
                } else {    //If false, create a new returned object
                    const time = matchStop(entity.tripUpdate?.stopTimeUpdate as stopTimeGTFS[], trip.stops, stop);
                    if (time === null) break;

                    addedRoutes.push(trip.route);
                    returned.push({
                        route: trip.route,
                        routeID: trip.route,
                        direction: trip.destination,
                        pass: [getDate(time)],
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
//Depending on the runtime, d is either parsed as a Long or a number, so we have to watch for both cases
function getDate(d: Long | number) {
    if (d == null) return new Date();   //d is of type null or undefined
    if (typeof d === 'number') return new Date(d * 1000);   //d is of type number
    return new Date(d.low * 1000);  //d is of type Long
}

//Matches a queried stop with a route from the DB, then matches that with the feed entries
//Returns either the passage time or null if no passage is found (too early or too late, hasn't been calculated yet)
function matchStop(stopTimeArr: stopTimeGTFS[], stopTimeDBArr: trip_stop[], stopCode: string) {
    const stop = stopTimeDBArr.filter(stop => stop.id === stopCode);

    if (stop.length > 1) console.log('Warning, found multiple matches for the same stop:', stop);
    else if (stop.length === 0) return null;

    const stopRT = stopTimeArr.filter(rt => stop[0].sequence === rt.stopSequence);

    if (stopRT.length > 1) console.log('Warning, found multiple matches for the same sequence number:', stop);
    else if (stopRT.length === 0) return null;


    return stopRT[0].departure.time;

}
interface stopTimeGTFS {
    stopSequence: number;
    departure: { time: Long | number };
}