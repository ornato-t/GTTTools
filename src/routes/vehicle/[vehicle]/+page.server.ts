import type { stopDB } from "$lib/stopDB";
import type { trip } from "$lib/trip";
import type { vehicleSearched } from "$lib/vehicle";
import { error } from "@sveltejs/kit";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import type { Collection } from "mongodb";

export async function load({ params, locals }) {
    return {
        route: { promise: searchVehicle(params.vehicle, locals) }
    };
}

//Poll the GTFS-RT feed looking for the queried vehicle
async function searchVehicle(id: string, locals: App.Locals) {
    const url = 'http://percorsieorari.gtt.to.it/das_gtfsrt/vehicle_position.aspx';

    const { stops, trips } = locals;

    //Fetch and parse feed
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    for (const doc of feed.entity) {
        const vehicleId = doc.vehicle?.vehicle?.label;
        if (vehicleId === id) {
            const idNum = Number.parseInt(id);
            const trip_id = doc.vehicle?.trip?.tripId as string;
            const route = cleanRouteName(doc.vehicle?.trip?.routeId as string)
            return {
                id: idNum,
                route,
                lat: doc.vehicle?.position?.latitude as number,
                lon: doc.vehicle?.position?.longitude as number,
                updated: updatedDate(doc.vehicle?.timestamp as number | null | undefined),
                direction: doc.vehicle?.position?.bearing as number,
                trip_id,
                db: await getTripData(trip_id, route, stops, trips)
            } satisfies vehicleSearched;
        }
    }

    return null;
}


async function getTripData(trip_id: string, route: string, stops: Collection<stopDB>, trips: Collection<trip>,) {
    let trip = await trips.findOne({ trip_id }, { projection: { _id: 0 } }) as trip;
    if (trip === null) {
        trip = await getTrip(route, trips);
    }

    const stopCodes = trip?.stops.map(el => el.code) ?? [];
    const res = await stops.find({ code: { $in: stopCodes } }, { projection: { _id: 0, city: 0, } }).toArray();
    const stopsArr = res.map(r => ({
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
        stops: stopsArr
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
