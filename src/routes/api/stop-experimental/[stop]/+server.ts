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
    const addedRoutes = new Array<string>;  //Temporary array, saves trips that have already been added

    //Match trips and entities, return the ones related to the desired stop
    for (const match of findIntersection(feed.entity, tripsDB)) {   //For each match between a trip in the feed and one on the db
        const { db, entity } = match;

        if (addedRoutes.includes(db.route)) {   //If the route is already in the returned route list
            for (const el of returned) {    //Find the matching route and push
                if (el.route === db.route) {
                    const time = matchStop(entity.tripUpdate?.stopTimeUpdate as stopTimeGTFS[], db.stops, stop);
                    if (time != null) el.pass.push(getDate(time));
                    break;
                }
            }

        } else {    //Otherwise simply push it
            const time = matchStop(entity.tripUpdate?.stopTimeUpdate as stopTimeGTFS[], db.stops, stop);
            if (time != null) {
                addedRoutes.push(db.route);
                returned.push({
                    route: db.route,
                    routeID: db.route,
                    direction: db.destination,
                    pass: [getDate(time)],
                    realTime: true,
                })
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

//Find the intersection between a GTFS entity feed and a collection of trips (comparing trip_ids)
//Returns an array containing the two objects
function findIntersection(feed: GtfsRealtimeBindings.transit_realtime.IFeedEntity[], db: trip[]) {
    const set = new Set(db.map(obj => obj.trip_id));
    const intersection = [];


    for (const obj of feed) {
        if (set.has(obj.id)) {
            const dbObj = db.find(item => item.trip_id === obj.id);

            if (dbObj != null) intersection.push({ db: dbObj, entity: obj });
        }
    }

    return intersection;
}

interface stopTimeGTFS {
    stopSequence: number;
    departure: { time: Long | number };
}