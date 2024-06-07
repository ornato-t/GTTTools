import type { stopDB } from "$lib/stopDB";
import type { trip } from "$lib/trip";
import type { vehicleSearched } from "$lib/vehicle";
import type { Collection, Filter } from "mongodb";
import { error } from "@sveltejs/kit";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import type { routeDB } from "$lib/routeDB";
import type { vehicleDB } from "$lib/vehicleDB";

export async function load({ params, locals, depends }) {
    const { vehicles } = locals;

    depends('vehicle');
    const code = params.vehicle;

    const res = await getVehicle(vehicles, code);
    if (res === null) throw error(404, 'No matching vehicle found');

    return {
        code: res.code,
        image: res.image,
        info: res.info,
        type: res.type,
        route: { promise: searchVehicle(params.vehicle, locals) }
    };
}

//Fetches the vehicle's info and image from the database
async function getVehicle(db: Collection<vehicleDB>, code: string) {
    let query: Filter<vehicleDB>;

    const match = code.match(/(\d+)(\w{0,1})/) ?? [];
    const codeStr = match[1] as string | undefined ?? '-1';
    const modifier = match[2];

    const codeNum = Number.parseInt(codeStr);

    if (codeNum === -1) {   //No numeric code, either "metro" or an error
        if (code === 'metro') query = { type: 1 };
        else return null;
    } else {
        if (modifier !== '') {
            query = { "id.high": { $gte: codeNum }, "id.low": { $lte: codeNum }, modifier: modifier };
        } else {
            query = { "id.high": { $gte: codeNum }, "id.low": { $lte: codeNum }, modifier: null };
        }
    }

    const res = await db.findOne(query, { projection: { _id: 0, id: 0 }, limit: 1 });
    if (res === null) return null;

    return { code: codeNum + (res.modifier ?? ''), ...res };
}

//Poll the GTFS-RT feed looking for the queried vehicle
async function searchVehicle(id: string, locals: App.Locals) {
    const url = 'https://percorsieorari.gtt.to.it/das_gtfsrt/vehicle_position.aspx';

    const { stops, trips, routes } = locals;

    //Fetch and parse feed
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    for (const doc of feed.entity) {
        const vehicleId = doc.vehicle?.vehicle?.label;
        if (vehicleId === id) {
            const idNum = Number.parseInt(id);
            const trip_id = doc.vehicle?.trip?.tripId as string;
            const routeGtfs = cleanRouteName(doc.vehicle?.trip?.routeId as string)
            return {
                id: idNum,
                lat: doc.vehicle?.position?.latitude as number,
                lon: doc.vehicle?.position?.longitude as number,
                updated: updatedDate(doc.vehicle?.timestamp as number | null | undefined),
                direction: doc.vehicle?.position?.bearing as number,
                trip_id,
                db: await getTripData(trip_id, routeGtfs, stops, trips, routes)
            } satisfies vehicleSearched;
        }
    }

    return null;
}


async function getTripData(trip_id: string, route: string, stops: Collection<stopDB>, trips: Collection<trip>, routes: Collection<routeDB>) {
    let trip = await trips.findOne({ trip_id }, { projection: { _id: 0 } }) as trip;
    if (trip === null) {
        trip = await getTrip(route, trips);
    }

    const stopCodes = trip?.stops.map(el => el.code) ?? [];

    const [routeDb, stopsDb] = await Promise.all([
        routes.findOne(
            { "code.internal": trip.route },
            { projection: { _id: 0, "code.internal": 1, "code.displayed": 1, name: 1 } }
        ) as Promise<{ code: { internal: string, displayed: string }, name: string }>,
        stops.find(
            { code: { $in: stopCodes } },
            { projection: { _id: 0, city: 0, } }
        ).toArray()
    ]);

    const stopsArr = stopsDb.map(r => ({
        code: r.code,
        name: r.name,
        description: r.description,
        coordinates: [r.coordinates[1], r.coordinates[0]],
        metro: r.metro,
        train: r.train,
        trainCode: r.trainCode
    })) satisfies stopDB[];

    return {
        destination: trip?.destination as string,
        shape: trip?.shape as number[][],
        stops: stopsArr,
        route: routeDb
    };
}


//Return an appropriate trip info for a rotue
async function getTrip(route: string, trips: Collection<trip>) {
    const aggr = [
        { $match: { route, "dates.startDate": { $lte: new Date() }, "dates.endDate": { $gte: new Date() }, [getDay()]: true } },
        { $facet: { one: [{ $match: { direction: 1 } }, { $sample: { size: 1 } }], zero: [{ $match: { direction: 0 } }, { $sample: { size: 1 } }] } },
        { $project: { result: { $concatArrays: ['$one', '$zero'] } } },
        { $unwind: '$result' },
        { $replaceRoot: { newRoot: '$result' } },
        { $project: { _id: 0, stops: 1, shape: 1, destination: 1 } }
    ];

    const fallbackAggr = [
        { $match: { route, "dates.startDate": { $lte: new Date() }, "dates.endDate": { $gte: new Date() } } },
        { $facet: { one: [{ $match: { direction: 1 } }, { $sample: { size: 1 } }], zero: [{ $match: { direction: 0 } }, { $sample: { size: 1 } }] } },
        { $project: { result: { $concatArrays: ['$one', '$zero'] } } },
        { $unwind: '$result' },
        { $replaceRoot: { newRoot: '$result' } },
        { $project: { _id: 0, stops: 1, shape: 1, destination: 1 } }
    ];

    let res = await trips.aggregate<trip>(aggr).toArray();  //First test with stricter match
    if (res.length === 0) {    //Run query twice if it has yielded no results. This is more likely to succeed
        res = await trips.aggregate<trip>(fallbackAggr).toArray();  //Then fallback to more lax query
    }

    if (res.length === 0) throw error(404, 'No matching route found');

    return res[0]

    //Get the current weekday and return an appropriate date query
    function getDay() {
        const d = new Date();

        switch (d.getDay()) {
            case 0:
                return "dates.sunday";
            case 1:
                return "dates.monday";
            case 2:
                return "dates.tuesday";
            case 3:
                return "dates.wednesday";
            case 4:
                return "dates.thursday";
            case 5:
                return "dates.friday";
            case 6:
                return "dates.saturday";
            default:    //This shouldn't happen
                return "dates.monday";
        }
    }
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
